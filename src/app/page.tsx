"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const FEATURES = [
  { icon: "🤖", title: "Agentic Tasks", desc: "AI agents auto-provision access, send intros, and schedule meetings." },
  { icon: "🧠", title: "RAG-Powered Chat", desc: "New hires ask questions and get instant, grounded answers." },
  { icon: "👥", title: "Smart Buddy Match", desc: "Personality-driven matching for the perfect onboarding mentor." },
  { icon: "✅", title: "Manager Oversight", desc: "Human-in-the-loop approval before any agent action executes." },
];

export default function Home() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <main style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "calc(100vh - 65px)",
      textAlign: "center",
      padding: "40px 20px",
      overflow: "hidden",
    }}>
      {/* Animated gradient orbs */}
      <div style={{
        position: "fixed", top: "-200px", left: "-200px",
        width: "600px", height: "600px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
        filter: "blur(80px)",
        animation: "float 8s ease-in-out infinite",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", bottom: "-200px", right: "-200px",
        width: "500px", height: "500px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)",
        filter: "blur(80px)",
        animation: "float 10s ease-in-out infinite reverse",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <p style={{
          fontSize: "0.85rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "3px",
          color: "var(--accent-secondary)",
          marginBottom: "15px",
        }}>
          AI-Powered Agentic Onboarding
        </p>

        <h1 style={{
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          fontWeight: 700,
          lineHeight: 1.1,
          marginBottom: "25px",
        }}>
          From <span style={{
            background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>Offer</span> to{" "}
          <span style={{
            background: "linear-gradient(135deg, var(--accent-secondary), var(--accent-success))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>Productive</span>
          <br />in Minutes.
        </h1>

        <p style={{
          fontSize: "1.15rem",
          color: "var(--text-muted)",
          maxWidth: "580px",
          margin: "0 auto 45px auto",
          lineHeight: 1.7,
        }}>
          Springboard.io bridges the chaotic gap between a signed offer and a productive Day 1 — 
          using AI agents, smart buddy matching, and human-in-the-loop oversight.
        </p>

        <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/manager" className="btn" style={{ fontSize: "1.05rem", padding: "14px 30px" }}>
            HR / Manager Portal →
          </Link>
          <Link href="/new-hire" className="btn btn-secondary" style={{ fontSize: "1.05rem", padding: "14px 30px" }}>
            New Hire Portal →
          </Link>
        </div>
      </div>

      {/* Feature cards */}
      <div style={{
        position: "relative", zIndex: 1,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
        maxWidth: "960px",
        width: "100%",
        marginTop: "80px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
      }}>
        {FEATURES.map((f, i) => (
          <div key={i} className="glass-panel" style={{
            padding: "24px",
            textAlign: "left",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(139,92,246,0.15)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.2)";
          }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "12px" }}>{f.icon}</div>
            <h4 style={{ fontSize: "1rem", marginBottom: "8px" }}>{f.title}</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: "960px",
        width: "100%",
        marginTop: "80px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
      }}>
        <h2 style={{ textAlign: "center", fontSize: "1.8rem", marginBottom: "40px" }}>
          How It Works
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
          position: "relative",
        }}>
          {[
            { step: "1", icon: "\uD83D\uDCC4", title: "Upload Profile", desc: "Manager uploads the new hire's profile and role context via MCP sync." },
            { step: "2", icon: "\u2728", title: "AI Generates Plan", desc: "Gemini crafts a personalized onboarding plan with buddy match and tasks." },
            { step: "3", icon: "\u26A1", title: "Agents Execute", desc: "AI agents provision access, send emails, and schedule meetings in real-time." },
          ].map((s, i) => (
            <div key={i} className="glass-panel" style={{
              padding: "28px 24px",
              textAlign: "center",
              position: "relative",
            }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: "1rem", color: "#fff",
                margin: "0 auto 16px",
              }}>{s.step}</div>
              <div style={{ fontSize: "2rem", marginBottom: "12px" }}>{s.icon}</div>
              <h4 style={{ marginBottom: "8px" }}>{s.title}</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Powered By */}
      <div style={{
        position: "relative", zIndex: 1,
        marginTop: "80px",
        paddingTop: "40px",
        borderTop: "1px solid var(--panel-border)",
        textAlign: "center",
        width: "100%",
        maxWidth: "960px",
        opacity: visible ? 1 : 0,
        transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.7s",
      }}>
        <p style={{
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "2px",
          color: "var(--text-muted)",
          marginBottom: "16px",
        }}>Powered By</p>
        <div style={{
          display: "flex",
          gap: "32px",
          justifyContent: "center",
          flexWrap: "wrap",
          fontSize: "0.9rem",
          color: "var(--text-muted)",
          fontWeight: 500,
        }}>
          <span>Next.js 16</span>
          <span>React 19</span>
          <span>Google Gemini AI</span>
          <span>Vercel AI SDK</span>
          <span>TypeScript</span>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.05); }
        }
      `}</style>
    </main>
  );
}
