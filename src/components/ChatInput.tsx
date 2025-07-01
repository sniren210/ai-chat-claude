import { useState } from "react";
import { CodeGenerationRequest } from "@/types/chat";

interface ChatInputProps {
  onSendMessage: (message: string, codeRequest?: CodeGenerationRequest) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [showCodeOptions, setShowCodeOptions] = useState(false);
  const [codeRequest, setCodeRequest] = useState<
    Partial<CodeGenerationRequest>
  >({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(
        message,
        showCodeOptions ? (codeRequest as CodeGenerationRequest) : undefined
      );
      setMessage("");
      setCodeRequest({});
      setShowCodeOptions(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the code you want to generate..."
            className="w-full p-3 border border-gray-300 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[50px] max-h-[100px]"
            rows={1}
            disabled={disabled}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
        </div>

        <div className="flex flex-col">
          <button
            type="submit"
            disabled={disabled || !message.trim()}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
