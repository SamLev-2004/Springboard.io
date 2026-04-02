import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { findRelevantKnowledge } from "@/lib/ai/companyKnowledge";

export const maxDuration = 30;

export async function POST(req: Request) {
  let messages: any[];
  try {
    const body = await req.json();
    messages = body.messages ?? [];
  } catch {
    return new Response("Invalid request body", { status: 400 });
  }

  // Extract user text from either content or parts (Vercel AI SDK v5 compat)
  const lastUserMessage = messages.filter((m: any) => m.role === "user").pop();
  let userText = "";
  if (lastUserMessage) {
    if (typeof lastUserMessage.content === "string") {
      userText = lastUserMessage.content;
    } else if (Array.isArray(lastUserMessage.parts)) {
      userText = lastUserMessage.parts
        .filter((p: any) => p.type === "text")
        .map((p: any) => p.text)
        .join("");
    }
  }

  const ragContext = userText ? findRelevantKnowledge(userText) : null;

  const systemPrompt = `You are Springboard.io's friendly onboarding assistant. You help new employees get settled in on their first day.

Your personality: warm, enthusiastic, concise, and helpful. Use emojis sparingly but effectively. Keep answers to 2-3 sentences max.

${ragContext ? `IMPORTANT — Use this verified company information to answer the question:\n"${ragContext}"\nAlways prefer this information over your general knowledge.` : "If you don't know the specific answer, say so honestly and suggest they ask their onboarding buddy or check with HR."}

When a user says they want to complete a task like signing an NDA, picking swag, uploading a profile picture, or completing training — walk them through it step by step as if the system were real. Be specific and conversational. For example:
- NDA: "Great! I've pulled up your NDA. Please review the key terms and click 'I Agree' to sign digitally."
- Swag: "Awesome! We have hoodies (S-XXL), t-shirts, and sticker packs. What size hoodie would you like?"
- Profile: "Just drag and drop your photo or click 'Upload'. Square photos work best for the directory!"
- Training: "The security awareness training takes about 15 minutes. Let me walk you through Module 1..."

Remember: you're talking to a brand new employee who might be nervous. Be encouraging!`;

  // Local preview fallback — simulate a streaming response so TextStreamChatTransport works
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    const fallback = ragContext
      ? `${ragContext} 😊 Let me know if you have any other questions!`
      : "Welcome! I'm here to help with your onboarding. You can ask me about WiFi, parking, benefits, your schedule, or anything else. What would you like to know?";

    // Simulate a text stream by sending the full response as a stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(fallback));
        controller.close();
      },
    });

    return new Response(stream, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: systemPrompt,
    messages,
  });

  return result.toTextStreamResponse();
}
