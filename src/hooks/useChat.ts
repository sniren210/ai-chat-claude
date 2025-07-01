import { useState, useCallback } from "react";
import { Message, ChatState, CodeGenerationRequest } from "@/types/chat";

export const useChat = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  const sendMessage = useCallback(
    async (content: string, codeRequest?: CodeGenerationRequest) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      console.log("🚀 ===== CHAT HOOK: SENDING MESSAGE =====");
      console.log("📝 User message:", content.substring(0, 100) + "...");
      console.log("⚙️ Code request:", codeRequest);

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        isLoading: true,
        error: null,
      }));

      try {
        console.log("📡 ===== MAKING API REQUEST =====");
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [...state.messages, userMessage].map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            codeRequest,
          }),
        });

        console.log("📨 ===== API RESPONSE RECEIVED =====");
        console.log("✅ Response status:", response.status);

        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        console.log("📦 ===== PROCESSING API RESPONSE =====");
        console.log("📊 Response data keys:", Object.keys(data));
        console.log(
          "🔢 Code blocks count:",
          data.message?.codeBlocks?.length || 0
        );
        console.log("📈 Processing stats:", data.message?.processingStats);

        // ===== MESSAGE CREATION POINT =====
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message.content,
          timestamp: new Date(),
          codeBlocks: data.message.codeBlocks || [],
        };

        console.log("✨ ===== ASSISTANT MESSAGE CREATED =====");
        console.log("🆔 Message ID:", assistantMessage.id);
        console.log("📝 Content length:", assistantMessage.content.length);
        console.log(
          "🔢 Code blocks attached:",
          assistantMessage.codeBlocks?.length || 0
        );

        // ===== STATE UPDATE POINT =====
        setState((prev) => {
          console.log("🔄 ===== UPDATING CHAT STATE =====");
          console.log("📊 Previous messages count:", prev.messages.length);
          console.log("📊 New messages count:", prev.messages.length + 1);

          return {
            ...prev,
            messages: [...prev.messages, assistantMessage],
            isLoading: false,
          };
        });

        console.log("✅ ===== MESSAGE PROCESSING COMPLETE =====");
      } catch (error) {
        console.error("💥 ===== CHAT HOOK ERROR =====", error);

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "An error occurred",
        }));
      }
    },
    [state.messages]
  );

  const generateCode = useCallback(
    async (request: CodeGenerationRequest) => {
      console.log("🔧 ===== GENERATE CODE FUNCTION =====");
      console.log("📋 Code generation request:", request);

      const prompt = `Generate ${request.language || "code"} for: ${
        request.prompt
      }
      ${request.framework ? `Framework: ${request.framework}` : ""}
      ${
        request.requirements
          ? `Requirements: ${request.requirements.join(", ")}`
          : ""
      }`;

      console.log("📝 Generated prompt:", prompt);
      await sendMessage(prompt, request);
    },
    [sendMessage]
  );

  const clearChat = useCallback(() => {
    console.log("🗑️ ===== CLEARING CHAT =====");
    setState({
      messages: [],
      isLoading: false,
      error: null,
    });
    console.log("✅ Chat cleared");
  }, []);

  // ===== UTILITY FUNCTIONS =====
  const getCodeBlocksByLanguage = useCallback(
    (language: string) => {
      console.log(`🔍 Getting code blocks for language: ${language}`);
      const blocks = state.messages
        .filter((msg) => msg.role === "assistant")
        .flatMap((msg) => msg.codeBlocks || [])
        .filter(
          (block) => block.language.toLowerCase() === language.toLowerCase()
        );

      console.log(`📦 Found ${blocks.length} blocks for ${language}`);
      return blocks;
    },
    [state.messages]
  );

  const getAllCodeBlocks = useCallback(() => {
    console.log("📦 Getting all code blocks");
    const allBlocks = state.messages
      .filter((msg) => msg.role === "assistant")
      .flatMap((msg) => msg.codeBlocks || []);

    console.log(`📊 Total code blocks: ${allBlocks.length}`);
    return allBlocks;
  }, [state.messages]);

  const getChatStatistics = useCallback(() => {
    console.log("📊 Generating chat statistics");

    const stats = {
      totalMessages: state.messages.length,
      userMessages: state.messages.filter((msg) => msg.role === "user").length,
      assistantMessages: state.messages.filter(
        (msg) => msg.role === "assistant"
      ).length,
      totalCodeBlocks: getAllCodeBlocks().length,
      uniqueLanguages: [
        ...new Set(getAllCodeBlocks().map((block) => block.language)),
      ],
      averageMessageLength:
        state.messages.reduce((sum, msg) => sum + msg.content.length, 0) /
          state.messages.length || 0,
    };

    console.log("📈 Chat statistics:", stats);
    return stats;
  }, [state.messages, getAllCodeBlocks]);

  console.log("🔄 ===== CHAT HOOK STATE =====");
  console.log("📊 Current state:", {
    messageCount: state.messages.length,
    isLoading: state.isLoading,
    hasError: !!state.error,
  });

  return {
    // ===== CORE STATE =====
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,

    // ===== CORE ACTIONS =====
    sendMessage,
    generateCode,
    clearChat,

    // ===== UTILITY FUNCTIONS =====
    getCodeBlocksByLanguage,
    getAllCodeBlocks,
    getChatStatistics,
  };
};
