import api from "../../utils/axios"

async function sendMessage(payload){
    try {
        const {data}=await api.post(`/api/agent/chat`,payload)
        console.log("data",data)
        return data
    } catch (error) {
        console.log(error)
        return error.response?.data?.message || "Failed to get response from server."
    }
}
export default sendMessage