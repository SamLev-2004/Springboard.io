"use client";

import { useState, useEffect, useRef, Suspense } from "react";
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

type OnboardingPlan = {
  welcomeMessage: string;
  buddyName: string;
  buddyReason: string;
  firstWeekGoals: string[];
  agenticTasks: AgenticTask[];
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
};

const TASK_ICONS: Record<AgenticTask["type"], string> = {
  email: "\u2709\uFE0F",
  permission: "\uD83D\uDD10",
  calendar: "\uD83D\uDCC5",
  document: "\uD83D\uDCC4",
};

const RUNNING_MESSAGES: Record<AgenticTask["type"], string[]> = {
  email: ["Connecting to email service...", "Drafting personalized email...", "Sending email..."],
  permission: ["Authenticating with API...", "Provisioning access credentials...", "Verifying permissions..."],
  calendar: ["Checking calendar availability...", "Booking time slot...", "Sending calendar invite..."],
  document: ["Locating documents...", "Generating share links...", "Dispatching document package..."],
};

type LogEntry = { time: string; text: string };

function getTimestamp(): string {
  return new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
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
            agenticTasks: (incoming.agenticTasks || MOCK_PLAN.agenticTasks).map((t: any) => ({
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

  const [tasks, setTasks] = useState<AgenticTask[]>([]);
  const [activityLog, setActivityLog] = useState<LogEntry[]>([]);
  const [allDone, setAllDone] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false);

  // Initialize tasks from plan
  useEffect(() => {
    setTasks(plan.agenticTasks.map((t) => ({ ...t, status: "pending" as const })));
    setActivityLog([]);
    setAllDone(false);
    hasStartedRef.current = false;
  }, [plan]);

  // Agentic task execution simulation: pending → running → completed, one at a time
  useEffect(() => {
    if (tasks.length === 0 || hasStartedRef.current) return;
    hasStartedRef.current = true;

    const addLog = (text: string) => {
      setActivityLog((prev) => [...prev, { time: getTimestamp(), text }]);
    };

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const runTask = (index: number) => {
      if (cancelled || index >= tasks.length) return;
      const task = tasks[index];
      const msgs = RUNNING_MESSAGES[task.type];

      // Set to running
      timers.push(setTimeout(() => {
        if (cancelled) return;
        setTasks((prev) => prev.map((t, i) => i === index ? { ...t, status: "running" as const } : t));
        addLog(`Agent starting: ${task.title}`);
      }, 0));

      // Show running messages
      msgs.forEach((msg, mi) => {
        timers.push(setTimeout(() => {
          if (cancelled) return;
          addLog(msg);
        }, 800 + mi * 900));
      });

      // Complete
      const completeDelay = 800 + msgs.length * 900 + 600;
      timers.push(setTimeout(() => {
        if (cancelled) return;
        setTasks((prev) => prev.map((t, i) => i === index ? { ...t, status: "completed" as const } : t));
        addLog(`\u2713 ${task.title} completed`);

        if (index + 1 < tasks.length) {
          timers.push(setTimeout(() => runTask(index + 1), 400));
        } else {
          timers.push(setTimeout(() => {
            if (!cancelled) {
              addLog("\uD83C\uDF89 All onboarding tasks completed!");
              setAllDone(true);
            }
          }, 600));
        }
      }, completeDelay));
    };

    // Initial delay before first task
    timers.push(setTimeout(() => {
      addLog("Initializing onboarding agent pipeline...");
      timers.push(setTimeout(() => runTask(0), 800));
    }, 1000));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks.length]);

  // Auto-scroll activity log
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activityLog]);

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

  const completedCount = tasks.filter((t) => t.status === "completed").length;

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

      {/* Agentic Tasks */}
      <section className="glass-panel">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionIcon}>{"\u26A1"}</span>
          <h2>
            AI Agent Tasks ({completedCount}/{tasks.length})
          </h2>
        </div>
        <div className={styles.taskList}>
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`${styles.taskRow} ${
                task.status === "completed" ? styles.completed : ""
              } ${task.status === "running" ? styles.running : ""} ${
                task.status === "failed" ? styles.failed : ""
              }`}
            >
              <div className={styles.taskIcon}>
                {TASK_ICONS[task.type]}
              </div>
              <div className={styles.taskBody}>
                <div className={styles.taskTitle}>{task.title}</div>
                <div className={styles.taskDesc}>{task.description}</div>
              </div>
              <div className={styles.taskStatus}>
                {task.status === "pending" && (
                  <span className={`${styles.statusText} ${styles.pending}`}>
                    Queued
                  </span>
                )}
                {task.status === "running" && (
                  <>
                    <div className={styles.spinner} />
                    <span className={`${styles.statusText} ${styles.runningText}`}>
                      Running...
                    </span>
                  </>
                )}
                {task.status === "completed" && (
                  <>
                    <div className={styles.checkmark}>{"\u2713"}</div>
                    <span className={`${styles.statusText} ${styles.completed}`}>
                      Done
                    </span>
                  </>
                )}
                {task.status === "failed" && (
                  <span className={`${styles.statusText} ${styles.failed}`}>
                    Failed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Activity Log */}
        {activityLog.length > 0 && (
          <div className={styles.activityLog}>
            <div className={styles.logHeader}>Agent Activity Log</div>
            <div className={styles.logScroll}>
              {activityLog.map((entry, i) => (
                <div key={i} className={styles.logEntry}>
                  <span className={styles.logTime}>[{entry.time}]</span> {entry.text}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        )}

        {/* Completion Banner */}
        {allDone && (
          <div className={styles.completionBanner}>
            <span>{"\uD83C\uDF89"}</span> All systems ready! Your onboarding is complete, {employeeName}.
          </div>
        )}
      </section>

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
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.chatBubble} ${
                  (msg.role as string) === "user" ? styles.user : styles.bot
                }`}
              >
                {msg.parts?.filter((p: any) => p.type === "text").map((p: any, i: number) => <span key={i}>{p.text}</span>) ?? msg.content}
              </div>
            ))}
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
