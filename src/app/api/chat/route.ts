import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { MessageParam } from "@anthropic-ai/sdk/resources";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Convert messages to Claude format
    const claudeMessages = messages.map(
      (msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : ("assistant" as const),
        content: msg.content,
      })
    );

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1000,
      messages: claudeMessages as MessageParam[],
    });

    const assistantMessage = response.content[0];

    console.log("Claude response:", assistantMessage);

    if (assistantMessage.type === "text") {
      return NextResponse.json({
        message: {
          role: "assistant",
          content: assistantMessage.text,
        },
      });
    }

    return NextResponse.json(
      { error: "Unexpected response format" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error calling Claude API:", error);
    return NextResponse.json(
      { error: "Failed to get response from Claude" },
      { status: 500 }
    );
  }
}
