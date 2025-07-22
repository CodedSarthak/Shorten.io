import jwt from 'jsonwebtoken';
import User from '../models/user.models.js'

import dotenv from 'dotenv';
dotenv.config();


const verifyAccess = async (req, res, next) => {
    
    try 
    {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token)
        {
            return res.status(401)
                      .json({message : "Unauthorized Request"});
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-refreshTokens");

        if (!user)
        {
            return res.status(401)
                      .json({message : "Invalid Access Token"});
        }

        req.user = user;

        next();
    } 
    catch (error) 
    {
        console.error("Access token verification failed:", error.message);
        return res.status(401)
                  .json({ message: "Invalid or expired access token" });
    }
}

export default verifyAccess;