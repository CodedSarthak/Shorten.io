import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    
    try 
    {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongodb connected Successfully");
    } 
    catch (error) 
    {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }

}

export default connectDB;