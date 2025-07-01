/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Message } from "@/types/chat";
import CodePreview from "./CodePreview";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [showPreview, setShowPreview] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const isUser = message.role === "user";
  const hasCodeBlocks = message.codeBlocks && message.codeBlocks?.length > 0;

  return (
    <>
      <div className="flex gap-4">
        <div
          className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 ${
            showPreview && !isFullScreen && !isUser ? "w-1/2" : "w-full"
          }`}
        >
          <div
            className={`max-w-full rounded-lg p-4 ${
              isUser ? "bg-blue-600 text-white" : "bg-white border shadow-sm"
            }`}
          >
            {/* Message Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {isUser ? "👤 You" : "🤖 AI Assistant"}
                </span>
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>

              {/* Code Preview Button */}
              <div className="flex gap-2 mt-2">
                {hasCodeBlocks && (
                  <button
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className={`px-3 py-1 rounded text-xs transition-colors ${
                      isUser
                        ? "bg-blue-500 hover:bg-blue-400 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {isFullScreen ? "↙️ Exit Full Screen" : "↗️ Full Screen"}
                  </button>
                )}

                {hasCodeBlocks && (
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      isUser
                        ? "bg-blue-500 hover:bg-blue-400 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {showPreview
                      ? "❌ Close Preview"
                      : `🔍 Preview Code (${message.codeBlocks?.length})`}
                  </button>
                )}
              </div>
            </div>

            {/* Message Content */}
            <div className={`prose max-w-none ${isUser ? "prose-invert" : ""}`}>
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>

            {/* Code Blocks Summary */}
            {hasCodeBlocks && (
              <div className="mt-4 pt-3 border-t border-opacity-20">
                <div className="text-sm opacity-80 mb-2">
                  📦 Generated {message.codeBlocks?.length} code block
                  {message.codeBlocks?.length !== 1 ? "s" : ""}:
                </div>
                <div className="flex flex-wrap gap-2">
                  {message.codeBlocks?.map((block, index) => (
                    <div
                      key={block.id}
                      className={`px-2 py-1 rounded text-xs ${
                        isUser
                          ? "bg-blue-500 bg-opacity-50"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {getLanguageIcon(block.language)} {block.language}
                      {block.filename && (
                        <span className="ml-1 opacity-75">
                          📁 {block.filename.split("/").pop()}
                        </span>
                      )}
                      <span className="ml-1 opacity-75">
                        ({block.metadata?.lineCount || 0} lines)
                      </span>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() =>
                      message.codeBlocks && downloadAllCode(message.codeBlocks)
                    }
                    className={`px-3 py-1 rounded text-xs transition-colors ${
                      isUser
                        ? "bg-green-500 hover:bg-green-400 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    💾 Download All
                  </button>
                  <button
                    onClick={() =>
                      message.codeBlocks && copyAllCode(message.codeBlocks)
                    }
                    className={`px-3 py-1 rounded text-xs transition-colors ${
                      isUser
                        ? "bg-purple-500 hover:bg-purple-400 text-white"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                  >
                    📋 Copy All
                  </button>
                </div>
              </div>
            )}

            {/* Processing Stats (for debugging) */}
            {message.processingStats && (
              <div className="mt-3 pt-3 border-t border-opacity-20">
                <details className="text-xs opacity-75">
                  <summary className="cursor-pointer hover:opacity-100">
                    🔍 Processing Stats
                  </summary>
                  <div className="mt-2 space-y-1">
                    <div>
                      Total blocks: {message.processingStats.totalBlocks}
                    </div>
                    <div>
                      Languages: {message.processingStats.languages.join(", ")}
                    </div>
                    <div>Total lines: {message.processingStats.totalLines}</div>
                    <div>
                      Blocks with files:{" "}
                      {message.processingStats.blocksWithFiles}
                    </div>
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>

        {/* Code Preview Side Panel */}
        {showPreview && hasCodeBlocks && message.codeBlocks && (
          <div
            className={`${
              isFullScreen
                ? "fixed inset-0 z-50 bg-white p-8 top-20 overflow-auto"
                : "w-1/2"
            }`}
          >
            <CodePreview
              codeBlocks={message.codeBlocks}
              isVisible={showPreview}
              onClose={() => {
                setShowPreview(false);
                setIsFullScreen(false);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}

// ===== UTILITY FUNCTIONS =====

function getLanguageIcon(language: string): string {
  const icons: Record<string, string> = {
    javascript: "🟨",
    typescript: "🔷",
    python: "🐍",
    java: "☕",
    html: "🌐",
    css: "🎨",
    sql: "🗄️",
    json: "📄",
    xml: "📋",
    yaml: "📝",
    markdown: "📖",
    bash: "💻",
    shell: "🐚",
    php: "🐘",
    ruby: "💎",
    go: "🐹",
    rust: "🦀",
    cpp: "⚙️",
    c: "🔧",
    csharp: "🔷",
    swift: "🍎",
    kotlin: "🟣",
    dart: "🎯",
  };
  return icons[language.toLowerCase()] || "📄";
}

function downloadAllCode(
  codeBlocks: { filename?: string; language: string; code: string }[]
) {
  codeBlocks.forEach((block, index) => {
    const filename =
      block.filename || `code-${index + 1}.${getFileExtension(block.language)}`;
    const blob = new Blob([block.code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

function copyAllCode(
  codeBlocks: { filename?: string; language: string; code: string }[]
) {
  const allCode = codeBlocks
    .map((block, index) => {
      const header = `// ===== ${
        block.filename || `Code Block ${index + 1}`
      } (${block.language}) =====\n`;
      return header + block.code;
    })
    .join("\n\n");

  navigator.clipboard.writeText(allCode).then(() => {
    console.log("All code copied to clipboard");
  });
}

function getFileExtension(language: string): string {
  const extensions: Record<string, string> = {
    javascript: "js",
    typescript: "ts",
    python: "py",
    java: "java",
    html: "html",
    css: "css",
    sql: "sql",
    json: "json",
    xml: "xml",
    yaml: "yml",
    markdown: "md",
    bash: "sh",
    shell: "sh",
    php: "php",
    ruby: "rb",
    go: "go",
    rust: "rs",
    cpp: "cpp",
    c: "c",
    csharp: "cs",
    swift: "swift",
    kotlin: "kt",
    dart: "dart",
  };
  return extensions[language.toLowerCase()] || "txt";
}
