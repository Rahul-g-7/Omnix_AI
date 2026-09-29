import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
export const createConversation = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        console.log("User ID from header:", userId);
        const conversation = await Conversation.create({ userId });
        res.status(201).json(conversation);
    } catch (error) {
        console.error("Error creating conversation:", error);
        res.status(500).json({ error: `Failed to create conversation ${error}` });
    }
}
export const getConversations= async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        console.log("User ID from header:", userId);
        const conversations = await Conversation.find({ userId: userId }).sort({updatedAt: -1});
        res.status(200).json(conversations);
    } catch (error) {
        console.error("Error getting conversation:", error);
        res.status(500).json({ error: `Failed to get conversation ${error}` });
    }
}
export const updateConversation= async (req, res) => {
    try {
        const {id,title} = req.body;
        const conversation= await Conversation.findByIdAndUpdate(id, { title });
        res.status(200).json(conversation);
    } catch (error) {
        console.error("Error getting conversation:", error);
        res.status(500).json({ error: `Failed to get conversation ${error}` });
    }
}
export const saveMessage = async (req, res) => {
    try {
        const {conversationId, role, content,images} = req.body;
        const message = await Message.create({conversationId, role, content,images});
        res.status(201).json(message);
    } catch (error) {
        console.error("Error saving message:", error);
        res.status(500).json({ error: `Failed to save message ${error}` });
    }
        
}
export const getMessages = async (req, res) => {
    try {
        const message = await Message.find({conversationId:req.params.conversationId})
        res.status(200).json(message);
    } catch (error) {
        console.error("Error fetching message:", error);
        res.status(500).json({ error: `Failed to fetch message ${error}` });
    }
        
}
