import { getModel } from "../config/llmModels.js";
export const router = async (state) => {
  if (state.agent && state.agent !== "auto") {
    return {
      ...state,
      agent: state.agent,
    };
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
  return {
    ...state,
    agent: response.content.trim().toLowerCase(),
  };
};
