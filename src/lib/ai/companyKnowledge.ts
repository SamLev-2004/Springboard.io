// Company knowledge base for RAG-powered chat
// This simulates documents that would be pulled from a vector store

export const COMPANY_KNOWLEDGE = [
  {
    topic: "wifi",
    keywords: ["wifi", "wi-fi", "internet", "network", "password"],
    answer: "Our office WiFi network is 'Springboard-5G'. The password is 'Launch2026!'. For VPN access, download GlobalProtect from the IT portal at it.springboard.io and use your SSO credentials."
  },
  {
    topic: "parking",
    keywords: ["parking", "park", "garage", "lot", "car"],
    answer: "We have reserved parking in the underground garage at Level B2. Your badge will be activated on your first day. Visitor spots are on Level B1. If you bike, there's secure bike storage near the east entrance."
  },
  {
    topic: "lunch",
    keywords: ["lunch", "food", "eat", "cafeteria", "kitchen", "snacks", "coffee"],
    answer: "The kitchen is on Floor 2 and is stocked with free snacks, coffee (La Marzocca espresso!), and sparkling water. We cater lunch every Wednesday (Taco Wednesdays 🌮). There's also a $15/day DoorDash credit for your first month!"
  },
  {
    topic: "dress_code",
    keywords: ["dress", "code", "wear", "clothes", "attire", "outfit"],
    answer: "We're a casual workplace — jeans, sneakers, and t-shirts are totally fine. For client-facing meetings, smart casual is appreciated. No suits required unless you want to look extra sharp!"
  },
  {
    topic: "tools",
    keywords: ["tools", "software", "apps", "slack", "email", "calendar", "setup"],
    answer: "We use Slack for chat, Google Workspace for email/calendar/docs, Linear for project tracking, and Figma for design. Your IT onboarding agent has already provisioned your accounts — check your email for login instructions!"
  },
  {
    topic: "pto",
    keywords: ["pto", "vacation", "time off", "holiday", "sick", "leave", "days off"],
    answer: "We offer unlimited PTO with a 2-week minimum encouraged per year. Just coordinate with your manager at least 2 weeks in advance. Sick days are separate and unlimited — we trust you to take care of yourself."
  },
  {
    topic: "buddy",
    keywords: ["buddy", "mentor", "buddy system", "onboarding buddy", "help", "who"],
    answer: "Your onboarding buddy was matched based on your personality profile and role. They'll reach out on Slack within your first hour! They're your go-to for questions during your first 90 days."
  },
  {
    topic: "first_day",
    keywords: ["first day", "monday", "start", "arrive", "when", "what time", "schedule"],
    answer: "Arrive by 9:30 AM. Head to the lobby and your buddy will meet you. The morning is orientation (badge, desk setup, IT). Lunch is with the team. Afternoon is your first 1:1 with your manager. You'll be home by 5 PM!"
  },
  {
    topic: "benefits",
    keywords: ["benefits", "health", "insurance", "dental", "401k", "equity", "stock"],
    answer: "Benefits kick in Day 1: medical/dental/vision via Aetna, 4% 401k match, equity refreshers annually. Enroll through Rippling (rippling.com) — HR will send you the link on your start date."
  },
  {
    topic: "culture",
    keywords: ["culture", "values", "team", "vibe", "company", "mission"],
    answer: "Our core values: Ship Fast, Stay Curious, Lift Each Other. We do weekly all-hands on Fridays, monthly team outings, and quarterly hackathons. The vibe is high-energy but low-ego. Welcome to the team! 🎉"
  }
];

export function findRelevantKnowledge(query: string): string | null {
  const lowerQuery = query.toLowerCase();
  
  // Score each topic by keyword matches
  let bestMatch: { topic: string; answer: string; score: number } | null = null;
  
  for (const entry of COMPANY_KNOWLEDGE) {
    const score = entry.keywords.reduce((acc, keyword) => {
      return acc + (lowerQuery.includes(keyword) ? 1 : 0);
    }, 0);
    
    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { topic: entry.topic, answer: entry.answer, score };
    }
  }
  
  return bestMatch?.answer || null;
}
