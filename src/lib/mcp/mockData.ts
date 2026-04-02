export interface EmployeeProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  location: string;
  startDate: string;
  personalityType: string;
}

export const MOCK_PROFILES: EmployeeProfile[] = [
  {
    id: "emp_101",
    name: "Alex Johnson",
    role: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Remote (US)",
    startDate: "2026-04-10",
    personalityType: "Analytical & Collaborative"
  },
  {
    id: "emp_102",
    name: "Samira Patel",
    role: "Product Marketing Manager",
    department: "Marketing",
    location: "New York Hub",
    startDate: "2026-04-15",
    personalityType: "Creative & Extroverted"
  }
];

export interface RoleTemplate {
  roleKeyword: string;
  softwareAccess: string[];
  documents: { title: string; url: string }[];
  defaultBuddyTypeMatch: string;
}

export const ROLE_TEMPLATES: RoleTemplate[] = [
  {
    roleKeyword: "Engineer",
    softwareAccess: ["GitHub Enterprise", "AWS Dev Sandbox", "Jira", "Vercel"],
    documents: [
      { title: "Engineering Handbook", url: "#" },
      { title: "Git Workflow Guide", url: "#" }
    ],
    defaultBuddyTypeMatch: "Analytical"
  },
  {
    roleKeyword: "Marketing",
    softwareAccess: ["Figma", "HubSpot", "Google Analytics", "Notion"],
    documents: [
      { title: "Brand Guidelines 2026", url: "#" },
      { title: "Q3 Campaign Overview", url: "#" }
    ],
    defaultBuddyTypeMatch: "Creative"
  }
];

export interface HRNotes {
  applicationDate: string;
  resumeHighlights: string;
  interviewNotes: string;
  offerDetails: string;
  specialRequirements: string;
}

export const MOCK_HR_NOTES: Record<string, HRNotes> = {
  emp_101: {
    applicationDate: "2026-03-15",
    resumeHighlights: "5 years React/Next.js, led design system at previous company, strong open-source contributions",
    interviewNotes: "Excellent system design skills. Collaborative in pair programming exercise. Strong culture fit.",
    offerDetails: "Senior Frontend Engineer, $165K base + equity, remote US",
    specialRequirements: "Ergonomic keyboard setup requested",
  },
  emp_102: {
    applicationDate: "2026-03-20",
    resumeHighlights: "7 years B2B SaaS marketing, grew pipeline 3x at previous company, HubSpot certified",
    interviewNotes: "Creative thinker with strong analytical backing. Great presentation in case study round.",
    offerDetails: "Product Marketing Manager, $140K base + equity, New York Hub",
    specialRequirements: "Starting on a Tuesday due to relocation",
  },
};

export const MOCK_BUDDIES = [
  { name: "Jordan Lee", role: "Lead Engineer", personalityType: "Analytical", email: "jlee@springboard.io" },
  { name: "Taylor Swift", role: "Marketing Director", personalityType: "Creative", email: "tswift@springboard.io" },
  { name: "Casey Smith", role: "Product Manager", personalityType: "Collaborative", email: "csmith@springboard.io" }
];
