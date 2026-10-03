import { searchTool } from "../config/tavily.js"
import { deductCredits } from "../utils/deductCredits.js";

export const searchAgent=async (state) => {
    try {
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
            searchResults:["failed to search"],
            images:[]
        }
    }

}