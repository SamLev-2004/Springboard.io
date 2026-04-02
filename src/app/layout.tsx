import "./globals.css";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata = {
  title: "Springboard.io",
  description: "AI-Powered Agentic Onboarding — From Offer to Productive in Minutes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="nav-bar">
          <Link href="/" style={{ fontWeight: 700, color: "var(--accent-primary)", fontSize: "1.05rem" }}>
            ⚡ Springboard.io
          </Link>
          <div style={{ flex: 1 }} />
          <Link href="/manager">Manager Dashboard</Link>
          <Link href="/new-hire">New Hire Portal</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
