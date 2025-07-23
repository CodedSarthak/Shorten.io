import mongoose from "mongoose";

const StatsSchema = mongoose.Schema({

    shortID : 
    {
        type : mongoose.Schema.Types.ObjectId,
        unique : true
    },
    lastAccessed: 
    {
        type: Number,
        default: () => Date.now()  
    },
    geoDistribution: 
    {
        type: Map,
        of: Number,
        default: {}
    }, 
    clicked : 
    {
        type  : Number,
        default: 0
    },
},
{timestamps : true})

const Stats = mongoose.model('Stats', StatsSchema);

export default Stats;