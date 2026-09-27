import React from 'react';

const MessageBubble = ({role,content}) => {
    return (
        <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0
        ${role ==='user' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
         'bg-white/[0.05] text-slate-300 border border-white/[0.07]'
        }`}>
           
        </div>
           
        </div>
    );
}

export default MessageBubble;
