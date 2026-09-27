import React from 'react';
import {PanelLeftIcon,MessageSquare,Plus,} from 'lucide-react';
import { useSelector } from 'react-redux';
const Nav = () => {
    const {selectedConversation}=useSelector((state)=>state.conversation)
    return (
        <div className='h-14 flex items-center gap-2.5 px- 5 border-b border-white/[0.1] bg-[#0d0f14]'>
            <div>
                <MessageSquare/>
                
            </div>
            <div>
                {selectedConversation?.title || 'New Chat'}
            </div>
            <div>
                
            </div>
        </div>
    );
}

export default Nav;
