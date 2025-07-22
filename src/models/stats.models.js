import mongoose from "mongoose";

const StatsSchema = mongoose.Schema({

    shortID : 
    {
        type : mongoose.Schema.Types.ObjectId,
        unique : true
    },
    timestamp: 
    {
        type: Number,
        default: () => Date.now()  
    },
    geo : 
    {
        type : String
    }
},
{timestamps : true})

const Stats = mongoose.model('Stats', StatsSchema);

export default Stats;