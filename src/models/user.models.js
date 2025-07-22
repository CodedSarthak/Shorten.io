import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const UserSchema = mongoose.Schema({

    name : 
    {
        type : String,
        required : true
    },
    password : 
    {
        type : String, 
        required : true
    },
    email : 
    {
        type : String,
        required : true,
        unique : true
    },
    refreshTokens: 
    {
        type: [String],
        default: []
    }
},
{timestamps : true})

UserSchema.methods.generateAccessTokens = async function () {

    try 
    {
        const token = jwt.sign(
            {
                _id : this._id , 
                email : this.email ,
                name : this.name
            },
            process.env.ACCESS_TOKEN_SECRET, 
            {
                expiresIn : process.env.ACCESS_TOKEN_EXPIRY
            }
        )

        return token;
    } 
    catch (error) 
    {
        throw new Error("error in generating access token");
    }
}

UserSchema.methods.generateRefreshTokens = async function () {
    try 
    {
        const token = jwt.sign(
            {
                _id: this._id,
                email: this.email,
                name: this.name
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            }
    );

    this.refreshTokens.push(token);
    await this.save();

    return token;

    } 
    catch (error) 
    {
        throw new Error("error in generating refresh token");
    }
}

UserSchema.pre("save", async function (next) {
    
    if (!this.isModified("password")) return next();

    try 
    {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next(); 
    } 
    catch (error) 
    {
        next(error);
    }
})


const User = mongoose.model('User', UserSchema);

export default User;