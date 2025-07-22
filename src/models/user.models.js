import mongoose from "mongoose";

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
    refreshTokens : 
    {
        type : String
    }

},
{timestmaps : true})

const User = mongoose.model('User', UserSchema);

export default User;