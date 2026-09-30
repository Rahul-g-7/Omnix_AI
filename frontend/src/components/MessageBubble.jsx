import { Check, Copy, X } from "lucide-react";
import React, { Children, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {docco} from "react-syntax-highlighter/dist/esm/styles/hljs"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
const MessageBubble = ({ role, content, images }) => {
  const isUser = role === "user";
  const [lightBox, setLightBox] = useState(null);
  let [copiedCode, setCopiedCode] = useState("");

  const copyCode = async (code) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`w-fit max-w-[92vw] md:max-w-[72%] px-4 py-2.5 rounded-2xl break-words overflow-hidden leading-relaxed ${isUser ? "bg-linear-to-br from-indigo-500 to-violet-700 text-white rounded-tr-sm " : " text-slate-300 rounded-tl-sm"} `}
      >
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                loading="lazy"
                onClick={() => setLightBox(img)}
                onError={(e) => e.currentTarget.remove()}
                className="w-40 h-28 rounded-xl border-white/10 cursor-zoom-in object-cover hover:opacity-90 tranistion"
              />
            ))}
          </div>
        )}
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold mt-5 mb-3">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-semibold mt-4 mb-2.5">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-semibold mt-4 mb-2.5">{children}</h3>
            ),
            h4: ({ children }) => (
              <h4 className="text-base font-semibold mt-4 mb-2.5">
                {children}
              </h4>
            ),
            h5: ({ children }) => (
              <h5 className="text-sm font-semibold mt-4 mb-2.5">{children}</h5>
            ),
            h6: ({ children }) => (
              <h6 className="text-sm font-semibold mt-4 mb-2.5">{children}</h6>
            ),
            p: ({ children }) => (
              <p className="mb-3 whitespace-pre-wrap break-word">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="pl-6 my-3 list-disc space-y-1">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="pl-6 my-3 list-decimal space-y-1">{children}</ol>
            ),
            li: ({ children }) => <li className="mb-1">{children}</li>,
            blockquote: ({ children }) => (
              <blockquote className="pl-3 my-3 border-l-2 border-indigo-500">
                {children}
              </blockquote>
            ),
            pre: ({ children }) => (
              <pre className="bg-white/[0.08] p-2 rounded-md">{children}</pre>
            ),
            a: ({ children }) => (
              <a href={children} className="text-indigo-400 hover:underline">
                {children}
              </a>
            ),
            hr: ({ children }) => <hr className="my-3" />,
            table: ({ children }) => (
              <table className="my-3 border-collapse w-full">{children}</table>
            ),
            tr: ({ children }) => (
              <tr className="border border-white/[0.08]">{children}</tr>
            ),
            th: ({ children }) => (
              <th className="border border-white/[0.08] p-2 text-left">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-white/[0.08] p-2 text-left">
                {children}
              </td>
            ),
            code: ({ children, className }) => {
              const value = String(children).trim();

              if (!className) {
                return (
                  <code className="px-1 py-0.5 text-indigo-300 bg-white/[0.08] rounded-md">
                    {value}
                  </code>
                );
              }
              const language = className?.replace("language-", "");
              return (
                <div className="my-4 overflow-hidden rounded-xl border border-white/10 bg-[#111318]">
                  <div className="flex items-center justify-between bg-[#1b1d24] border-b border-white/10 px-4 py-2">
                    <span className="uppercase text-sm text-slate-400">
                      {language}
                    </span>
                    <button className="cursor-pointer flex items-center gap-1 text-sm" onClick={() => copyCode(value)}>
                      {copiedCode == value ? (
                        <>
                          <Check />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={15}/>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <SyntaxHighlighter language={language} style={oneDark} wrapLongLines showLineNumbers customStyle={{margin:0, padding:"16px", background:"#0a0d11", fontSize:"13px"}}>
                    {value}
                  </SyntaxHighlighter>
                </div>
              );
            },
          }}
        >
          {content}
        </Markdown>
      </div>
      {lightBox && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <button
            onClick={() => setLightBox(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 rounded-full p-2"
          >
            <X />
          </button>
          <img
            src={lightBox}
            className="max-w-[90vw] max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
