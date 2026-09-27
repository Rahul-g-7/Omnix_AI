import api from "../../utils/axios"

async function getMessage(){
    try {
        const {data}=await api.get(`/api/chat/get-messages/${id}`)
    } catch (error) {
        console.log(error)
    }
}
export default getMessage;