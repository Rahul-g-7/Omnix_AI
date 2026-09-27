import { getModel } from "../config/llmModels.js";
export const chatAgent = async (state) => {
  const llm = await getModel("chat");
  const prompt = `You are CortexAI and you are a chat Assitant
  Rules:
  -for greetings don't use markdown formatting and respond naturally 
  -for detailed answers, code, explanations, and structured responses use markdown formatting

  Formatting:
  -use # for titles and ## for sections
  -leave a blank line after heading
  -use numbered list for steps
  -never write heading and content on the same line
  - Use markdown for formatting
  - Use bold for important words
  - Use fence code blocks with language tags for code
  - Use bullet points for lists
  - Use headings for sections
  `;
  const response = await llm.invoke([
    {
      role: "system",
      content: prompt,
    },
    {
      role: "user",
      content: state.prompt,
    },
  ]);
  return {
    ...state,
    aiResponse: response.content,
  };
};