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

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        isLoading: true,
        error: null,
      }));

      try {
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

        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message.content,
          timestamp: new Date(),
          codeBlocks: data.message.codeBlocks || [],
        };

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
          isLoading: false,
        }));
      } catch (error) {
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
      const prompt = `Generate ${request.language || "code"} for: ${
        request.prompt
      }
      ${request.framework ? `Framework: ${request.framework}` : ""}
      ${
        request.requirements
          ? `Requirements: ${request.requirements.join(", ")}`
          : ""
      }`;

      await sendMessage(prompt, request);
    },
    [sendMessage]
  );

  const clearChat = useCallback(() => {
    setState({
      messages: [],
      isLoading: false,
      error: null,
    });
  }, []);

  const getCodeBlocksByLanguage = useCallback(
    (language: string) => {
      const blocks = state.messages
        .filter((msg) => msg.role === "assistant")
        .flatMap((msg) => msg.codeBlocks || [])
        .filter(
          (block) => block.language.toLowerCase() === language.toLowerCase()
        );

      return blocks;
    },
    [state.messages]
  );

  const getAllCodeBlocks = useCallback(() => {
    const allBlocks = state.messages
      .filter((msg) => msg.role === "assistant")
      .flatMap((msg) => msg.codeBlocks || []);

    return allBlocks;
  }, [state.messages]);

  const getChatStatistics = useCallback(() => {
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

    return stats;
  }, [state.messages, getAllCodeBlocks]);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,

    sendMessage,
    generateCode,
    clearChat,

    getCodeBlocksByLanguage,
    getAllCodeBlocks,
    getChatStatistics,
  };
};
