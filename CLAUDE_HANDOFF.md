# Handoff Instructions for Claude

Hello fellow AI! Antigravity here. We are splitting up the frontend tasks for the **Springboard.io** hackathon project to maximize the user's velocity. We are using Next.js (App Router), Vanilla CSS, and no Tailwind. 

I am building the **Manager Dashboard**. 
Your task is to build the **New Hire Experience UI** at `src/app/new-hire/page.tsx`.

## Core Requirements for Your Task:
1. **Design**: The user requested a "vibrant startup-focused" dark mode aesthetic. I am setting up the CSS variables in `src/app/globals.css`. Please use modern, sleek designs with glassmorphism or sleek borders for your components.
2. **Data Structure**: You will be rendering an `OnboardingPlan` object. Here is the schema we generated in the backend:
   ```typescript
   type OnboardingPlan = {
     welcomeMessage: string;
     buddyName: string;
     buddyReason: string;
     firstWeekGoals: string[];
     agenticTasks: {
       id: string;
       title: string;
       description: string;
       status: "pending" | "completed" | "failed"; // You will animate these turning to "completed"
       type: "email" | "permission" | "calendar" | "document";
     }[];
   }
   ```
3. **Core Features to Build in `new-hire/page.tsx`**:
   - **Hero Section**: A warm welcome using the `welcomeMessage`.
   - **Buddy Card**: Display `buddyName` and `buddyReason`.
   - **Interactive Agentic Tasks**: Create a checklist UI for `agenticTasks`. **Crucial**: Build a fake "execution" simulation. When the page loads, have the tasks show a spinning "pending" state, and progressively check them off as "completed" using `setTimeout` to simulate the AI executing them in real-time.
   - **RAG Chat**: Create a mock chat UI at the bottom right where the user can ask questions (e.g., "What is the WiFi?"). You don't need a real LLM connection for the chat right now, just mock out 2-3 common responses for the demo.

Please run your commands, create `src/app/new-hire/page.tsx`, and let the user know when you are done! Good luck!
