import mongoose from "mongoose";

const UrlSchema = mongoose.Schema({

    shortID : 
    {
        type : String, 
        required : true
    },
    longURL : 
    {
        type : String, 
        required : true
    }, 
    owner : 
    {
        type : mongoose.Schema.Types.ObjectId, 
        ref : 'User'
    },
},
{timestamps : true})

const Url = mongoose.model('Url', UrlSchema);

export default Url;