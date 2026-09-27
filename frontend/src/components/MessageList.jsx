import React from 'react';
import { useSelector } from 'react-redux';
import MessageBubble from './MessageBubble';
const MessageList = () => {
     const {selectedConversation}=useSelector(state=>state.conversation)
     const {messages}=useSelector(state=>state.message)
    return (
        <div className="flex-1 overflow-y-auto p-5 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {messages.length==0 || !selectedConversation?(
                <div className='h-full flex flex-col items-center justify-center gap-4 text-center '>
                    <div className='flex flex-col gap-1.5'>
                        <h1 className='text-[22px] font-extrabold text-slate-100 tracking-tight'>CortexAI</h1>
                        <p className='text-[17px] font-semibold text-slate-400 tracking-tight'>How can I help you?</p>
                        <p className='text-slate-500/70 text-[15px] text-slate-600 max-w-[260px] leading-relaxed'>Ask me anything - code, ideas, explanatons, or just a quick question.</p>
                    </div>
                    <div className='flex flex-wrap justify-center gap-2 mt-1'>
                        {["Build a Netlfix clone","Explain Redis","Build a dashboard"].map((s)=>(
                            <button className='text-[12px] text-slate-400 bg-white/[0.04] cursor-pointer border border-white/[0.07] px-3 py-1.5 rounded-lg hover:bg-white/[0.08] hover:text-slate-200 transition-colors duration-150'>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            ):
            <div>
                {messages.map((msg,i)=>(
                    <div key={i}>
                        <MessageBubble role={msg?.role} content={msg?.content}/>
                    </div>
                ))}
            </div>
            
        }
        </div>
    );
}

export default MessageList;
