import {
  Code2,
  FileText,
  Globe,
  ImageIcon,
  MessageSquare,
  Mic,
  Paperclip,
  Presentation,
  Send,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import sendMessage from "../features/sendMessage";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { addMessage, setMessages } from "../redux/messageSlice";
import { createConversation } from "../features/createConversation";
import {
  addConversation,
  setConvTitle,
  setSelectedConversation,
} from "../redux/conversationSlice";
import { updateConversation } from "../features/updateConversation";
const ChatInput = () => {
  const [value, setValue] = useState("");
  const [seletedAgent, setSelectedAgent] = useState("Auto");
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);
  const dispatch = useDispatch();
  const handleSendMessage = async () => {
    let conversation = selectedConversation;
    if (!selectedConversation) {
      const conv = await createConversation();
      dispatch(setSelectedConversation(conv));
      dispatch(addConversation(conv));
      conversation = conv;
    }
    if (conversation.title == "New Chat") {
      await updateConversation({
        id: conversation?._id,
        title: value.trim().substring(0, 30),
      });
      dispatch(
        setConvTitle({
          conversationId: conversation?._id,
          title: value.trim().substring(0, 40),
        }),
      );
    }
    const payload = {
      prompt: value.trim(),
      conversationId: conversation?._id,
      agent: seletedAgent.toLowerCase(),
    };
    dispatch(addMessage({ role: "user", content: value.trim() }));
    setValue("");
    console.log(payload);
    const data = await sendMessage(payload);
    dispatch(
      addMessage({
        role: "assistant",
        content: data?.answer,
        images: data?.images,
      }),
    );
    console.log("data", data);
  };
  const agents = [
    {
      id: "auto",
      icon: Zap,
      label: "Auto",
    },
    {
      id: "chat",
      icon: MessageSquare,
      label: "Chat",
    },
    {
      id: "coding",
      icon: Code2,
      label: "Coding",
    },
    {
      id: "pdf",
      icon: FileText,
      label: "PDF",
    },
    {
      id: "ppt",
      icon: Presentation,
      label: "PPT",
    },
    {
      id: "vision",
      icon: ImageIcon,
      label: "Vision",
    },
    {
      id: "search",
      icon: Globe,
      label: "Search",
    },
  ];
  return (
    <div className="w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/[0.07] bg-[#0d0f14]">
      <div className="flex flex-col gap-2 p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.07] focus-within:border-indigo-500/40 focus-within:bg-white/[0.04] transition-all duration-200">
        <div className="flex  w-[80%] gap-2 pr-2 flex-wrap">
          {agents.map((agent) => {
            const isActive = seletedAgent == agent.label;
            const Icon = agent.icon;
            return (
              <div
                onClick={() => setSelectedAgent(agent.label)}
                className={`flex-shrink-0  cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-all ${isActive ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-[0_1px_8px_rgb(99,102,241,.35)]" : "bg-white[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.07]"}`}
              >
                <Icon size={12} className="text-current" />
                <span className="font-medium text-xs ">{agent.label}</span>
              </div>
            );
          })}
        </div>
        <textarea
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (value.trim().length > 0) {
                handleSendMessage();
              }
            }
          }}
          value={value}
          rows={3}
          placeholder="Ask anything..."
          className="w-full bg-transparent outline-none resize-none text-[15px] text-white placeholder:text-slate-500 focus:outline-none max-h-[160px] overflow-y-auto custom-scrollbar"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/[0.08] hover:text-slate-200 transition-colors duration-150 cursor-pointer">
              <Paperclip size={18} className="text-slate-400 " />
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/[0.08] hover:text-slate-200 transition-colors duration-150 cursor-pointer">
              <Mic size={18} className="text-slate-400 " />
            </button>
          </div>
          <button
            disabled={value.trim().length === 0}
            onClick={handleSendMessage}
            className={`w-8 h-8 rounded-lg flex items-center justify-center border-none cursor-pointer  tranistion-all duration-150 ${value.trim().length === 0 ? "opacity-50 cursor-not-allowed bg-white/[0.2]" : "bg-linear-to-br from-indigo-500 to-violet-700 hover:opacity-90"} text-white p-2`}
          >
            <Send size={18} className="text-white " />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
