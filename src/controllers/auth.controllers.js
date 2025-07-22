import User from '../models/user.models';
import bcrypt from 'bcrypt';

const generateAccessandRefreshTokens = async(userId) => {
    
    try 
    {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessTokens();
        const refreshToken = await user.generateRefreshTokens();
    
        return {accessToken, refreshToken};
    } 
    catch (error) 
    {
        throw new Error(error.message);
    }
}

const register = async (req,res) => {

    try 
    {
        const {name, email, password} = req.body;
    
        if (!name || !email || !password)
        {
            return res.status(400)
                      .json({ message: "Required all the fields" });
        }
    
        const Existinguser = await User.findOne({email});
    
        if (Existinguser)
        {
            return res.status(400)
                      .json({ message: "User already registered" });
        }
    
        const newUser = await new User({name, email, password});

        const savedUser = await newUser.save();

        const registeredUser = await User.findById(savedUser._id).select("-password -refreshTokens");

        return res.status(200)
                  .json({ message: "User registered successfully" , 
                    user: registeredUser });
    } 
    catch (error) 
    {
        console.log("Error in registering", error);
        return res.status(500)
                  .json({ message: "Server error. Please try again later." });
    }    
}

const login = async (req,res) => {

    try 
    {
        const {email, password} = req.body;
    
        if (!email || !password)
        {
            return res.status(400)
                      .json({ message: "Required all the fields" });
        }

        const user = await User.findOne({email});

        if (!user)
        {
            return res.status(400)
                      .json({ message: "Please Register First" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect)
        {
            return res.status(400)
                      .json({ message: "Incorrect password." });
        }

        const {accessToken, refreshToken} = await generateAccessandRefreshTokens(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshTokens");

        const options = {
            httpOnly : true, 
            secure : true
        }

        return res
                    .cookie("AccessToken", accessToken, options)
                    .cookie("RefreshToken", refreshToken, options)
                    .status(200)
                    .json({message : "User logged in successfully", 
                        user : loggedInUser
                      });

    } 
    catch (error) 
    {
        console.log("Error in Login", error);
        return res.status(500)
                  .json({ message: "Server error. Please try again later." });
    }
}

const logout = async (req, res) => {

    try 
    {
        const refreshToken = req.cookies?.RefreshToken;

        if (!refreshToken) 
        {
            return res.status(400).json({ message: "Refresh token not found in cookies." });
        }

        await User.findByIdAndUpdate(
            req.user._id,
            {
                $pull: 
                { 
                    refreshTokens: refreshToken 
                } 
            },
            {
                new : true
            }
        );

        const options = {
            httpOnly : true, 
            secure : true,
            path: "/"
        }

        return res.status(200)
        .clearCookie("AccessToken", options)
        .clearCookie("RefreshToken", options)
        .json({message : "Logout Done Successfully"});
        
    } 
    catch (error) 
    {
        return res.status(500)
                  .json({message : "Problem while logging out. "});
    }
}


export {
    register, 
    login,
    logout
}