import "./globals.css";
import Link from 'next/link';

export const metadata = {
  title: 'Springboard.io',
  description: 'AI-Powered Agentic Onboarding System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="nav-bar">
          <Link href="/">Home</Link>
          <Link href="/manager">Manager Dashboard</Link>
          <Link href="/new-hire">New Hire Portal</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
