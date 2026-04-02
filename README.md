# 🚀 Springboard.io

**AI-Powered Agentic Onboarding** — From Offer to Productive in Minutes.

Springboard.io bridges the chaotic gap between a signed offer and a productive Day 1 using AI agents, smart buddy matching, and human-in-the-loop oversight.

> **Hackathon Judges:** The fastest way to see this in action is the [live demo](#live-demo) link below. No setup required!

---

## Live Demo

🔗 **[springboard-io.vercel.app](https://springboard-io.vercel.app)** _(if deployed)_

**Or run locally in 30 seconds:**

```bash
git clone https://github.com/SamLev-2004/Springboard.io.git
cd Springboard.io
npm install
echo "GOOGLE_GENERATIVE_AI_API_KEY=your_key_here" > .env.local
npm run dev
```

> 💡 **No API key?** The app works without one — chat will use a local fallback mode with pre-loaded company knowledge.

---

## Demo Walkthrough (2 minutes)

### Step 1: Manager Dashboard → `/manager`
1. Select a new hire from the dropdown (e.g. "Alex Johnson — Sr. Frontend Engineer")
2. Click **"Generate AI Plan"** — Gemini creates a full personalized onboarding plan
3. Edit anything — welcome message, buddy, goals, documents, agentic tasks
4. Click **"Approve & Dispatch Agents 🚀"**
5. Watch the **Agent Execution Terminal** — each task completes one by one with live logs
6. See the **Slack Nudge Preview** slide in
7. Click **"View New Hire Portal →"** when agents finish

### Step 2: New Hire Portal → `/new-hire`
1. See the **personalized welcome** from the manager + your assigned buddy
2. View **provisioned workspace** — email, calendar invite, access badges (tangible agent results)
3. Open **action items** and click "Start" — interactive inline UIs:
   - 📄 **NDA** — scroll through the full agreement, then sign
   - 👕 **Swag** — pick your laptop and hoodie size
   - 📸 **Profile** — set your avatar initials
   - 🎓 **Training** — watch the onboarding video
4. Open the **AI Chat** — ask policy questions ("What's the vacation policy?", "How do expense reports work?")
5. Try a **sensitive question** — type "What's the executive compensation?" → see the ⚠️ Flagged badge appear
6. Click **"Start Check-in"** at the bottom → complete the Pulse Survey

---

## Features

| Feature | Description |
|---------|-------------|
| **AI Plan Generation** | Gemini creates tailored welcome messages, buddy matches, goals, and tasks based on role + personality |
| **Human-in-the-Loop** | Managers review, edit, and approve everything before it reaches the new hire |
| **Agent Execution Terminal** | Live animated pipeline showing each AI agent completing its task |
| **RAG-Powered Chat** | Streaming AI assistant with company knowledge (vacation, expenses, remote work, IT, ethics) |
| **Interactive Action Items** | NDA signing, swag picker, profile setup, and training modules — all inline |
| **Sensitive Question Flagging** | Detects salary/compensation/NDA topics and flags for HR review |
| **Pulse Check-ins** | Day 7/14/30 surveys to monitor new hire sentiment |
| **Manager Nudge Preview** | Slack notification mockup showing automated team announcements |
| **Smart Buddy Matching** | Personality-driven pairing with the ideal onboarding mentor |

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + TypeScript
- **Google Gemini AI** (via Vercel AI SDK v5)
- **Vanilla CSS** — dark mode glassmorphism design system
- **Zod** — structured AI output validation
- **RAG** — keyword-scored company knowledge retrieval

## Project Structure

```
src/
  app/
    page.tsx                     # Landing page
    layout.tsx                   # Root layout with nav
    globals.css                  # Dark mode theme
    manager/page.tsx             # Manager dashboard (plan gen, HIL, dispatch)
    new-hire/page.tsx            # New hire portal (tasks, chat, pulse)
    api/
      onboarding/generate/       # AI plan generation (Gemini + Zod)
      chat/                      # Streaming chat with RAG
  lib/
    ai/prompts.ts                # System prompts + Zod schemas
    ai/companyKnowledge.ts       # RAG knowledge base (vacation, IT, ethics, etc.)
    mcp/mockData.ts              # Mock employee profiles & role templates
boardingpass/                    # Greg's standalone Python/FastAPI demo
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | No* | Google AI Studio API key for Gemini. *App works without it in fallback mode. |

## Team

Built at **Boundary Hackathon 2026** by Sam Levkovsky, Greg Ngo and Galat Bum
