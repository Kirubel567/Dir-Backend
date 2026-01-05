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

//added this to handle cache invalidation specifically for webhook events
export const getDiscoveryKey = (userId) => `repos:discovery:${userId}`;
export const getActiveListKey = (userId) => `repos:active:${userId}`;
export const getRepoDetailKey = (repoId) => `repos:detail:${repoId}`;

//wipe all internal cache when webhook request a push request
//also as the changes affect the users discovery and active repos list we will also invalidate the cache
export const invalidateRepoCache = async (userId, repoId) => {
  const keys = [getRepoDetailKey(repoId)];
  
  if (userId) {
    keys.push(getDiscoveryKey(userId));
    keys.push(getActiveListKey(userId));
  }

  try {
    await redisClient.del(keys);
  } catch (err) {
    console.error("Cache Invalidation Error:", err);
  }
};