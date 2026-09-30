import React, { useEffect } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import Nav from './Nav';
import { useDispatch, useSelector } from 'react-redux';
import getMessages from '../features/getMessage';
import { setMessages } from '../redux/messageSlice';
const ChatArea = () => {
    const {selectedConversation}=useSelector((state)=>state.conversation)
    const dispatch=useDispatch()
    useEffect(()=>{
        const getMesg=async()=>{
            if(selectedConversation){
                if(selectedConversation.title=="New Chat") {return}
             const data= await getMessages(selectedConversation?._id)
             dispatch(setMessages(data))
            }
            
        }
        getMesg()
    },[selectedConversation?._id])
    return (
        <div className='min-w-0 flex-1 flex flex-col'>
            <Nav/>
            <MessageList/>
            <ChatInput/>
        </div>
    );
}

export default ChatArea;
