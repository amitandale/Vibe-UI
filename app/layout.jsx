export const metadata = { title: 'Vibe Studio', description: 'Vibe Studio' };
import './globals.css';
import Link from 'next/link';
import PlanBanner from './components/PlanBanner.jsx';

export default function RootLayout({ children }){
  return (
    <html lang="en">
      <body>
        <PlanBanner />
        <div className="shell">
          <aside className="side">
            <div className="logo">Vibe Studio</div>
            <nav>
              <Link href="/">Home</Link>
              <Link href="/studio/llm">LLM Provider</Link>
              <Link href="/studio/billing">Budgets &amp; Usage</Link>
            </nav>
          </aside>
          <main className="main">
            <header className="top">
              <div className="muted">UI on VPS</div>
              <div className="muted">v1</div>
            </header>
            <div className="content">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
