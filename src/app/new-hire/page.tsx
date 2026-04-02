"use client";

import { useState, useEffect, useRef, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import styles from "./new-hire.module.css";

type AgenticTask = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "running" | "completed" | "failed";
  type: "email" | "permission" | "calendar" | "document";
};

type NewHireTask = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "completed";
  type: "document" | "swag" | "profile" | "training" | string;
};

type CustomDoc = {
  title: string;
  type: string;
  url?: string;
};

type OnboardingPlan = {
  welcomeMessage: string;
  buddyName: string;
  buddyReason: string;
  firstWeekGoals: string[];
  agenticTasks: AgenticTask[];
  newHireTasks?: NewHireTask[];
  customDocs?: CustomDoc[];
};

const MOCK_PLAN: OnboardingPlan = {
  welcomeMessage:
    "Welcome to the team, Alex! We're thrilled to have a talented frontend engineer joining us. Your first week is all about getting comfortable, meeting the crew, and shipping your first small win. Let's make it great!",
  buddyName: "Jordan Lee",
  buddyReason:
    "Jordan is a Lead Engineer with a collaborative style that matches your analytical mindset. They'll help you navigate the codebase and team culture.",
  firstWeekGoals: [
    "Complete your dev environment setup and push a test commit",
    "Attend the team standup and introduce yourself",
    "Review the Engineering Handbook and Git Workflow Guide",
    "Have a 1:1 coffee chat with your onboarding buddy",
  ],
  agenticTasks: [
    { id: "task_1", title: "Send Welcome Email", description: "Dispatch personalized welcome email to alex@springboard.io", status: "pending", type: "email" },
    { id: "task_2", title: "Provision GitHub Access", description: "Grant access to GitHub Enterprise org with Engineer role", status: "pending", type: "permission" },
    { id: "task_3", title: "Schedule Orientation Meeting", description: "Book 30-min orientation with manager for April 10, 10:00 AM", status: "pending", type: "calendar" },
    { id: "task_4", title: "Share Onboarding Documents", description: "Send Engineering Handbook and Git Workflow Guide links", status: "pending", type: "document" },
    { id: "task_5", title: "Set Up AWS Dev Sandbox", description: "Provision IAM credentials for AWS development environment", status: "pending", type: "permission" },
  ],
  newHireTasks: [
    { id: "nh_1", title: "Sign Non-Disclosure Agreement", description: "Review and sign the Springboard standard NDA.", status: "pending", type: "document" },
    { id: "nh_2", title: "Pick Your Laptop & Swag", description: "Choose between a Mac or PC, and select your hoodie size.", status: "pending", type: "swag" },
    { id: "nh_3", title: "Upload Profile Picture", description: "Add a photo to your Springboard directory profile.", status: "pending", type: "profile" },
  ],
  customDocs: [
    { title: "Springboard Employee Handbook", type: "pdf", url: "#" },
    { title: "2026 Engineering Roadmap", type: "link", url: "#" },
    { title: "Benefits Overview", type: "pdf", url: "#" },
  ],
};

const TASK_ICONS: Record<string, string> = {
  email: "✉️",
  permission: "🔐",
  calendar: "📅",
  document: "📄",
  swag: "👕",
  profile: "📸",
  training: "🎓"
};

// Keywords that trigger a flagged-question badge (ported from Greg's BoardingPass)
const FLAGGED_KEYWORDS = [
  "salary", "compensation", "executive", "fired", "terminate", "lawsuit",
  "confidential", "stock options", "equity grant", "severance", "nda breach",
];

function isFlagged(text: string): boolean {
  const lower = text.toLowerCase();
  return FLAGGED_KEYWORDS.some((kw) => lower.includes(kw));
}

function NewHireContent() {
  const searchParams = useSearchParams();

  // Parse plan from URL (from manager dispatch) or fall back to mock
  const [plan, setPlan] = useState<OnboardingPlan>(MOCK_PLAN);
  const [employeeName, setEmployeeName] = useState("Alex");

  useEffect(() => {
    const encoded = searchParams.get("plan");
    if (encoded) {
      try {
        const decoded = JSON.parse(atob(decodeURIComponent(encoded)));
        if (decoded.plan) {
          const incoming = decoded.plan;
          setPlan({
            welcomeMessage: incoming.welcomeMessage || MOCK_PLAN.welcomeMessage,
            buddyName: incoming.buddyName || MOCK_PLAN.buddyName,
            buddyReason: incoming.buddyReason || MOCK_PLAN.buddyReason,
            firstWeekGoals: incoming.firstWeekGoals || MOCK_PLAN.firstWeekGoals,
            agenticTasks: incoming.agenticTasks || MOCK_PLAN.agenticTasks,
            customDocs: incoming.customDocs || MOCK_PLAN.customDocs,
            newHireTasks: (incoming.newHireTasks || MOCK_PLAN.newHireTasks).map((t: any) => ({
              ...t,
              status: "pending" as const,
            })),
          });
        }
        if (decoded.employee?.name) {
          setEmployeeName(decoded.employee.name.split(" ")[0]);
        }
      } catch {
        // Fall back to mock on parse error
      }
    }
  }, [searchParams]);

  const [tasks, setTasks] = useState<NewHireTask[]>([]);
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const allDone = tasks.length > 0 && completedCount === tasks.length;

  useEffect(() => {
    setTasks(plan.newHireTasks?.map((t) => ({ ...t, status: "pending" as const })) ?? []);
  }, [plan.newHireTasks]);

  // Streaming AI chat
  const { messages, sendMessage, status } = useChat({
    transport: new TextStreamChatTransport({ api: "/api/chat" }),
    messages: [
      {
        id: "welcome",
        role: "assistant" as const,
        content: `Hi ${employeeName}! I'm your onboarding assistant. Ask me anything \u2014 WiFi password, parking, lunch spots, you name it!`,
        parts: [{ type: "text" as const, text: `Hi ${employeeName}! I'm your onboarding assistant. Ask me anything \u2014 WiFi password, parking, lunch spots, you name it!` }],
        createdAt: new Date(),
      },
    ],
  });

  const chatBusy = status === "submitted" || status === "streaming";
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatBusy]);

  const handleChatSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = chatInput.trim();
    if (!text || chatBusy) return;
    setChatInput("");
    sendMessage({ text });
  };

  const handleStartTask = (taskId: string, title: string) => {
    setChatOpen(true);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: "completed" } : t));
    sendMessage({ text: `I am ready to complete my task: ${title}. Can you help me?` });
  };

  // Pulse check-in state (ported from Greg's BoardingPass)
  const [showPulse, setShowPulse] = useState(false);
  const [pulseSubmitted, setPulseSubmitted] = useState(false);
  const [pulseAnswers, setPulseAnswers] = useState({ q1: "", q2: "", q3: "" });

  const handlePulseSubmit = useCallback(() => {
    setPulseSubmitted(true);
    setTimeout(() => setShowPulse(false), 1500);
  }, []);

  // Track flagged questions count
  const flaggedCount = messages.filter((m) => (m.role as string) === "user" && isFlagged(m.content ?? "")).length;

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <h1>Welcome to Springboard.io</h1>
        <p>{plan.welcomeMessage}</p>
      </section>

      {/* Buddy Card */}
      <section className="glass-panel">
        <div className={styles.buddyLabel}>Your Onboarding Buddy</div>
        <div className={styles.buddyCard}>
          <div className={styles.buddyAvatar}>
            {plan.buddyName.charAt(0)}
          </div>
          <div className={styles.buddyInfo}>
            <h3>{plan.buddyName}</h3>
            <p>{plan.buddyReason}</p>
          </div>
        </div>
      </section>

      {/* First Week Goals */}
      <section className="glass-panel">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon}>{"\uD83C\uDFAF"}</span>
          <h2>First Week Goals</h2>
        </div>
        <div className={styles.goalsGrid}>
          {plan.firstWeekGoals.map((goal, i) => (
            <div key={i} className={styles.goalItem}>
              <div className={styles.goalNumber}>{i + 1}</div>
              <div className={styles.goalText}>{goal}</div>
            </div>
          ))}
        </div>
      </section>

            {/* Provisioned by AI Agents */}
      {plan.agenticTasks && plan.agenticTasks.length > 0 && (
        <section className="glass-panel">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>{"✨"}</span>
            <h2>Provisioned Workspace</h2>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "16px" }}>
            The AI Manager has completed these background setups for you:
          </p>
          <div className={styles.agenticArtifacts}>
            {plan.agenticTasks.map((task) => (
              <div key={task.id} className={styles.artifactCard}>
                <div className={styles.artifactIcon}>{TASK_ICONS[task.type] || "🔹"}</div>
                <div className={styles.artifactBody}>
                  <div className={styles.artifactTitle}>{task.title}</div>
                  {task.type === "email" && <div className={styles.artifactMock}><strong>From:</strong> IT@springboard.io<br/><strong>Subject:</strong> Welcome!</div>}
                  {task.type === "calendar" && <div className={styles.artifactMock}><strong>Date:</strong> April 10, 10:00 AM<br/><strong>Invitees:</strong> You, Manager</div>}
                  {task.type === "permission" && <div className={styles.artifactMock}><span className={styles.grantedBadge}>Access Granted</span></div>}
                  {task.type === "document" && <div className={styles.artifactMock}><span style={{color: "var(--accent-secondary)"}}>Files sent to your inbox</span></div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Your Onboarding Documents */}
      {plan.customDocs && plan.customDocs.length > 0 && (
        <section className="glass-panel">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>{"📁"}</span>
            <h2>Your Documents</h2>
          </div>
          <div className={styles.docsGrid}>
            {plan.customDocs.map((doc, i) => (
              <a key={i} href={doc.url || "#"} className={styles.docCard}>
                <span className={styles.docIcon}>{doc.type === "pdf" ? "📄" : "🔗"}</span>
                <span className={styles.docTitle}>{doc.title}</span>
                <span className={styles.docArrow}>&rarr;</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Interactive Action Checklist */}
      <section className="glass-panel">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon}>{"📋"}</span>
          <h2>
            Your Action Items ({completedCount}/{tasks.length})
          </h2>
        </div>
        <div className={styles.taskList}>
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`${styles.taskRow} ${
                task.status === "completed" ? styles.completed : ""
              }`}
            >
              <div className={styles.taskIcon}>
                {TASK_ICONS[task.type] || "🔹"}
              </div>
              <div className={styles.taskBody}>
                <div className={styles.taskTitle}>{task.title}</div>
                <div className={styles.taskDesc}>{task.description}</div>
              </div>
              <div className={styles.taskStatus}>
                {task.status === "pending" ? (
                  <button 
                    className={styles.chatSend} 
                    style={{ padding: "0.25rem 0.75rem", fontSize: "0.85rem", margin: 0 }}
                    onClick={() => handleStartTask(task.id, task.title)}
                  >
                    Start
                  </button>
                ) : (
                  <>
                    <div className={styles.checkmark}>{"✓"}</div>
                    <span className={`${styles.statusText} ${styles.completed}`}>
                      Done
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Completion Banner */}
        {allDone && tasks.length > 0 && (
          <div className={styles.completionBanner}>
            <span>{"\ud83c\udf89"}</span> Amazing job! You&apos;ve completed all your onboarding tasks, {employeeName}.
          </div>
        )}
      </section>

      {/* Pulse Check-in Prompt (ported from Greg's BoardingPass) */}
      {!showPulse && !pulseSubmitted && (
        <section className="glass-panel" style={{ textAlign: "center" }}>
          <div className={styles.sectionHeader} style={{ justifyContent: "center" }}>
            <span className={styles.sectionIcon}>{"\ud83d\udcca"}</span>
            <h2>Quick Check-in</h2>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "8px 0 16px" }}>
            How are you feeling about your onboarding so far? Your feedback helps us improve.
          </p>
          <button className={styles.pulseBtn} onClick={() => setShowPulse(true)}>
            Start Check-in
          </button>
        </section>
      )}

      {pulseSubmitted && (
        <section className="glass-panel" style={{ textAlign: "center" }}>
          <div className={styles.completionBanner} style={{ margin: 0 }}>
            <span>{"\u2705"}</span> Thanks for your feedback, {employeeName}! Your manager will review it.
          </div>
        </section>
      )}

      {/* Pulse Modal Overlay */}
      {showPulse && (
        <div className={styles.pulseOverlay}>
          <div className={styles.pulseModal}>
            <h3>Quick Check-in</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "16px" }}>Required before continuing — this helps HR improve onboarding.</p>
            <div className={styles.pulseField}>
              <label>What&apos;s still unclear or confusing?</label>
              <textarea value={pulseAnswers.q1} onChange={(e) => setPulseAnswers(p => ({ ...p, q1: e.target.value }))} placeholder="Be honest — this is sent to your manager." rows={2} />
            </div>
            <div className={styles.pulseField}>
              <label>Who haven&apos;t you connected with yet?</label>
              <textarea value={pulseAnswers.q2} onChange={(e) => setPulseAnswers(p => ({ ...p, q2: e.target.value }))} placeholder="e.g. your tech lead, a cross-functional partner..." rows={2} />
            </div>
            <div className={styles.pulseField}>
              <label>What do you need to be more effective?</label>
              <textarea value={pulseAnswers.q3} onChange={(e) => setPulseAnswers(p => ({ ...p, q3: e.target.value }))} placeholder="Tools, access, information, introductions..." rows={2} />
            </div>
            <button className={styles.pulseBtn} onClick={handlePulseSubmit} style={{ width: "100%" }}>Submit Check-in</button>
          </div>
        </div>
      )}

      {/* Chat Toggle */}
      <button
        className={styles.chatToggle}
        onClick={() => setChatOpen(!chatOpen)}
        aria-label="Toggle chat"
      >
        {chatOpen ? "\u2715" : "\uD83D\uDCAC"}
      </button>

      {/* Chat Window */}
      {chatOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            {"\uD83E\uDD16"} Onboarding Assistant
          </div>
          <div className={styles.chatMessages}>
            {messages.map((msg) => {
              const text = msg.parts?.filter((p: any) => p.type === "text").map((p: any) => p.text).join("") ?? msg.content ?? "";
              const flagged = (msg.role as string) === "user" && isFlagged(text);
              return (
                <div
                  key={msg.id}
                  className={`${styles.chatBubble} ${
                    (msg.role as string) === "user" ? styles.user : styles.bot
                  }`}
                >
                  {text}
                  {flagged && <span className={styles.flagBadge} title="This question was flagged for HR review">{"\u26a0\ufe0f"} Flagged</span>}
                </div>
              );
            })}
            {flaggedCount > 0 && (
              <div className={styles.flagNotice}>
                {"\ud83d\udea9"} {flaggedCount} question{flaggedCount > 1 ? "s" : ""} flagged for HR review
              </div>
            )}
            {status === "submitted" && (
              <div className={`${styles.chatBubble} ${styles.bot}`}>
                <div className={styles.typingDots}>
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form className={styles.chatInputRow} onSubmit={handleChatSubmit}>
            <input
              className={styles.chatInput}
              placeholder="Ask about WiFi, parking, lunch..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button className={styles.chatSend} type="submit" disabled={chatBusy}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function NewHirePage() {
  return (
    <main className="container">
      <Suspense fallback={<div className={styles.page}><section className={styles.hero}><h1>Loading your onboarding...</h1></section></div>}>
        <NewHireContent />
      </Suspense>
    </main>
  );
}
