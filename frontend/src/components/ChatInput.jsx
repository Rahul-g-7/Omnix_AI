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
  X,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import sendMessage from "../features/sendMessage";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  addMessage,
  setMessages,
  setArtifacts,
  setIsLoading,
} from "../redux/messageSlice";
import { createConversation } from "../features/createConversation";
import {
  addConversation,
  setConvTitle,
  setSelectedConversation,
} from "../redux/conversationSlice";
import { updateConversation } from "../features/updateConversation";
import getCurrentUser from "../features/getCurrentUser";
import { setUserData } from "../redux/userSlice";
import { useRef } from "react";

const ChatInput = () => {
  const [value, setValue] = useState("");
  const [seletedAgent, setSelectedAgent] = useState("Auto");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileRef = useRef(null);
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages, isLoading } = useSelector((state) => state.message);
  const dispatch = useDispatch();
  const handleSendMessage = async () => {
    if (isLoading || (value.trim().length === 0 && !selectedFile)) return;
    dispatch(setIsLoading(true));
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

    const formData = new FormData();
    formData.append("prompt", value.trim());
    formData.append("conversationId", conversation?._id);
    formData.append("agent", seletedAgent.toLowerCase());
    if (selectedFile) {
      formData.append("file", selectedFile);
    }
    dispatch(addMessage({ role: "user", content: value.trim() }));
    setValue("");
    const data = await sendMessage(formData);
    dispatch(setIsLoading(false));
    setSelectedFile(null);
    if (data?.artifacts && data.artifacts.length > 0) {
      dispatch(setArtifacts(data.artifacts));
    }
    dispatch(
      addMessage({
        role: "assistant",
        content: data?.answer,
        images: data?.images,
      }),
    );
    const updatedUser = await getCurrentUser();
    if (updatedUser) {
      dispatch(setUserData(updatedUser));
    }
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
                key={agent.id}
                onClick={() => setSelectedAgent(agent.label)}
                className={`flex-shrink-0  cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-all ${isActive ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-[0_1px_8px_rgb(99,102,241,.35)]" : "bg-white[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.07]"}`}
              >
                <Icon size={12} className="text-current" />
                <span className="font-medium text-xs ">{agent.label}</span>
              </div>
            );
          })}
        </div>
        {selectedFile && (
          <div className="my-3">
            <div className="inline-flex items-center gap-2 rounded-2xl border-white/10 bg-white/[0.04] px-3 py-2">
              {selectedFile?.type === "application/pdf" ? (
                <FileText size={16} className="text-red-400" />
              ) : (
                selectedFile.type.startsWith("image/") && (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    className="h-10 w-10 rounded-2xl object-cover mt-3"
                  />
                )
              )}
              <div className="mt-3">
                <p className="text-white text-sm">{selectedFile.name} </p>
                <p className="text-[12px] text-slate-400">
                  {Math.ceil(selectedFile.size / 1000) + " KB"}
                </p>
              </div>
              <button
                className="ml-2 cursor-pointer"
                onClick={() => {
                  setSelectedFile(null);
                  fileRef.current.value = "";
                }}
              >
                <X size={14} className="text-slate-400 hover:text-white " />
              </button>
            </div>
          </div>
        )}
        <textarea
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (!isLoading && (value.trim().length > 0 || selectedFile)) {
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
            <input
              type="file"
              accept=".pdf,image/*"
              hidden
              ref={fileRef}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setSelectedFile(file);
                }
              }}
            />
            <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/[0.08] hover:text-slate-200 transition-colors duration-150 cursor-pointer">
              <Paperclip
                onClick={() => fileRef.current.click()}
                size={18}
                className="text-slate-400 "
              />
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/[0.08] hover:text-slate-200 transition-colors duration-150 cursor-pointer">
              <Mic size={18} className="text-slate-400 " />
            </button>
          </div>
          <button
            disabled={isLoading|| (value.trim().length === 0 && !selectedFile)}
            onClick={handleSendMessage}
            className={`w-8 h-8 rounded-lg flex items-center justify-center border-none cursor-pointer  tranistion-all duration-150 ${(isLoading || (value.trim().length === 0 && !selectedFile)) ? "opacity-50 cursor-not-allowed bg-white/[0.2]" : "bg-linear-to-br from-indigo-500 to-violet-700 hover:opacity-90"} text-white p-2`}
          >
            <Send size={18} className="text-white " />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
