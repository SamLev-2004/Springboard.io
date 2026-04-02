import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { findRelevantKnowledge } from "@/lib/ai/companyKnowledge";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Get the latest user message for RAG lookup
  const lastUserMessage = messages.filter((m: any) => m.role === "user").pop();
  const ragContext = lastUserMessage ? findRelevantKnowledge(lastUserMessage.content) : null;

  const systemPrompt = `You are Springboard.io's friendly onboarding assistant. You help new employees get settled in on their first day.

Your personality: warm, enthusiastic, concise, and helpful. Use emojis sparingly but effectively. Keep answers to 2-3 sentences max.

${ragContext ? `IMPORTANT — Use this verified company information to answer the question:\n"${ragContext}"\nAlways prefer this information over your general knowledge.` : "If you don't know the specific answer, say so honestly and suggest they ask their onboarding buddy or check with HR."}

Remember: you're talking to a brand new employee who might be nervous. Be encouraging!`;

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: systemPrompt,
    messages,
  });

  return result.toTextStreamResponse();
}
