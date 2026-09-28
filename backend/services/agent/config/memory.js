import redis from "../../../shared/redis/redis.js";
import { getMessages } from "../utils/getMessages.js";
export const getMemory = async (conversationId) => {
  try {
    const key = `messages-${conversationId}`;
    const cache = await redis.get(key);
    if (cache) {
      return JSON.parse(cache);
    }
    const message = await getMessages(conversationId);
    await redis.set(key, JSON.stringify(message), "EX", 24 * 60 * 60);
    return message;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const addMessage = async (conversationId, role, content) => {
  try {
    const key = `messages-${conversationId}`;
    const rawMessage = await redis.get(key)
    const messages=rawMessage?JSON.parse(rawMessage):[]
    messages.push({role,content})
    if(messages.length > 20){
        messages.shift()
    }
    await redis.set(key,JSON.stringify(messages))

  } catch (err) {
    console.log(err);
  }
};
