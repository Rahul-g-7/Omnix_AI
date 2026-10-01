import {
  Check,
  Code2,
  Copy,
  Eye,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { easeInOut, motion, transform } from "motion/react";
import Editor from "@monaco-editor/react";
const Artifact = () => {
  const [collapse, setCollapse] = useState(false);
  const [tab, setTab] = useState("code");
  const [activeFile, setActiiveFile] = useState(0);
  const [copied, setCopied] = useState(false);
  const { artifacts } = useSelector((state) => state.message);
  if (artifacts.length === 0) {
    return;
  }

  const file = artifacts[0]?.files?.[activeFile];
  const htmlFile = artifacts[0]?.files?.find((f) => f.name === "index.html");
  const jsFile = artifacts[0]?.files?.find((f) => f.name === "script.js");
  const cssFile = artifacts[0]?.files?.find((f) => f.name === "style.css");
  const canPreview = Boolean(htmlFile);

  const previewDoc = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>${cssFile?.content || ""}</style>
  </head>
  <body>
    ${htmlFile?.content || ""}
    <script>${jsFile?.content || ""}</script>
  </body>
  </html>
  `;
  const handleCopy = async () => {
    await navigator.clipboard.writeText(file?.content || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };
  const detectLanguage = (filename = "") => {
    const name = filename.toLowerCase();
    if (name.endsWith(".html")) return "html";
    if (name.endsWith(".css")) return "css";
    if (name.endsWith(".js")) return "javascript";
    if (name.endsWith(".ts")) return "typescript";
    if (name.endsWith(".jsx")) return "javascript";
    if (name.endsWith(".tsx")) return "typescript";
    if (name.endsWith(".json")) return "json";
    if (name.endsWith(".py")) return "python";
    if (name.endsWith(".java")) return "java";
    if (name.endsWith(".c")) return "c";
    if (name.endsWith(".cpp")) return "cpp";
    if (name.endsWith(".h")) return "c";
    if (name.endsWith(".hpp")) return "cpp";
    if (name.endsWith(".py")) return "python";
    if (name.endsWith(".rb")) return "ruby";
    if (name.endsWith(".go")) return "go";
    if (name.endsWith(".rs")) return "rust";
    if (name.endsWith(".php")) return "php";
    if (name.endsWith(".swift")) return "swift";
    if (name.endsWith(".kt")) return "kotlin";
    if (name.endsWith(".kts")) return "kotlin";
    if (name.endsWith(".dart")) return "dart";
    return "plaintext";
  };
  return (
    <motion.div
      initial={{ width: 400 }}
      animate={{ width: collapse ? 48 : 400 }}
      transition={{ duration: 0.25, ease: easeInOut }}
      className="hidden lg:flex h-full border-l border-white/[0.06] flex-col overflow-hidden shrink-0 w-[250px]"
    >
      {!collapse ? (
        <div className="flex flex-col h-full bg-[#0d0f14]">
          <div className="h-14 px-4 border-b border-white/[0.06] flex items-center gap-3 shrink-0">
            <button
              className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150  bg-transparent border-none cursor-pointer shrink-0"
              onClick={() => setCollapse(true)}
            >
              <PanelRightClose size={18} />
            </button>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 shrink-0">
                <Code2 className="text-indigo-400" size={14} />
              </div>
              <div className="text-[13px] font-medium text-slate-200 truncate">
                {artifacts[0]?.title}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleCopy}
                className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150  bg-transparent border-none cursor-pointer shrink-0"
              >
                {copied ? <Check size={17} /> : <Copy size={17} />}
              </button>
            </div>
            {canPreview && (
              <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] p-1 rounded-lg ">
                <button
                  onClick={() => setTab("code")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] cursor-pointer font-medium rounded-md transition-colors duration-150 ${tab === "code" ? "bg-indigo-500 text-white" : "text-slate-500 hover:text-slate-200"}`}
                >
                  <Code2 size={12} />
                  Code
                </button>
                <button
                  onClick={() => setTab("preview")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] cursor-pointer font-medium rounded-md transition-colors duration-150 ${tab === "preview" ? "bg-indigo-500 text-white" : "text-slate-500 hover:text-slate-200"}`}
                >
                  <Eye size={12} />
                  Preview
                </button>
              </div>
            )}
          </div>
          {tab == "code" && (
            <div className="h-auto flex text-white border-b border-white/[0.06] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0">
              {artifacts[0]?.files?.map((f, index) => (
                <button
                  onClick={() => {
                    setActiiveFile(index);
                  }}
                  className={`relative px-4 py-2.5 border-r border-white/[0.05] whitespace-nowrap text-[11px] cursor-pointer font-medium rounded-md transition-colors duration-150 ${activeFile === index ? " text-white" : "text-slate-500 hover:text-indigo-200"}`}
                >
                  {f?.name}
                  {activeFile === index && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 rounded-tl-full"></div>
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 overflow-hidden">
            {tab == "preview" && canPreview ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transform={{ duration: 0.15, ease: easeInOut }}
                className="h-full w-full"
              >
                <iframe
                  title="preview"
                  srcDoc={previewDoc}
                  sandbox="allow-scripts"
                  className="w-full h-full bg-white border-none outline-none"
                ></iframe>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transform={{ duration: 0.15, ease: easeInOut }}
                className="h-full w-full"
              >
                <Editor
                  theme="vs-dark"
                  language={detectLanguage(file?.name)}
                  value={file?.content}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 13,
                    wordWrap: "on",
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    padding: { top: 16 },
                    lineNumbers: "on",
                    renderLineHighlight: "none",
                  }}
                />
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex h-full border-1 border-white/[0.06] bg-[#0d0f14] flex-col items-center py-4 gap-3 shrink-0">
          <button
            className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150  bg-transparent border-none cursor-pointer shrink-0"
            onClick={() => setCollapse(false)}
          >
            <PanelRightOpen size={18} />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className="text-[10px] font-medium text-slate-600 tracking-widest uppercase whitespace-nowrap "
              style={{
                writingMode: "vertical-lr",
                transform: "rotate(180deg)",
              }}
            >
              {artifacts[0]?.title}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Artifact;
