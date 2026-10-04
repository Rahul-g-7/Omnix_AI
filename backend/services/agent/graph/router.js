import { getModel } from "../config/llmModels.js";

export const router = async (state) => {
  try {
    if (state.agent && state.agent !== "auto") {
      return {
        ...state,
        agent: state.agent,
      };
    }
    if (state?.file) {
      if (state?.file?.mimetype === "application/pdf") {
        return {
          ...state,
          agent: "pdfRag",
        };
      }
      if (state?.file?.mimetype.startsWith("image/")) {
        return {
          ...state,
          agent: "imageAnalyzer",
        };
      }
    }

    const llm = await getModel("router");
    const prompt = `You are an intelligent agent router for a multi-agent AI system.
  
  Available agents:
  -chat
  -search
  -coding
  -pdf
  -ppt
  -vision
  
  Rules:
  chat:
  General conversation,
  explainations,
  learning,
  questions and answers.

  search:
  Current events,
  latest news,
  latest information,
  recent updates,
  recent developments,
  internet lookup.

  coding:
  Generate code,
  debug code,
  build projects,
  architecture,
  API dessign.

  pdf:
  Questions about generate PDFs 
  or create/generate pdf
  or document context .

  ppt:
  Questions about generate PPTs 
  or create/generate ppt
  or ppt context .

  vision:
  generate image,
  create image,


  Return ONLY one word:

  chat 
  search
  coding
  pdf
  ppt
  vision

  User Query:
  ${state.prompt}
  `;

    const response = await llm.invoke(prompt);
    const selectedAgent = response.content?.trim().toLowerCase();
    const validAgents = ["chat", "search", "coding", "pdf", "ppt", "vision"];

    return {
      ...state,
      agent: validAgents.includes(selectedAgent) ? selectedAgent : "chat",
    };
  } catch (error) {
    console.error("Error in router agent:", error);
    return {
      ...state,
      agent: "chat",
    };
  }
};
