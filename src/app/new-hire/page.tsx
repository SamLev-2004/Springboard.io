"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./new-hire.module.css";

type AgenticTask = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "completed" | "failed";
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
    {
      id: "task_1",
      title: "Send Welcome Email",
      description: "Dispatch personalized welcome email to alex@springboard.io",
      status: "pending",
      type: "email",
    },
    {
      id: "task_2",
      title: "Provision GitHub Access",
      description: "Grant access to GitHub Enterprise org with Engineer role",
      status: "pending",
      type: "permission",
    },
    {
      id: "task_3",
      title: "Schedule Orientation Meeting",
      description: "Book 30-min orientation with manager for April 10, 10:00 AM",
      status: "pending",
      type: "calendar",
    },
    {
      id: "task_4",
      title: "Share Onboarding Documents",
      description: "Send Engineering Handbook and Git Workflow Guide links",
      status: "pending",
      type: "document",
    },
    {
      id: "task_5",
      title: "Set Up AWS Dev Sandbox",
      description: "Provision IAM credentials for AWS development environment",
      status: "pending",
      type: "permission",
    },
  ],
};

const TASK_ICONS: Record<AgenticTask["type"], string> = {
  email: "\u2709\uFE0F",
  permission: "\uD83D\uDD10",
  calendar: "\uD83D\uDCC5",
  document: "\uD83D\uDCC4",
};

type ChatMessage = { role: "user" | "bot"; text: string };

const MOCK_RESPONSES: Record<string, string> = {
  wifi: "The office WiFi network is \"Springboard-5G\". Password: Launch2026! For VPN access, check the IT Setup Guide in your onboarding docs.",
  parking:
    "We have free parking in Lot B behind the building. Just register your plate at reception on your first day.",
  lunch:
    "The team usually grabs lunch around 12:30. There's a great taco place across the street, and the office kitchen is stocked with snacks and drinks.",
  dress:
    "We're pretty casual! Most folks wear jeans and a t-shirt. No formal dress code unless there's a client meeting.",
  slack:
    "You'll be added to #engineering, #general, and #watercooler on Slack. Your buddy Jordan will send you an invite if you don't have it by day one.",
};

function matchResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [keyword, response] of Object.entries(MOCK_RESPONSES)) {
    if (lower.includes(keyword)) return response;
  }
  return "Great question! I'll flag that for your onboarding buddy Jordan to answer. In the meantime, check the Engineering Handbook for general info.";
}

export default function NewHirePage() {
  const [tasks, setTasks] = useState<AgenticTask[]>(
    MOCK_PLAN.agenticTasks.map((t) => ({ ...t }))
  );
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: "Hi Alex! I'm your onboarding assistant. Ask me anything — WiFi password, parking, lunch spots, you name it!",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulate agentic task execution
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    tasks.forEach((_, i) => {
      const delay = 1500 + i * 2000 + Math.random() * 800;
      timers.push(
        setTimeout(() => {
          setTasks((prev) =>
            prev.map((t, idx) =>
              idx === i ? { ...t, status: "completed" as const } : t
            )
          );
        }, delay)
      );
    });
    return () => timers.forEach(clearTimeout);
    // Run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = () => {
    const text = chatInput.trim();
    if (!text) return;
    setChatInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { role: "bot", text: matchResponse(text) }]);
    }, 1000 + Math.random() * 500);
  };

  const completedCount = tasks.filter((t) => t.status === "completed").length;

  return (
    <main className="container">
      <div className={styles.page}>
        {/* Hero */}
        <section className={styles.hero}>
          <h1>Welcome to Springboard.io</h1>
          <p>{MOCK_PLAN.welcomeMessage}</p>
        </section>

        {/* Buddy Card */}
        <section className="glass-panel">
          <div className={styles.buddyLabel}>Your Onboarding Buddy</div>
          <div className={styles.buddyCard}>
            <div className={styles.buddyAvatar}>
              {MOCK_PLAN.buddyName.charAt(0)}
            </div>
            <div className={styles.buddyInfo}>
              <h3>{MOCK_PLAN.buddyName}</h3>
              <p>{MOCK_PLAN.buddyReason}</p>
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
            {MOCK_PLAN.firstWeekGoals.map((goal, i) => (
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
                } ${task.status === "failed" ? styles.failed : ""}`}
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
                    <>
                      <div className={styles.spinner} />
                      <span className={`${styles.statusText} ${styles.pending}`}>
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
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`${styles.chatBubble} ${
                    msg.role === "user" ? styles.user : styles.bot
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {typing && (
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
            <div className={styles.chatInputRow}>
              <input
                className={styles.chatInput}
                placeholder="Ask about WiFi, parking, lunch..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button className={styles.chatSend} onClick={handleSend}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
