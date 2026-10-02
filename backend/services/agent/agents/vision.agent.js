import { getModel } from "../config/llmModels.js";
import axios from 'axios'
export const visionAgent = async (state) => {
  const llm = await getModel("image");
  const res=await llm.invoke(`
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
    `) 
    const prompt=res.content.trim()
    const imageUrl=`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`

    const imageRes=await axios.get(imageUrl,{responseType:"arraybuffer"})

    console.log("image",imageRes);
    
  
};