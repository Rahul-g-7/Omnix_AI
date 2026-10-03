import { getModel } from "../config/llmModels.js";
import axios from "axios";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { deductCredits } from "../utils/deductCredits.js";

export const visionAgent = async (state) => {
  try {
    await deductCredits(state.userId, "vision");
    const llm = await getModel("image");
    const res = await llm.invoke(`
    You are an elite AI image prompt engineer.
    
    Convert the user request into a highly detailed image generation prompt.

    Requirements:

    -Cinematic lighting
    -Professional photography
    -8k resolution
    -Sharp focus
    - Ultra photorealistic details 
    -Depth of field
    -Stunning visuals
    -Premium quality
    -high definition
    -Intricate details

    Return ONLY the image prompt.
    
    User Request: ${state.prompt}
    `);
    const prompt = res.content.trim();
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

    const imageRes = await axios.get(imageUrl, { responseType: "arraybuffer" });

    const buffer = Buffer.from(imageRes.data);
    const filename = `image-${Date.now()}.png`;
    const file = await uploadToS3(filename, buffer, "image/png");
    const downloadUrl = await getFromS3(filename, 60 * 60 * 24);
    return {
      ...state,
      aiResponse: `## Image Generated Successfully 

![Generated Image](${downloadUrl})

[Download Image](${downloadUrl})

Link expires in 24 hours.`,
    };
  } catch (error) {
    console.log("error", error);
    return {
      ...state,
      aiResponse: "Failed to Generate Image",
    };
  }
};
