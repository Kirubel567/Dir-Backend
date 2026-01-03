import redisClient from "../config/redis.js";

export const getOrSetCache = async (key, cb, ttl = 3600) => {
    try {
        // trying to get data from Redis
        const cachedData = await redisClient.get(key);

        if(cachedData){
            //Cache Hit Scenario
            return JSON.parse(cachedData)
        }

        // cache miss sceanario
        const freshData = await cb();

        // storing the result in redis with expiration
        if(freshData){
            await redisClient.setEx(key,ttl, JSON.stringify(freshData))
        }

        return freshData;
    } catch (error) {
        console.error("Redis Cache Error: ", error)
        return await cb(); // returning to db 
    }
}