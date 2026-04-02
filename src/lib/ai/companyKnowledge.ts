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
  },
  {
    topic: "vacation_policy",
    keywords: ["vacation", "paid vacation", "accrued", "rollover", "time off policy", "pto policy"],
    answer: "All full-time employees receive 15 days paid vacation annually, accrued at 1.25 days per month. Requests must be submitted 2 weeks in advance via the HR portal. Up to 5 unused days roll over to the following year. Source: Employee Handbook"
  },
  {
    topic: "expenses",
    keywords: ["expense", "expensify", "receipt", "reimbursement", "reimburse"],
    answer: "All work expenses must be submitted within 30 days via Expensify. Expenses over $500 require manager pre-approval. Receipts required for amounts over $25. Software subscriptions need department head approval. Source: Employee Handbook"
  },
  {
    topic: "remote_work",
    keywords: ["remote", "work from home", "wfh", "hybrid", "in office"],
    answer: "Employees may work remotely up to 3 days per week with manager approval. Full remote is available for remote-eligible roles (check your offer letter). Core collaboration hours are 10am-3pm in your local timezone. Source: Employee Handbook"
  },
  {
    topic: "performance_reviews",
    keywords: ["review", "performance", "promotion", "evaluation", "check-in"],
    answer: "Performance reviews occur every 6 months (June and December). New hires receive special check-ins at 30, 60, and 90 days with their manager. Promotion decisions are made annually in December. Source: Employee Handbook"
  },
  {
    topic: "laptop_setup",
    keywords: ["laptop", "computer", "setup", "machine", "macbook", "it setup"],
    answer: "Your laptop will be ready on your first day. Standard setup: macOS/Windows depending on your role, with pre-installed dev tools. For issues, contact IT at it@springboard.io or through the #it-help Slack channel. Source: IT Guide"
  },
  {
    topic: "git_workflow",
    keywords: ["git", "github", "branch", "pull request", "pr", "code review", "merge"],
    answer: "We use GitHub Enterprise with a trunk-based workflow. Create feature branches from main, open PRs with at least 1 reviewer, and squash-merge when approved. CI/CD runs automatically on every PR. Source: Engineering Onboarding"
  },
  {
    topic: "code_of_conduct",
    keywords: ["conduct", "ethics", "harassment", "discrimination", "respect"],
    answer: "Treat all colleagues with respect regardless of role or seniority. Discrimination or harassment of any kind results in immediate review. Concerns can be raised with your manager or confidentially at ethics@springboard.io. Source: Employee Handbook"
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
