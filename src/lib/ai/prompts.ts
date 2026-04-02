import { z } from "zod";

export const OnboardingPlanSchema = z.object({
  welcomeMessage: z.string().describe("A warm, personalized welcome message for the new hire"),
  buddyName: z.string().describe("The name of the assigned buddy"),
  buddyReason: z.string().describe("Why this buddy was chosen based on personality and role"),
  firstWeekGoals: z.array(z.string()).describe("3-4 high-level goals for the first week"),
  agenticTasks: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    status: z.enum(["pending", "completed", "failed"]),
    type: z.enum(["email", "permission", "calendar", "document"])
  })).describe("Actionable tasks the AI agent will execute (e.g. 'Grant Vercel access', 'Draft Intro Email')")
});

export const getOnboardingPrompt = (
  employee: any, 
  roleTemplate: any, 
  buddies: any[]
) => `
You are Springboard.io's AI Onboarding Manager. 

A new employee has been onboarded:
- Name: ${employee.name}
- Role: ${employee.role}
- Department: ${employee.department}
- Location: ${employee.location}
- Personality: ${employee.personalityType}

Role Context (what they need):
- Software: ${roleTemplate?.softwareAccess?.join(", ")}
- Key Docs: ${roleTemplate?.documents?.map((d: any) => d.title).join(", ")}

Available Buddies:
${buddies.map(b => `- ${b.name} (${b.role}) - Personality: ${b.personalityType}`).join("\n")}

Your task is to generate a personalized onboarding plan and agentic tasks. 
1. Choose the best buddy for them based on role and personality.
2. Draft a vibrant welcome message.
3. List 3 key first week goals.
4. Generate the Agentic Tasks needed to get them set up. Create ONE permission task per software access they need, ONE document task for sharing the key docs, and ONE calendar task to schedule a 1:1 with their assigned buddy. Make sure the statuses are all "pending".
`;
