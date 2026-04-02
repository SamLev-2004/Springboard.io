"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "./manager.module.css";
import { MOCK_PROFILES, MOCK_BUDDIES, ROLE_TEMPLATES, MOCK_HR_NOTES } from "@/lib/mcp/mockData";

type AgenticTask = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "completed" | "failed";
  type: "email" | "permission" | "calendar" | "document";
};

type NewHireTask = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "completed";
  type: "document" | "swag" | "profile" | "training";
};

type Plan = {
  welcomeMessage: string;
  buddyName: string;
  buddyReason: string;
  firstWeekGoals: string[];
  agenticTasks: AgenticTask[];
  newHireTasks?: NewHireTask[];
};

type CustomDoc = { title: string; url: string };

export default function ManagerDashboard() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(MOCK_PROFILES[0].id);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [employee, setEmployee] = useState<any>(null);
  const [dispatched, setDispatched] = useState(false);
  const [addingTask, setAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", type: "email" as AgenticTask["type"] });
  const [customDocs, setCustomDocs] = useState<CustomDoc[]>([]);
  const [agentRunning, setAgentRunning] = useState(false);
  const [executingTaskIndex, setExecutingTaskIndex] = useState(-1);
  const [executionLog, setExecutionLog] = useState<string[]>([]);
  const [agentsDone, setAgentsDone] = useState(false);
  const [dispatchPayload, setDispatchPayload] = useState("");

  // Derived data for the overview panel
  const selectedEmployee = useMemo(
    () => MOCK_PROFILES.find((p) => p.id === selectedId)!,
    [selectedId]
  );
  const roleTemplate = useMemo(
    () =>
      ROLE_TEMPLATES.find((t) =>
        selectedEmployee.role.toLowerCase().includes(t.roleKeyword.toLowerCase())
      ) || ROLE_TEMPLATES[0],
    [selectedEmployee]
  );
  const hrNotes = MOCK_HR_NOTES[selectedId];

  // Pre-fill docs from role template when employee changes
  const handleEmployeeChange = (id: string) => {
    setSelectedId(id);
    setPlan(null);
    setDispatched(false);
    const emp = MOCK_PROFILES.find((p) => p.id === id)!;
    const template =
      ROLE_TEMPLATES.find((t) => emp.role.toLowerCase().includes(t.roleKeyword.toLowerCase())) ||
      ROLE_TEMPLATES[0];
    setCustomDocs(template.documents.map((d) => ({ ...d })));
  };

  // Initialize docs on first render
  useState(() => {
    setCustomDocs(roleTemplate.documents.map((d) => ({ ...d })));
  });

  const handleGenerate = async () => {
    setLoading(true);
    setPlan(null);
    setDispatched(false);
    try {
      const res = await fetch("/api/onboarding/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: selectedId }),
      });
      const data = await res.json();
      if (res.ok) {
        setPlan(data.plan);
        setEmployee(data.employee);
      } else {
        alert("Error: " + data.error);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to generate plan.");
    } finally {
      setLoading(false);
    }
  };

  const handleDispatch = () => {
    if (!plan) return;
    const planWithDocs = { ...plan, customDocs: customDocs.map((d) => ({ ...d, type: d.url?.endsWith(".pdf") ? "pdf" : "link" })) };
    const jsonStr = JSON.stringify({ plan: planWithDocs, employee, customDocs });
    // Unicode-safe base64 encoding (btoa can't handle emojis/non-Latin1)
    const payload = btoa(unescape(encodeURIComponent(jsonStr)));
    setDispatchPayload(payload);
    setDispatched(true);
    setAgentRunning(true);
    setExecutionLog(["Initializing agentic pipeline..."]);
    setExecutingTaskIndex(0);

    // Simulate each task completing sequentially
    const tasks = plan.agenticTasks;
    let idx = 0;

    const runNextTask = () => {
      if (idx >= tasks.length) {
        setTimeout(() => {
          setExecutionLog((prev) => [...prev, "🎉 All agents completed successfully!"]);
          setAgentRunning(false);
          setAgentsDone(true);
          // Mark all tasks as completed in the plan
          setPlan((prev) => prev && {
            ...prev,
            agenticTasks: prev.agenticTasks.map((t) => ({ ...t, status: "completed" as const })),
          });
        }, 600);
        return;
      }

      const task = tasks[idx];
      const currentIdx = idx;

      // "Running" log
      setTimeout(() => {
        setExecutingTaskIndex(currentIdx);
        setExecutionLog((prev) => [...prev, `⚡ Agent executing: ${task.title}...`]);
      }, 0);

      // "Detail" log
      setTimeout(() => {
        setExecutionLog((prev) => [...prev, `   → ${task.description}`]);
      }, 800);

      // "Done" log + mark complete
      setTimeout(() => {
        setExecutionLog((prev) => [...prev, `✓ ${task.title} — completed`]);
        setPlan((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            agenticTasks: prev.agenticTasks.map((t, i) =>
              i === currentIdx ? { ...t, status: "completed" as const } : t
            ),
          };
        });
        idx++;
        runNextTask();
      }, 1600);
    };

    setTimeout(() => runNextTask(), 800);
  };

  const handleGoToPortal = () => {
    router.push(`/new-hire?plan=${encodeURIComponent(dispatchPayload)}`);
  };

  // Plan field updaters
  const updateField = <K extends keyof Plan>(key: K, value: Plan[K]) => {
    setPlan((prev) => prev && { ...prev, [key]: value });
  };

  const updateGoal = (index: number, value: string) => {
    setPlan((prev) => {
      if (!prev) return prev;
      const goals = [...prev.firstWeekGoals];
      goals[index] = value;
      return { ...prev, firstWeekGoals: goals };
    });
  };

  const removeGoal = (index: number) => {
    setPlan((prev) => {
      if (!prev || prev.firstWeekGoals.length <= 1) return prev;
      return { ...prev, firstWeekGoals: prev.firstWeekGoals.filter((_, i) => i !== index) };
    });
  };

  const addGoal = () => {
    setPlan((prev) => prev && { ...prev, firstWeekGoals: [...prev.firstWeekGoals, ""] });
  };

  const updateTask = (id: string, field: "title" | "description", value: string) => {
    setPlan((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        agenticTasks: prev.agenticTasks.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
      };
    });
  };

  const removeTask = (id: string) => {
    setPlan((prev) => prev && { ...prev, agenticTasks: prev.agenticTasks.filter((t) => t.id !== id) });
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    const task: AgenticTask = {
      id: `task_${Date.now()}`,
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      status: "pending",
      type: newTask.type,
    };
    setPlan((prev) => prev && { ...prev, agenticTasks: [...prev.agenticTasks, task] });
    setNewTask({ title: "", description: "", type: "email" });
    setAddingTask(false);
  };

  const handleBuddyChange = (buddyName: string) => {
    const buddy = MOCK_BUDDIES.find((b) => b.name === buddyName);
    if (!buddy) return;
    setPlan((prev) =>
      prev && {
        ...prev,
        buddyName: buddy.name,
        buddyReason: `${buddy.name} is a ${buddy.role} with a ${buddy.personalityType.toLowerCase()} personality \u2014 a great match for guiding the new hire.`,
      }
    );
  };

  // Custom docs handlers
  const updateDoc = (index: number, field: "title" | "url", value: string) => {
    setCustomDocs((prev) => prev.map((d, i) => (i === index ? { ...d, [field]: value } : d)));
  };

  const removeDoc = (index: number) => {
    setCustomDocs((prev) => prev.filter((_, i) => i !== index));
  };

  const addDoc = () => {
    setCustomDocs((prev) => [...prev, { title: "", url: "" }]);
  };

  return (
    <main className="container">
      <div className={styles.managerContainer}>
        <div>
          <h1>HR / Manager Dashboard</h1>
          <p style={{ color: "var(--text-muted)", marginTop: "10px" }}>
            Human-in-the-loop (HIL) oversight for AI agentic onboarding.
          </p>
        </div>

        {/* Step 1: Employee Selection */}
        <div className="glass-panel">
          <h3>1. Select New Hire</h3>
          <div className={styles.profileSelector} style={{ marginTop: "15px" }}>
            <select
              className={styles.selectInput}
              value={selectedId}
              onChange={(e) => handleEmployeeChange(e.target.value)}
            >
              {MOCK_PROFILES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} - {p.role}
                </option>
              ))}
            </select>
          </div>

          {/* Employee Overview Panel */}
          <div className={styles.overviewPanel}>
            <div className={styles.overviewGrid}>
              {/* Profile Summary */}
              <div className={styles.overviewCard}>
                <div className={styles.overviewCardLabel}>Profile Summary</div>
                <div className={styles.profileMeta}>
                  <div className={styles.profileAvatar}>{selectedEmployee.name.charAt(0)}</div>
                  <div>
                    <div className={styles.profileName}>{selectedEmployee.name}</div>
                    <div className={styles.profileRole}>{selectedEmployee.role}</div>
                  </div>
                </div>
                <div className={styles.metaGrid}>
                  <div><span className={styles.metaLabel}>Department</span>{selectedEmployee.department}</div>
                  <div><span className={styles.metaLabel}>Location</span>{selectedEmployee.location}</div>
                  <div><span className={styles.metaLabel}>Start Date</span>{selectedEmployee.startDate}</div>
                  <div><span className={styles.metaLabel}>Personality</span>{selectedEmployee.personalityType}</div>
                </div>
              </div>

              {/* Role Template */}
              <div className={styles.overviewCard}>
                <div className={styles.overviewCardLabel}>Role Requirements</div>
                <div className={styles.metaSection}>
                  <span className={styles.metaLabel}>Software Access Needed</span>
                  <div className={styles.badgeList}>
                    {roleTemplate.softwareAccess.map((s) => (
                      <span key={s} className={styles.badge}>{s}</span>
                    ))}
                  </div>
                </div>
                <div className={styles.metaSection}>
                  <span className={styles.metaLabel}>Key Documents</span>
                  <div className={styles.badgeList}>
                    {roleTemplate.documents.map((d) => (
                      <span key={d.title} className={styles.badgeDoc}>{d.title}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* HR Notes */}
            {hrNotes && (
              <div className={styles.overviewCard} style={{ marginTop: "16px" }}>
                <div className={styles.overviewCardLabel}>HR & Application Notes</div>
                <div className={styles.metaGrid}>
                  <div><span className={styles.metaLabel}>Applied</span>{hrNotes.applicationDate}</div>
                  <div><span className={styles.metaLabel}>Offer</span>{hrNotes.offerDetails}</div>
                </div>
                <div className={styles.noteBlock}>
                  <span className={styles.metaLabel}>Resume Highlights</span>
                  <p>{hrNotes.resumeHighlights}</p>
                </div>
                <div className={styles.noteBlock}>
                  <span className={styles.metaLabel}>Interview Notes</span>
                  <p>{hrNotes.interviewNotes}</p>
                </div>
                {hrNotes.specialRequirements && (
                  <div className={styles.noteBlock}>
                    <span className={styles.metaLabel}>Special Requirements</span>
                    <p className={styles.specialReq}>{hrNotes.specialRequirements}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Custom Documents */}
        <div className="glass-panel">
          <div className={styles.sectionHeaderRow}>
            <h3>2. Onboarding Documents</h3>
            <button className={styles.addBtn} onClick={addDoc}>+ Add Document</button>
          </div>
          <p className={styles.editHint}>Pre-filled from role template. Add, edit, or remove as needed.</p>
          <div className={styles.docList}>
            {customDocs.map((doc, i) => (
              <div key={i} className={styles.docRow}>
                <input
                  className={styles.editInput}
                  value={doc.title}
                  onChange={(e) => updateDoc(i, "title", e.target.value)}
                  placeholder="Document title"
                  style={{ flex: 2 }}
                />
                <input
                  className={styles.editInput}
                  value={doc.url}
                  onChange={(e) => updateDoc(i, "url", e.target.value)}
                  placeholder="URL or link"
                  style={{ flex: 3 }}
                />
                <button className={styles.removeBtn} onClick={() => removeDoc(i)} title="Remove document">
                  &times;
                </button>
              </div>
            ))}
            {customDocs.length === 0 && (
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontStyle: "italic" }}>
                No documents attached. Click &quot;+ Add Document&quot; to include resources.
              </p>
            )}
          </div>
        </div>

        {/* Step 3: Generate */}
        <div className="glass-panel" style={{ textAlign: "center" }}>
          <h3>3. Generate AI Onboarding Plan</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "10px 0 20px" }}>
            AI will create a personalized plan based on the profile, role requirements, and HR context above.
          </p>
          <button className="btn" onClick={handleGenerate} disabled={loading} style={{ fontSize: "1.05rem", padding: "14px 32px" }}>
            {loading ? "Generating with Gemini..." : "Generate AI Plan"}
          </button>
        </div>

        {/* Step 4: Review & Edit Plan */}
        {plan && (
          <div className={`glass-panel ${styles.onboardingPlan}`}>
            <h2>4. Review & Edit Plan for {employee?.name}</h2>
            <p className={styles.editHint}>All fields are editable. Adjust the plan before dispatching.</p>

            {/* Welcome Message */}
            <div className={styles.section}>
              <h4>Welcome Message Draft</h4>
              <textarea
                className={styles.editTextarea}
                value={plan.welcomeMessage}
                onChange={(e) => updateField("welcomeMessage", e.target.value)}
                rows={3}
              />
            </div>

            {/* Buddy + Goals side by side */}
            <div className={styles.twoCol}>
              <div className={styles.section}>
                <h4>Assigned Buddy</h4>
                <select
                  className={styles.selectInput}
                  value={plan.buddyName}
                  onChange={(e) => handleBuddyChange(e.target.value)}
                >
                  {MOCK_BUDDIES.map((b) => (
                    <option key={b.name} value={b.name}>
                      {b.name} \u2014 {b.role}
                    </option>
                  ))}
                </select>
                <textarea
                  className={styles.editTextarea}
                  value={plan.buddyReason}
                  onChange={(e) => updateField("buddyReason", e.target.value)}
                  rows={2}
                  style={{ marginTop: "8px" }}
                />
              </div>

              <div className={styles.section}>
                <h4>First Week Goals</h4>
                <div className={styles.goalList}>
                  {plan.firstWeekGoals.map((g, i) => (
                    <div key={i} className={styles.goalRow}>
                      <input
                        className={styles.editInput}
                        value={g}
                        onChange={(e) => updateGoal(i, e.target.value)}
                        placeholder="Enter a goal..."
                      />
                      {plan.firstWeekGoals.length > 1 && (
                        <button className={styles.removeBtn} onClick={() => removeGoal(i)} title="Remove goal">
                          &times;
                        </button>
                      )}
                    </div>
                  ))}
                  <button className={styles.addBtn} onClick={addGoal}>+ Add Goal</button>
                </div>
              </div>
            </div>

            {/* Agentic Tasks */}
            <div className={styles.section}>
              <div className={styles.sectionHeaderRow}>
                <h4>Agentic Tasks to Execute</h4>
                <button className={styles.addBtn} onClick={() => setAddingTask(true)}>+ Add Task</button>
              </div>

              {addingTask && (
                <div className={styles.addTaskForm}>
                  <select
                    className={styles.selectInput}
                    value={newTask.type}
                    onChange={(e) => setNewTask({ ...newTask, type: e.target.value as AgenticTask["type"] })}
                  >
                    <option value="email">Email</option>
                    <option value="permission">Permission</option>
                    <option value="calendar">Calendar</option>
                    <option value="document">Document</option>
                  </select>
                  <input
                    className={styles.editInput}
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                  <input
                    className={styles.editInput}
                    placeholder="Task description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                  <div className={styles.addTaskActions}>
                    <button className="btn" onClick={handleAddTask} style={{ padding: "8px 16px", fontSize: "0.85rem" }}>Add</button>
                    <button className="btn btn-secondary" onClick={() => setAddingTask(false)} style={{ padding: "8px 16px", fontSize: "0.85rem" }}>Cancel</button>
                  </div>
                </div>
              )}

              <div className={styles.agenticTasks}>
                {plan.agenticTasks.map((task) => (
                  <div key={task.id} className={styles.taskCard}>
                    <div className={styles.taskCardHeader}>
                      <span className={styles.taskType}>{task.type}</span>
                      <button className={styles.removeBtn} onClick={() => removeTask(task.id)} title="Remove task">&times;</button>
                    </div>
                    <input
                      className={styles.editInput}
                      value={task.title}
                      onChange={(e) => updateTask(task.id, "title", e.target.value)}
                      placeholder="Task title"
                    />
                    <input
                      className={styles.editInput}
                      value={task.description}
                      onChange={(e) => updateTask(task.id, "description", e.target.value)}
                      placeholder="Task description"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.hilApprove}>
              {!dispatched && (
                <button className="btn" onClick={handleDispatch} disabled={plan.agenticTasks.length === 0}>
                  Approve &amp; Dispatch Agents {"\uD83D\uDE80"}
                </button>
              )}
              {agentsDone && (
                <button className="btn" onClick={handleGoToPortal} style={{ background: "var(--accent-success)" }}>
                  View New Hire Portal {"\u2192"}
                </button>
              )}
            </div>

            {/* Agent Execution Terminal */}
            {dispatched && executionLog.length > 0 && (
              <div className={styles.executionTerminal}>
                <div className={styles.terminalHeader}>
                  <span className={styles.terminalDot} style={{ background: agentRunning ? "#f59e0b" : "#10b981" }} />
                  <span>{agentRunning ? "Agents Running..." : "All Agents Complete"}</span>
                </div>
                <div className={styles.terminalBody}>
                  {executionLog.map((line, i) => (
                    <div key={i} className={styles.terminalLine}>{line}</div>
                  ))}
                  {agentRunning && <div className={styles.terminalCursor}>_</div>}
                </div>
              </div>
            )}

            {/* Manager Nudge Preview (ported from Greg's BoardingPass) */}
            {dispatched && (
              <div className={styles.nudgePreview}>
                <div className={styles.nudgeHeader}>
                  <span className={styles.nudgeIcon}>{"\uD83D\uDD14"}</span>
                  <span className={styles.nudgeTitle}>Slack Nudge Preview</span>
                  <span className={styles.nudgeBadge}>Will be sent automatically</span>
                </div>
                <div className={styles.nudgeBody}>
                  <div className={styles.nudgeSlackMsg}>
                    <strong>#onboarding</strong>
                    <p>
                      <span style={{ color: "var(--accent-primary)", fontWeight: 600 }}>@{employee?.name?.split(" ")[0] || "New Hire"}&apos;s Manager</span>{" "}
                      — {employee?.name} is starting their onboarding today! Their buddy <strong>{plan.buddyName}</strong> has been notified.
                      Check their progress on the <em>Manager Dashboard</em>.
                    </p>
                    <div className={styles.nudgeActions}>
                      <span className={styles.nudgeReaction}>{"\uD83D\uDC4B"} 3</span>
                      <span className={styles.nudgeReaction}>{"\uD83C\uDF89"} 5</span>
                      <span className={styles.nudgeReaction}>{"\uD83D\uDE80"} 2</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
