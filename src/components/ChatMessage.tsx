import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2 break-words",
          isUser
            ? "bg-blue-500 text-white ml-auto"
            : "bg-gray-200 text-gray-800 mr-auto"
        )}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        <div
          className={cn(
            "text-xs mt-1 opacity-70",
            isUser ? "text-blue-100" : "text-gray-500"
          )}
        >
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};
