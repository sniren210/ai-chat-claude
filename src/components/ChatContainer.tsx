"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useChat } from "@/hooks/useChat";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import CodeTemplates from "./CodeTemplates";
import DebugPanel from "./DebugPanel";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { div } from "framer-motion/client";

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
  const [isInputVisible, setIsInputVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const handleScroll = (e: Event) => {
      if (messages.length === 0) return;

      const scrollElement = e.target as HTMLElement;
      const latest = scrollElement.scrollTop;
      const direction = latest > lastScrollYRef.current ? "down" : "up";

      if (direction === "down" && latest > 50) {
        setIsInputVisible(false);
      } else if (direction === "up") {
        setIsInputVisible(true);
      }
      lastScrollYRef.current = latest;
    };

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // Get processing stats from the latest assistant message
  const latestAssistantMessage = messages
    .filter((msg) => msg.role === "assistant")
    .pop();

  const processingStats = latestAssistantMessage?.processingStats;

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {messages.length !== 0 && (
            <>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome to Flixscode.ai
                </h1>
                <p className="text-gray-400">
                  Transform your ideas into stunning UI/UX with a single prompt
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDebugPanel(!showDebugPanel)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    showDebugPanel
                      ? "bg-yellow-400 text-white hover:bg-yellow-700"
                      : "bg-gray-400 text-white hover:bg-gray-700"
                  }`}
                >
                  🔍 Debug {showDebugPanel ? "ON" : "OFF"}
                </button>
                <button
                  onClick={clearChat}
                  className="px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  🗑️ Clear Chat
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="overflow-y-auto p-6 " ref={scrollContainerRef}>
        {messages.length === 0 ? (
          <div className="text-center text-black mt-20 ">
            <div className="text-6xl mb-4">
              <br />
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              Welcome to Flixscode.ai
            </h2>
            <p className="mb-6">
              Just describe your dream interface, and I`ll craft beautiful,
              responsive code instantly
            </p>

            {/* Input */}
            <div className="sticky bottom-0 mb-6 w-2/3 m-auto">
              <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div
                className="bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
                onClick={() =>
                  sendMessage(
                    "Create modern UI components with animations and interactions"
                  )
                }
              >
                <h3 className="font-semibold mb-2">✨ Modern UI Components</h3>
                <p className="text-sm text-gray-400">
                  Beautiful, responsive components with animations and
                  interactions
                </p>
              </div>
              <div
                className="bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
                onClick={() =>
                  sendMessage(
                    "Help me create a design system with cohesive tokens and themes"
                  )
                }
              >
                <h3 className="font-semibold mb-2">🎨 Design Systems</h3>
                <p className="text-sm text-gray-400">
                  Cohesive design tokens, themes, and component libraries
                </p>
              </div>
              <div
                className="bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
                onClick={() =>
                  sendMessage(
                    "Design a responsive layout that works across all devices"
                  )
                }
              >
                <h3 className="font-semibold mb-2">📱 Responsive Layouts</h3>
                <p className="text-sm text-gray-400">
                  Fluid designs that work perfectly across all devices
                </p>
              </div>
              <div
                className="bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
                onClick={() =>
                  sendMessage(
                    "Create interactive features with animations and transitions"
                  )
                }
              >
                <h3 className="font-semibold mb-2">⚡ Interactive Features</h3>
                <p className="text-sm text-gray-400">
                  Engaging animations, transitions, and micro-interactions
                </p>
              </div>
              <div
                className="bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
                onClick={() =>
                  sendMessage(
                    "Design a conversion-focused landing page with visuals and CTAs"
                  )
                }
              >
                <h3 className="font-semibold mb-2">🎯 Landing Pages</h3>
                <p className="text-sm text-gray-400">
                  Conversion-focused pages with stunning visuals and CTAs
                </p>
              </div>
              <div
                className="bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
                onClick={() =>
                  sendMessage(
                    "Implement design patterns for navigation, forms and user flows"
                  )
                }
              >
                <h3 className="font-semibold mb-2">🌈 Design Patterns</h3>
                <p className="text-sm text-gray-400">
                  Best practices for navigation, forms, and user flows
                </p>
              </div>
            </div> */}
          </div>
        ) : (
          <div>
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                      <span>Crafting your design...</span>
                      {showDebugPanel && (
                        <span className="text-xs text-black ml-2">
                          🔍 Debug: Processing request...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Input */}
            <motion.div
              className="sticky bottom-0 mt-8"
              initial={{ y: 0 }}
              animate={{
                y: isInputVisible ? 0 : 100,
                display: isInputVisible ? "block" : "none",
              }}
              transition={{ duration: 0.3 }}
            >
              <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
            </motion.div>
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
