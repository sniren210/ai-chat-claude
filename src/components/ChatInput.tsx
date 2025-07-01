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

  const popularLanguages = [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C#",
    "Go",
    "Rust",
    "PHP",
    "Ruby",
    "Swift",
  ];

  const popularFrameworks = [
    "React",
    "Next.js",
    "Vue.js",
    "Angular",
    "Express.js",
    "Django",
    "Flask",
    "Spring Boot",
    "Laravel",
    ".NET",
  ];

  return (
    <div className="border-t bg-white p-4">
      {showCodeOptions && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-3">Code Generation Options</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select
                value={codeRequest.language || ""}
                onChange={(e) =>
                  setCodeRequest((prev) => ({
                    ...prev,
                    language: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Language</option>
                {popularLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Framework
              </label>
              <select
                value={codeRequest.framework || ""}
                onChange={(e) =>
                  setCodeRequest((prev) => ({
                    ...prev,
                    framework: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Framework</option>
                {popularFrameworks.map((framework) => (
                  <option key={framework} value={framework}>
                    {framework}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the code you want to generate..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            disabled={disabled}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setShowCodeOptions(!showCodeOptions)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showCodeOptions
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            ⚙️ Options
          </button>

          <button
            type="submit"
            disabled={disabled || !message.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Generate
          </button>
        </div>
      </form>
    </div>
  );
}
