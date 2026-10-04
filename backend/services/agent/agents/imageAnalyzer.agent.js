import { getModel } from "../config/llmModels.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import fs from "fs/promises";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const imageAnalyzer = async (state) => {
  try {
    await checkAgentLimit(state.userId,"vision");
    
    await deductCredits(state.userId,"vision")
    const llm = await getModel("imageAnalyzer");
    const imageBuffer =await fs.readFile(state.file.path);
    const base64 = imageBuffer.toString("base64");
    const message = [
      new SystemMessage(
        `You are an intelligent image Analyser agent.
                
                Rules:
                -Analyze only the uploaded image.
                -Answer the user's question accurately and concisely.
                -If text exists in the image, extract it.
                -If charts or tables exist, explain them.
                If something is unclear , say so.
                -Use Markdown when helpful.
                -Do not hallucinate.
                `,
      ),
      new HumanMessage({
        content: [
          { type: "text", text: state.prompt || "analyze the image" },
          {
            type: "image_url",
            image_url: `data:${state.file.mimetype};base64,${base64}`,
          },
        ],
      }),
    ];
    const response = await llm.invoke(message);
    return {
      ...state,
      aiResponse: response.content,
    };
  } catch (error) {
    console.error("Error in imageAnalyzer:", error);
    return {
      ...state,
      aiResponse: error?.data?.message || error?.message || "Failed  to generate response",
    };
  } finally {
    await fs.unlink(state.file.path);
  }
};
