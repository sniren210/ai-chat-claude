import { Message } from "@/types/chat";
import { useState } from "react";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [copiedBlocks, setCopiedBlocks] = useState<Set<string>>(new Set());

  const copyToClipboard = async (text: string, blockId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedBlocks((prev) => new Set([...prev, blockId]));
      setTimeout(() => {
        setCopiedBlocks((prev) => {
          const newSet = new Set(prev);
          newSet.delete(blockId);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const formatContent = (content: string) => {
    // Remove code blocks from content since we'll display them separately
    return content.replace(/```[\w]*:?[^\n]*\n[\s\S]*?```/g, "").trim();
  };

  return (
    <div
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`max-w-4xl ${
          message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100"
        } rounded-lg p-4`}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold">
            {message.role === "user" ? "👤 You" : "🤖 Code Assistant"}
          </span>
          <span className="text-xs opacity-70">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>

        {formatContent(message.content) && (
          <div className="whitespace-pre-wrap mb-3">
            {formatContent(message.content)}
          </div>
        )}

        {message.codeBlocks && message.codeBlocks.length > 0 && (
          <div className="space-y-4">
            {message.codeBlocks.map((block) => (
              <div
                key={block.id}
                className="bg-gray-900 rounded-lg overflow-hidden"
              >
                <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-300">
                      {block.language}
                    </span>
                    {block.filename && (
                      <span className="text-sm text-blue-400">
                        {block.filename}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => copyToClipboard(block.code, block.id)}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {copiedBlocks.has(block.id) ? "✅ Copied!" : "📋 Copy"}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto">
                  <code className="text-sm text-gray-100">{block.code}</code>
                </pre>
                {block.description && (
                  <div className="px-4 py-2 bg-gray-800 text-sm text-gray-300">
                    {block.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
