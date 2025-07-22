import redis from "redis";
import dotenv from "dotenv";

dotenv.config();

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  password: process.env.REDIS_PASSWORD,

  retry_strategy: (options) => {
    if (options.error && options.error.code === "ECONNREFUSED") 
    {
      logger.error("Redis server refused connection");
      return new Error("The server refused the connection");
    }
    if (options.total_retry_time > 1000 * 60 * 60) 
    {
      logger.error("Redis retry time exhausted");
      return new Error("Retry time exhausted");
    }
    if (options.attempt > 10) 
    {
      logger.error("Redis max retries reached");
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  },
});

client.on("error", (err) =>
  logger.error("Redis Client Error:", { error: err })
);
client.on("connect", () => console.log("Redis client connecting"));
client.on("ready", () => console.log("Redis client ready"));
client.on("reconnecting", () => console.log("Redis client reconnecting"));

async function connectRedis() {
  try 
  {
    await client.connect();
    console.log("Redis Connected Successfully");
  } 
  catch (error) 
  {
    logger.error("Redis Connection Error:", { error });
    throw error;
  }
}

export { client };
export default connectRedis;
