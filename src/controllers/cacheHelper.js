import redisClient from "../config/redis.js";

export const getOrSetCache = async (key, cb, ttl = 3600) => {
  try {
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const freshData = await cb();

    if (freshData) {
      await redisClient.set(key, JSON.stringify(freshData), { EX: ttl });
    }
    return freshData;
  } catch (error) {
    console.error("Redis Cache Error:", error);
    return await cb();
  }
};
