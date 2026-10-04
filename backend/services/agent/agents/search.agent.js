import { checkAgentLimit } from "../config/agentLimit.js";
import { searchTool } from "../config/tavily.js"
import { deductCredits } from "../utils/deductCredits.js";

export const searchAgent=async (state) => {
    try {
        await checkAgentLimit(state.userId,"vision");
        
        await deductCredits(state.userId, "search");

        const results=await searchTool.invoke({
            query:state.prompt,
        })
        console.log("results",results)
        return{
            ...state,
            searchResults:results,
            images:results?.images
        }
    } catch (error) {
        return{
            ...state,
            aiResponse: error?.data?.message || "Failed  to generate search",
            searchResults:[],
            images:[]
        }
    }

}