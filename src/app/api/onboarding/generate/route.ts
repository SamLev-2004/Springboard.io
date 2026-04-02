import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { MOCK_PROFILES, ROLE_TEMPLATES, MOCK_BUDDIES } from "@/lib/mcp/mockData";
import { OnboardingPlanSchema, getOnboardingPrompt } from "@/lib/ai/prompts";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { employeeId } = await req.json();

    // Fetch from our "mock MCP"
    const employee = MOCK_PROFILES.find(p => p.id === employeeId);
    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    // Find the right template
    const roleTemplate = ROLE_TEMPLATES.find(t => 
      employee.role.toLowerCase().includes(t.roleKeyword.toLowerCase())
    ) || ROLE_TEMPLATES[0];

    // Build the AI text prompt
    const prompt = getOnboardingPrompt(employee, roleTemplate, MOCK_BUDDIES);

    // Call the model via Vercel AI SDK (We use gemini-1.5-pro here, fallback to flash if needed)
    // Make sure GOOGLE_GENERATIVE_AI_API_KEY is defined in .env.local
    const { object } = await generateObject({
      model: google("gemini-1.5-flash"),
      schema: OnboardingPlanSchema,
      prompt: prompt,
    });

    return NextResponse.json({
      employee,
      plan: object
    });

  } catch (error: any) {
    console.error("AI Generation failed:", error);
    return NextResponse.json({ error: error.message || "Failed to generate onboarding plan." }, { status: 500 });
  }
}
