import api from "../../utils/axios"

export const createOrder=async(plan)=>{
    try {
        const {data}=await api.post("/api/billing/create",{plan})
        console.log("DATA",data);
        return data
    } catch (error) {
        console.log(`error ${error}`);
        return []
    }
}