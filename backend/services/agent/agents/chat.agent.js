import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { getModel } from "../config/llmModels.js";
import { getMemory } from "../config/memory.js";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const chatAgent = async (state) => {
  try {
    await checkAgentLimit(state.userId,"chat");
    await deductCredits(state.userId, "chat");

    const llm = await getModel("chat");
    const history = (await getMemory(state.conversationId)) || [];
    const searchContext = state.searchResults
      ? ` web serach results :${JSON.stringify(state.searchResults)} answer the user using the above search results`
      : "";

    const systemPrompt = `You are OmnixAI and you are a chat Assitant
  ${searchContext}
  if searchContext exists:
  -use search results to answer the user query
  -don't use internal tools.
  
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

    const messages = [new SystemMessage(systemPrompt)];

    history.forEach((msg) => {
      if (msg.role == "user") {
        messages.push(new HumanMessage(msg.content));
      } else if (msg.role == "assistant") {
        messages.push(new AIMessage(msg.content));
      }
    });

    messages.push(new HumanMessage(state.prompt));
    console.log(messages);

    const response = await llm.invoke(messages);

    return {
      ...state,
      aiResponse: response.content,
    };
  } catch (error) {
    console.error("Error in chatAgent:", error);
    return {
      ...state,
      aiResponse: error?.data?.message || "Failed  to generate response",
    };
  }
};
