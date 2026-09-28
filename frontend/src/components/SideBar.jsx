import React, { useEffect, useState } from 'react';
import {PanelLeftIcon, PenSquare,Plus,MessageSquare,User,Coins,LogOut,PanelRightIcon} from 'lucide-react';
import { getConversation } from '../features/getConversaitons';
import { useDispatch, useSelector } from 'react-redux';
import {addConversation,setConversations,setSelectedConversation} from '../redux/conversationSlice';
import { createConversation } from '../features/createConversation'; 
import { setUserData } from '../redux/userSlice';
import logOut from '../features/logOut';
const SideBar = () => {
    const [collapsed,setCollapse]=useState(false)
    const dispatch=useDispatch()

    const {conversations,selectedConversation}=useSelector((state)=>state.conversation)
    const {userData}=useSelector((state)=>state.user)
    

    useEffect(() => {
    if (userData) {
        const getConv = async () => {
            const data = await getConversation();
            dispatch(setConversations(data || []));
        };
        getConv();
    }
}, [userData]);


    const handleCreateConversation=async()=>{
        const data=await createConversation()
        dispatch(addConversation(data))
    }

    const [imageError,setImageError]=useState(false)

    if(collapsed){
        return (
          <div className="hidden lg:flex flex-col items-center w-[56px] h-screen bg-[#0d0f14] border-r border-white/[0.06] py-4 gap-1 shrink-0">
            <button
              onClick={() => {
                setCollapse(false);
              }}
              className="hidden lg:flex items-center gap-2.5 justify-center h-7 w-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.07] transition-colors duration-150 bg-transparent border-none cursor-pointer"
            >
              <PanelRightIcon />
            </button>
            <button
              className="flex items-center gap-2.5 justify-center h-10 w-10 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.07] transition-colors duration-150 bg-transparent border-none cursor-pointer"
              onClick={()=>dispatch(setSelectedConversation(null))}
            >
              <Plus size={18} />
            </button>
            <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none ] [&::-webkit-scrollbar]:hidden pt-8">
              {conversations.map((conv, i) => {
                const isActive = selectedConversation?._id == conv?._id;
                return (
                  <div
                    onClick={() => dispatch(setSelectedConversation(conv))}
                    className={`flex items-center gap-2.5  cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150 ${isActive ? "bg-indigo-500/10 border-indigo-500/[0.18]" : "bg-transparent border-transparent"}`}
                  >
                    <div
                      className={` flex items-center justify-center shrink-0 h-[20px] w-[20px] rounded-lg ${isActive ? "bg-indigo-500/10 text-indigo-400" : "bg-white/[0.05] text-slate-500"}`}
                    >
                      <MessageSquare size={13} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="relative-shrink">
              {(userData?.user?.avatar || userData?.avatar) && !imageError ? (
                <img
                  className="w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25"
                  src={userData?.user?.avatar || userData?.avatar}
                  alt="image"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center">
                  <User size={15} className="text-slate-400" />
                </div>
              )}
            </div>
          </div>
        );
    }
    return (
        <div className='fixed lg:static inset-y-0 left-0 z-50 w-[270px] h-screen shrink-0 bg-[#0d0f14] border-r border-white/[0.06]'>
            <div className='flex flex-col h-full'>
                <div className='flex items-center gap-2.5 px-4 py-4 border-b border-white/[0.06]'>
                    <div onClick={()=>{setCollapse(true)}} className='hidden lg:flex items-center gap-2.5 justify-center h-7 w-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.07] transition-colors duration-150 bg-transparent border-none cursor-pointer'>
                        <PanelLeftIcon /> 
                    </div>
                    <span className='text-[15px] font-semibold text-slate-100 tracking-tight flex-1'>CortexAI</span>
                    <span className='text-[12px] font-medium text-indigo-400 border bg-indigo-500/10 border-indigo-500/30 px-2 py-0.5 rounded-full tracking-wide'>free</span>
                    <button className='flex items-center justify-center h-7 w-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.07] transition-colors duration-150 bg-transparent border-none cursor-pointer' onClick={()=>dispatch(setSelectedConversation(null))}>
                        <PenSquare/>
                    </button>
                </div>
                <div className='px-4 pt-4 pb-1'>
                    <button className='w-full flex items-center gap-2 justify-center rounded-xl text-white font-medium bg-linear-to-br from-indigo-500 to-violet-600 py-[10px] border-none hover:opacity-90 transition-opacity duration-150 cursor-pointer'onClick={()=>dispatch(setSelectedConversation(null))}>
                        <Plus size={16}/>
                        New Chat 
                    </button>
                </div>
                <div className='flex-1 flex flex-col min-h-0'>
                    {conversations?.length==0 ? 
                        <div className='px-5 pt-4 pb-1.5 text-[13px] text-slate-600 font-semibold uppercase tracking-widest '>
                            No recent conversations
                        </div>
                        :
                        (
                            <div className='px-5 pt-4 pb-1.5 text-[13px] text-slate-600 font-semibold uppercase tracking-widest '>
                                
                                recents
                            </div>
                        )
                    }
                    <div className='flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none ] [&::-webkit-scrollbar]:hidden'>
                        {conversations.map((conv,i)=>{
                            const isActive = selectedConversation?._id == conv?._id;
                            return (
                                <div onClick={() => dispatch(setSelectedConversation(conv))} className={`flex items-center gap-2.5  cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150 ${isActive ? "bg-indigo-500/10 border-indigo-500/[0.18]" : "bg-transparent border-transparent"}`}>
                                    <div className={` flex items-center justify-center shrink-0 h-[28px] w-[28px] rounded-lg ${isActive ? "bg-indigo-500/10 text-indigo-400" : "bg-white/[0.05] text-slate-500"}`}>
                                        <MessageSquare size={13}/>
                                    </div>
                                    
                                    <span className={`text-[13px] font-medium truncate ${isActive ? "text-slate-100" : "text-slate-300"}`}>{conv?.title || "New Chat"}</span>
                                 </div>   
                            )

                            })}
                    </div>

                  <div className='mx-2.5 h-px bg-white/[0.06] my-2' />
                  <div className='px-3.5 py-3.5'>
                    {userData ? (
                        <div className='flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2.5 hover:bg-white/[0.05] transition-colors duration-150'>
                        <div className='relative-shrink'>
                            {
                                ((userData?.user?.avatar || userData?.avatar)  && !imageError)
                                ?
                                <img className='w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25' src={userData?.user?.avatar ||userData?.avatar} alt="image" onError={()=>setImageError(true)} />
                                :
                               <div className='w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center'>
                                <User size={15} className='text-slate-400'/>
                               </div>
                            }
                        </div>
                        <div className='flex-1 min-w-0'> 
                            <p className='text-[13px] font-semibold text-slate-100 truncate'>{userData?.user?.name ||"user"}</p>
                            <p className='text-[11px] text-slate-600 mt-px'>{"Free plan"}</p>
                        </div>
                        <div className='flex gap-2'>
                            <button className='flex items-center justify-center h-7 w-7 rounded-lg text-yellow-600 hover:text-slate-400 hover:bg-white/[0.07] transition-colors duration-150 bg-transparent border-none cursor-pointer' >
                                <Coins size={18}/>
                            </button>
                            <button className='flex items-center justify-center h-7 w-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.07] transition-colors duration-150 bg-transparent border-none cursor-pointer'onClick={()=>{
                                logOut();
                                dispatch(setUserData(null))
                            }}>
                                <LogOut size={18}/>
                            </button>
                        </div>
                        
                    </div>) : (
                        <button className='w-full flex items-center justify-center gap-2 text-sm font-medium text-slate-200 bg-white/[0.05] border border-white/[0.08] rounded-xl py-[11px] cursor-pointer hover:bg-white[0.08] transition-colors duration-150'>
                            login
                        </button>
                    )}
                  </div>
                   
                </div>
              
            </div>
                  
        </div>
    );

}

export default SideBar;
