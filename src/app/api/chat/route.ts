/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { MessageParam } from "@anthropic-ai/sdk/resources";
import { getProcessingStats, processCodeBlocks } from "@/lib/codeProcessor";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const CODE_GENERATION_SYSTEM_PROMPT = `You are an expert software architect and code generator. Your role is to:

1. Generate clean, well-structured, and production-ready code
2. Provide detailed explanations for design decisions
3. Include proper error handling and best practices
4. Suggest file structures and organization
5. Provide multiple implementation options when relevant
6. Include comments and documentation
7. Consider scalability and maintainability

When generating code:
- Always specify the programming language and framework
- Include file paths in code blocks using the format: \`\`\`language:filepath
- Provide step-by-step implementation guides
- Suggest testing strategies
- Include package dependencies when needed
- Consider security best practices

Format your responses with clear sections:
- Overview/Architecture
- Implementation
- File Structure
- Dependencies
- Usage Examples
- Best Practices`;

export async function POST(request: NextRequest) {
  try {
    const { messages, codeRequest } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Convert messages to Claude format with system prompt for code generation
    const claudeMessages = messages.map(
      (msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : ("assistant" as const),
        content: msg.content,
      })
    );

    console.log("🚀 ===== API REQUEST START =====");
    console.log("📝 Messages being sent:", claudeMessages.length);
    console.log("⚙️ Code request options:", codeRequest);

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4000,
      system: CODE_GENERATION_SYSTEM_PROMPT,
      messages: claudeMessages as MessageParam[],
    });

    console.log("✅ ===== CLAUDE RESPONSE RECEIVED =====");
    console.log("📊 Response type:", response.content[0]?.type);

    const assistantMessage = response.content[0];

    if (assistantMessage.type === "text") {
      console.log("📄 Raw response text length:", assistantMessage.text.length);

      // ===== EXTRACTION POINT: Start code processing =====
      console.log("🔄 ===== STARTING CODE PROCESSING =====");
      const processedCodeBlocks = processCodeBlocks(assistantMessage.text);

      // ===== PROCESSING POINT: Generate statistics =====
      console.log("📊 ===== GENERATING PROCESSING STATS =====");
      const processingStats = getProcessingStats(processedCodeBlocks);

      // ===== FALLBACK: Use simple extraction if enhanced processing fails =====
      let finalCodeBlocks = processedCodeBlocks;
      if (processedCodeBlocks.length === 0) {
        console.log(
          "⚠️ Enhanced processing found no blocks, falling back to simple extraction"
        );
        finalCodeBlocks = extractCodeBlocks(assistantMessage.text);
      }

      // ===== RESPONSE PREPARATION POINT =====
      console.log("📦 ===== PREPARING FINAL RESPONSE =====");
      const responseData = {
        message: {
          role: "assistant",
          content: assistantMessage.text,
          codeBlocks: finalCodeBlocks,
          processingStats: processingStats,
        },
      };

      console.log("📤 ===== SENDING RESPONSE TO CLIENT =====");
      console.log("📋 Response summary:", {
        hasContent: !!responseData.message.content,
        codeBlockCount: responseData.message.codeBlocks.length,
        totalResponseSize: JSON.stringify(responseData).length,
        languages: processingStats.languages,
        totalLines: processingStats.totalLines,
      });

      console.log("🏁 ===== API REQUEST COMPLETE =====");
      return NextResponse.json(responseData);
    }

    console.log("❌ ===== UNEXPECTED RESPONSE FORMAT =====");
    return NextResponse.json(
      { error: "Unexpected response format" },
      { status: 500 }
    );
  } catch (error) {
    console.error("💥 ===== API ERROR =====", error);
    return NextResponse.json(
      { error: "Failed to get response from Claude" },
      { status: 500 }
    );
  }
}

// ===== FALLBACK EXTRACTION FUNCTION (Simple) =====
function extractCodeBlocks(text: string) {
  console.log("🔧 ===== FALLBACK: SIMPLE CODE EXTRACTION =====");
  console.log("📝 Input text length:", text.length);

  const codeBlockRegex = /```(\w+):?([^\n]*)\n([\s\S]*?)```/g;
  const codeBlocks = [];
  let match;
  let blockCount = 0;

  console.log("🔍 Starting simple regex matching...");

  // ===== SIMPLE EXTRACTION LOOP =====
  while ((match = codeBlockRegex.exec(text)) !== null) {
    blockCount++;
    console.log(`📦 SIMPLE EXTRACTION - Found block ${blockCount}:`);
    console.log(`   - Language: "${match[1]}"`);
    console.log(`   - Filename: "${match[2].trim()}"`);
    console.log(`   - Code length: ${match[3].trim().length}`);

    const extractedBlock = {
      id: `simple_${Date.now()}_${blockCount}_${Math.random()
        .toString(36)
        .substr(2, 6)}`,
      language: match[1],
      filename: match[2].trim() || undefined,
      code: match[3].trim(),
    };

    console.log(`   - Generated ID: ${extractedBlock.id}`);

    // ===== SIMPLE PROCESSING: Add to collection =====
    codeBlocks.push(extractedBlock);
  }

  console.log("✅ ===== SIMPLE EXTRACTION COMPLETE =====");
  console.log(`📦 Total blocks: ${codeBlocks.length}`);

  return codeBlocks;
}
