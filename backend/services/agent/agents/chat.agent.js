import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../config/llmModels.js";
import { getMemory } from "../config/memory.js";
export const chatAgent = async (state) => {
  const llm = await getModel("chat");
  const history =await getMemory(state.conversationId)
  const systemPrompt = `You are OmnixAI and you are a chat Assitant
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
    const messages=[
      new SystemMessage(systemPrompt)
    ]
    history.forEach(msg=>{
      if(msg.role=="user"){
        messages.push(new HumanMessage(msg.content))
      }
      else if(msg.role=="assistant"){
        messages.push(new AIMessage(msg.content))
      }
    })
    messages.push(new HumanMessage(state.prompt))
    console.log(messages)

  const response = await llm.invoke(messages);
  return {
    ...state,
    aiResponse: response.content,
  };
};