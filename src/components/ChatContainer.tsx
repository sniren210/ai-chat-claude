"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useChat } from "@/hooks/useChat";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import CodeTemplates from "./CodeTemplates";
import DebugPanel from "./DebugPanel";
import { useState } from "react";

export default function ChatContainer() {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    generateCode,
    clearChat,
    getChatStatistics,
  } = useChat();
  const [showTemplates, setShowTemplates] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);

  // Get processing stats from the latest assistant message
  const latestAssistantMessage = messages
    .filter((msg) => msg.role === "assistant")
    .pop();

  const processingStats = latestAssistantMessage?.processingStats;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              AI Code Generator
            </h1>
            <p className="text-gray-600">
              Generate, design, and architect your code with AI
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              📋 Templates
            </button>
            <button
              onClick={() => setShowDebugPanel(!showDebugPanel)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                showDebugPanel
                  ? "bg-yellow-600 text-white hover:bg-yellow-700"
                  : "bg-gray-600 text-white hover:bg-gray-700"
              }`}
            >
              🔍 Debug {showDebugPanel ? "ON" : "OFF"}
            </button>
            <button
              onClick={clearChat}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              🗑️ Clear Chat
            </button>
          </div>
        </div>
      </div>

      {/* Debug Panel */}
      <DebugPanel
        processingStats={processingStats}
        isVisible={showDebugPanel}
      />

      {/* Templates Panel */}
      {showTemplates && (
        <CodeTemplates
          onSelectTemplate={(template) => {
            sendMessage(template.prompt);
            setShowTemplates(false);
          }}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <div className="text-6xl mb-4">💻</div>
            <h2 className="text-2xl font-semibold mb-2">
              Welcome to AI Code Generator
            </h2>
            <p className="mb-6">
              Describe what you want to build and I`ll generate the code for
              you!
            </p>

            {/* Debug info for empty state */}
            {showDebugPanel && (
              <div className="bg-gray-100 p-4 rounded-lg mb-6 text-left">
                <h3 className="font-semibold mb-2">🔍 Debug Info</h3>
                <p className="text-sm">
                  Debug panel is active. Send a message to see code extraction
                  details.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="font-semibold mb-2">🌐 Web Applications</h3>
                <p className="text-sm text-gray-600">
                  React, Next.js, Vue.js components and full applications
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="font-semibold mb-2">🔧 Backend APIs</h3>
                <p className="text-sm text-gray-600">
                  REST APIs, GraphQL, database schemas, and server logic
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="font-semibold mb-2">📱 Mobile Apps</h3>
                <p className="text-sm text-gray-600">
                  React Native, Flutter, and native mobile solutions
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="font-semibold mb-2">🤖 AI & ML</h3>
                <p className="text-sm text-gray-600">
                  Machine learning models, data processing, and AI integrations
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="font-semibold mb-2">🗄️ Database Design</h3>
                <p className="text-sm text-gray-600">
                  SQL schemas, NoSQL structures, and data migrations
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="font-semibold mb-2">🔒 DevOps & Security</h3>
                <p className="text-sm text-gray-600">
                  CI/CD pipelines, Docker configs, and security implementations
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>Generating code...</span>
                    {showDebugPanel && (
                      <span className="text-xs text-gray-500 ml-2">
                        🔍 Debug: Processing request...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
            {showDebugPanel && (
              <div className="mt-2 text-xs">
                🔍 Debug: Check console for detailed error logs
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSendMessage={sendMessage} disabled={isLoading} />

      {/* Debug Footer */}
      {showDebugPanel && (
        <div className="bg-gray-800 text-green-400 px-6 py-2 text-xs font-mono">
          🔍 Debug Mode Active | Messages: {messages.length} | Code Blocks:{" "}
          {messages.reduce(
            (sum, msg) => sum + (msg.codeBlocks?.length || 0),
            0
          )}{" "}
          | Console logs enabled
        </div>
      )}
    </div>
  );
}
