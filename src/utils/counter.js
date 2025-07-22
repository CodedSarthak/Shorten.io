import {client} from '../config/redisClient.js';
import dotenv from 'dotenv';

dotenv.config();

async function getNextCount(counterKey = "request:counter") {
  try 
  {
    const count = await client.incr(counterKey); 
    return count;
  } 
  catch (err) 
  {
    console.error("Error incrementing counter:", err);
    throw err;
  }
}

export default getNextCount;
