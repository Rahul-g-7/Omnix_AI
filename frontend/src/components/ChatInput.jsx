import { Mic, Paperclip, Send } from 'lucide-react';
import React, { useState } from 'react';
import sendMessage from '../features/sendMessage';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
const ChatInput = () => {
    const [value,setValue]=useState("")
    const {selectedConversation}=useSelector(state=>state.conversation)
    const dispatch=useDispatch()
    const handleSendMessage=async()=>{
        const payload={
            prompt:value.trim(),conversationId:selectedConversation?._id
        }
        console.log(payload);
        const data=await sendMessage(payload);
        console.log("data",data)
    }
    return (
        <div className='w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/[0.07] bg-[#0d0f14]'>
             <div className='flex flex-col gap-2 p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.07] focus-within:border-indigo-500/40 focus-within:bg-white/[0.04] transition-all duration-200'>
               <textarea   onChange={(e)=>setValue(e.target.value)} value={value} rows={3} placeholder='Ask anything...' className='w-full bg-transparent outline-none resize-none text-[15px] text-white placeholder:text-slate-500 focus:outline-none max-h-[160px] overflow-y-auto custom-scrollbar'/>
               <div className='flex items-center justify-between'>
                <div className='flex items-center gap-1.5'>
                    <button className='w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/[0.08] hover:text-slate-200 transition-colors duration-150 cursor-pointer'>
                        <Paperclip size={18} className='text-slate-400 '/>
                    </button>
                    <button className='w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/[0.08] hover:text-slate-200 transition-colors duration-150 cursor-pointer'>
                        <Mic size={18} className='text-slate-400 '/>
                    </button>

                </div>
                <button disabled={value.trim().length===0} onClick={handleSendMessage} className={`w-8 h-8 rounded-lg flex items-center justify-center border-none cursor-pointer  tranistion-all duration-150 ${value.trim().length===0?'opacity-50 cursor-not-allowed bg-white/[0.2]':'bg-linear-to-br from-indigo-500 to-violet-700 hover:opacity-90'} text-white p-2`}>
                    <Send size={18} className='text-white '/>
                </button>
               </div>
             </div>
        </div>
    );
}

export default ChatInput;
