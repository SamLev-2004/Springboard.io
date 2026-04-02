import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { MOCK_PROFILES, ROLE_TEMPLATES, MOCK_BUDDIES } from "@/lib/mcp/mockData";
import { OnboardingPlanSchema, getOnboardingPrompt } from "@/lib/ai/prompts";

export const maxDuration = 30;

function buildFallbackPlan(employee: any, roleTemplate: any) {
  const derivedEmail = `${employee.name.toLowerCase().replace(/\s+/g, ".")}@springboard.io`;
  const buddy =
    MOCK_BUDDIES.find((b) => employee.role.toLowerCase().includes(b.role.toLowerCase().split(" ")[0])) ||
    MOCK_BUDDIES[0];

  const softwareTasks = (roleTemplate?.softwareAccess || []).map((software: string, i: number) => ({
    id: `task_permission_${i + 1}`,
    title: `Provision ${software} Access`,
    description: `Grant ${software} access for ${employee.name}.`,
    status: "pending" as const,
    type: "permission" as const,
  }));

  const documentTasks = (roleTemplate?.documents || []).map((doc: any, i: number) => ({
    id: `task_doc_${i + 1}`,
    title: `Share ${doc.title}`,
    description: `Send ${doc.title} to ${employee.name}.`,
    status: "pending" as const,
    type: "document" as const,
  }));

  return {
    welcomeMessage: `Welcome to the team, ${employee.name.split(" ")[0]}! We're excited to have you join ${employee.department}. Your first week will focus on setup, key relationships, and an early confidence win.`,
    buddyName: buddy.name,
    buddyReason: `${buddy.name} is a strong fit based on role alignment and communication style.`,
    firstWeekGoals: [
      "Finish environment and account setup for core tools",
      "Meet your manager and onboarding buddy for role context",
      "Review priority docs and ship one small starter task",
    ],
    agenticTasks: [
      {
        id: "task_email_welcome",
        title: "Send Welcome Email",
        description: `Send a personalized welcome note to ${derivedEmail}.`,
        status: "pending" as const,
        type: "email" as const,
      },
      ...softwareTasks,
      ...documentTasks,
      {
        id: "task_calendar_buddy",
        title: "Schedule Buddy 1:1",
        description: `Schedule a 30-minute intro with ${buddy.name}.`,
        status: "pending" as const,
        type: "calendar" as const,
      },
    ],
  };
}

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

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json({
        employee,
        plan: buildFallbackPlan(employee, roleTemplate),
        fallback: true,
      });
    }

    // Call the model via Vercel AI SDK (We use gemini-1.5-pro here, fallback to flash if needed)
    // Make sure GOOGLE_GENERATIVE_AI_API_KEY is defined in .env.local
    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
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
