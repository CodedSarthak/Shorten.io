import Url from '../models/url.models.js'
import Stats from '../models/stats.models.js'
import User from '../models/user.models.js';

import getNextCount from '../utils/counter.js'
import { encodeBase62 } from '../utils/base62.js'

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


}

const statsURL = async (req, res) => {

}

export {
    shortenURL,
    redirectURL,
    statsURL
}


