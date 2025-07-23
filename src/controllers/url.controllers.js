import Url from '../models/url.models.js'
import Stats from '../models/stats.models.js'
import User from '../models/user.models.js';

import getNextCount from '../utils/counter.js'
import { encodeBase62 } from '../utils/base62.js'

import { client } from '../config/redisClient.js';

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

        return res.redirect(urlEntry.longURL);

    } 
    catch (error) 
    {
        console.error("Error in redirectURL:", error);
        return res.status(500).json({ error: "Server error" });
    }

}

const statsURL = async (req, res) => {

}

export {
    shortenURL,
    redirectURL,
    statsURL
}


