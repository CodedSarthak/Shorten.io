import Url from '../models/url.models.js'
import Stats from '../models/stats.models.js'
import User from '../models/user.models.js';

import getNextCount from '../utils/counter.js'
import { encodeBase62 } from '../utils/base62.js'

import { client } from '../config/redisClient.js';

import geoip from 'geoip-lite';

const shortenURL = async (req, res) => {
    
    try 
    {
        const userID = req.user._id;

        const {longURL} = req.body;

        if (!longURL)
        {
            return res.status(400)
                      .json({message : "Enter the long url first."});
        }

        const count = await getNextCount();

        const ShortURL = encodeBase62(count);

        const saveShortURL = new Url({
            shortID : ShortURL,
            longURL : longURL, 
            owner : userID,
        })

        await saveShortURL.save();

        return res.status(200)
                  .json({message : "Short URL created successfully",
                    shortID : ShortURL,
                    ShortURL : `${process.env.BASE_URL}/${ShortURL}`,
                  })
    } 
    catch (error) 
    {
        console.error("Error in shortening URL:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const redirectURL = async (req, res) => {

    const { ShortUrl } = req.params;

    // Redis -> {shortUrl , longUrl}

    const redisKey = `short:${ShortUrl}`;

    try 
    {
        const cachedlongURL = await client.get(redisKey);

        if (cachedlongURL)
        {
            return res.redirect(cachedlongURL);
        }

        const urlEntry = await Url.findOne({shortID : ShortUrl});

        if (!urlEntry) 
        {
            return res.status(404).json({ error: "Short URL not found" });
        }

        //cache
        await client.setEx(redisKey , 86400, urlEntry.longURL); //TTL : 1d

        //Saving to stats model
        const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
        const geo = geoip.lookup(ip);
        const countryCode = geo?.country || 'UNKNOWN';

        let stats = await Stats.findOne({shortID : urlEntry._id});

        if (stats)
        {
            stats.clicked += 1;
            stats.lastAccessed = Date.now();
            const existingCount = stats.geoDistribution.get(countryCode) || 0;
            stats.geoDistribution.set(countryCode, existingCount + 1);
        }
        else
        {
            stats = new Stats ({
                shortID: urlEntry._id,
                clicked: 1,
                lastAccessed: Date.now(),
                geoDistribution: new Map([[countryCode, 1]])
            })
        }

        await stats.save();

        return res.redirect(urlEntry.longURL);

    } 
    catch (error) 
    {
        console.error("Error in redirectURL:", error);
        return res.status(500).json({ error: "Server error" });
    }

}

const statsURL = async (req, res) => {

    const { ShortUrl } = req.params;

    try 
    {
        const urlEntry = await Url.findOne({ shortID: ShortUrl });

        if (!urlEntry) 
        {
            return res.status(404).json({ error: "Short URL not found" });
        }

        const stats = await Stats.findOne({shortID : urlEntry._id});

        if (!stats) 
        {
            return res.status(404).json({ error: "No stats found" });
        }

        return res.status(200)
                  .json({message : "Fetched Successfully", 
                    stats: 
                    {
                        clicked: stats.clicked,
                        lastAccessed: stats.lastAccessed,
                        geoDistribution: Object.fromEntries(stats.geoDistribution), 
                        createdAt: stats.createdAt,
                        updatedAt: stats.updatedAt
                    }
                  });
    } 
    catch (error) 
    {
        console.error("Error in Stats:", error);
        return res.status(500).json({ error: "Server error" });
    }
}

export {
    shortenURL,
    redirectURL,
    statsURL
}


