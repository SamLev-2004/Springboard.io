"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./manager.module.css";
import { MOCK_PROFILES } from "@/lib/mcp/mockData";

export default function ManagerDashboard() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(MOCK_PROFILES[0].id);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [employee, setEmployee] = useState<any>(null);
  const [dispatched, setDispatched] = useState(false);

  const handleDispatch = () => {
    const payload = btoa(JSON.stringify({ plan, employee }));
    setDispatched(true);
    setTimeout(() => {
      router.push(`/new-hire?plan=${encodeURIComponent(payload)}`);
    }, 1200);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setPlan(null);
    try {
      const res = await fetch("/api/onboarding/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: selectedId })
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

  return (
    <main className="container">
      <div className={styles.managerContainer}>
        <div>
          <h1>HR / Manager Dashboard</h1>
          <p style={{color: "var(--text-muted)", marginTop: "10px"}}>
            Human-in-the-loop (HIL) oversight for AI agentic onboarding.
          </p>
        </div>

        <div className="glass-panel">
          <h3>1. Upload Profile (MCP Sync)</h3>
          <div className={styles.profileSelector} style={{marginTop: "15px"}}>
            <select 
              className={styles.selectInput} 
              value={selectedId} 
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {MOCK_PROFILES.map(p => (
                <option key={p.id} value={p.id}>{p.name} - {p.role}</option>
              ))}
            </select>
            <button className="btn" onClick={handleGenerate} disabled={loading}>
              {loading ? "Generating..." : "Generate AI Plan"}
            </button>
          </div>
        </div>

        {plan && (
          <div className={`glass-panel ${styles.onboardingPlan}`}>
            <h2>Generated Onboarding Plan for {employee?.name}</h2>
            
            <div style={{marginTop: "20px"}}>
              <h4>Welcome Message Draft</h4>
              <p style={{fontStyle: "italic", background: "rgba(0,0,0,0.2)", padding: "10px", borderRadius: "8px", marginTop: "10px"}}>
                "{plan.welcomeMessage}"
              </p>
            </div>

            <div style={{marginTop: "20px", display: "flex", gap: "20px"}}>
              <div style={{flex: 1}}>
                <h4>Assigned Buddy</h4>
                <p><strong>{plan.buddyName}</strong></p>
                <p style={{fontSize: "0.9rem", color: "var(--text-muted)"}}>{plan.buddyReason}</p>
              </div>
              <div style={{flex: 1}}>
                <h4>First Week Goals</h4>
                <ul style={{marginLeft: "20px", fontSize: "0.9rem", color: "var(--text-muted)"}}>
                  {plan.firstWeekGoals.map((g: string, i: number) => <li key={i}>{g}</li>)}
                </ul>
              </div>
            </div>

            <div style={{marginTop: "30px"}}>
              <h4>Agentic Tasks to Execute</h4>
              <div className={styles.agenticTasks}>
                {plan.agenticTasks.map((task: any) => (
                  <div key={task.id} className={styles.taskCard}>
                    <span className={styles.taskType}>{task.type}</span>
                    <strong style={{fontSize: "0.95rem"}}>{task.title}</strong>
                    <p style={{fontSize: "0.85rem", color: "var(--text-muted)"}}>{task.description}</p>
                    <div style={{marginTop: "auto", fontSize: "0.8rem", color: "var(--accent-warning)"}}>
                      Status: {task.status.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.hilApprove}>
              <button className="btn" onClick={handleDispatch} disabled={dispatched}>
                {dispatched ? "Dispatching Agents..." : "Approve & Dispatch Agents \uD83D\uDE80"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
