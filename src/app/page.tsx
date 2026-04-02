import Link from "next/link";

export default function Home() {
  return (
    <main className="container" style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh", textAlign: "center"}}>
      <h1 style={{fontSize: "3.5rem", marginBottom: "20px"}}>
        Welcome to <span style={{color: "var(--accent-primary)"}}>Springboard.io</span>
      </h1>
      <p style={{fontSize: "1.2rem", color: "var(--text-muted)", maxWidth: "600px", marginBottom: "40px"}}>
        Agentic onboarding that bridges the gap from "Offer" to "Productive" in minutes, not months.
      </p>

      <div style={{display: "flex", gap: "20px"}}>
        <Link href="/manager" className="btn">
          HR / Manager Portal
        </Link>
        <Link href="/new-hire" className="btn btn-secondary">
          New Hire Portal (Claude's App)
        </Link>
      </div>
    </main>
  );
}
