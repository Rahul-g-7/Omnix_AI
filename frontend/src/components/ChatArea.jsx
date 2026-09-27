import React from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import Nav from './Nav';
const ChatArea = () => {
    return (
        <div className='flex-1 flex flex-col'>
            <Nav/>
            <MessageList/>
            <ChatInput/>
        </div>
    );
}

export default ChatArea;
