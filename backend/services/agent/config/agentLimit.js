import redis from "../../../shared/redis/redis.js";

const Limits = {
  chat: 20,
  coding: 5,
  pdf: 5,
  ppt: 5,
  vision: 3,
  search: 5,
};
export const checkAgentLimit = async (userId, agent) => {
  const max = Limits[agent] || Limits["chat"];
  const key = `rate:${userId}:${agent}`;
  const count = await redis.incr(key);
  if (count == 1) {
    await redis.expire(key, 60);
  }
  const ttl = await redis.ttl(key);
  if (count > max) {
    const mintues = Math.floor(ttl / 60);
    const seconds = ttl % 60;
    const time = mintues > 0 ? `${mintues}m: ${seconds}` : `${seconds}s`;
    const error = new Error(`Rate Limit exceed for ${agent}.`);
    error.data = {
      success: false,
      agent,
      limit: max,
      remainingTime: ttl,
      retryAfter: time,
      message: `You have reached the ${agent} limit ${max} requests/minute. Try again in ${time}`,
    };
    throw error;
  }
  return {
    remaining: max - count,
    limit: max,
  };
};
