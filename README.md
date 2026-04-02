# Springboard.io

**AI-Powered Agentic Onboarding** — From Offer to Productive in Minutes.

Springboard.io bridges the chaotic gap between a signed offer and a productive Day 1 using AI agents, smart buddy matching, and human-in-the-loop oversight.

## Features

- **Manager Dashboard** — Select an employee profile, generate a personalized AI onboarding plan, review it, and approve with human-in-the-loop oversight
- **AI Plan Generation** — Google Gemini crafts tailored welcome messages, buddy matches, first-week goals, and agentic tasks based on role and personality
- **Agentic Task Execution** — Real-time animated task pipeline simulating AI agents provisioning access, sending emails, scheduling meetings, and sharing documents
- **RAG-Powered Chat** — Streaming AI chat assistant that answers new hire questions using company knowledge (WiFi, parking, dress code, Slack, etc.)
- **Smart Buddy Matching** — Personality-driven matching to pair new hires with the ideal onboarding mentor
- **End-to-End Flow** — Manager generates and approves a plan, which is passed directly to the new hire portal for a seamless experience

## Tech Stack

- **Next.js 16** (App Router)
- **React 19** + TypeScript
- **Google Gemini AI** (via Vercel AI SDK)
- **Vanilla CSS** (dark mode glassmorphism theme)
- **Zod** for structured AI output validation

## Getting Started

### Prerequisites

- Node.js 18+
- A Google Generative AI API key

### Setup

```bash
# Install dependencies
npm install

# Add your API key
echo "GOOGLE_GENERATIVE_AI_API_KEY=your_key_here" > .env.local

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

### Demo Flow

1. Go to **Manager Dashboard** (`/manager`)
2. Select an employee and click **Generate AI Plan**
3. Review the generated plan and click **Approve & Dispatch Agents**
4. You'll be redirected to the **New Hire Portal** (`/new-hire`) with the real AI-generated plan
5. Watch agentic tasks execute in real-time with the activity log
6. Open the chat widget and ask questions — powered by Gemini with RAG

## Project Structure

```
src/
  app/
    page.tsx                    # Landing page
    layout.tsx                  # Root layout with nav
    globals.css                 # Dark mode theme + shared styles
    manager/page.tsx            # Manager dashboard
    new-hire/page.tsx           # New hire onboarding portal
    api/
      onboarding/generate/      # AI plan generation endpoint
      chat/                     # Streaming chat endpoint with RAG
  lib/
    ai/prompts.ts               # Zod schema + system prompts
    ai/companyKnowledge.ts      # RAG knowledge base
    mcp/mockData.ts             # Mock employee profiles & role templates
```

## Built at Boundary Hackathon 2026
