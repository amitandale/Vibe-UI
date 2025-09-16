
import './globals.css';
import PlanBanner from './components/PlanBanner.jsx';
export const metadata = { title: 'Vibe UI', description: 'Vibe UI' };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <PlanBanner />
        <div className="shell">
          <aside className="side">
            <div className="logo">Vibe UI</div>
            <nav style={{marginTop:12}}>
              <a href="/">Home</a>
              <a href="/studio">Studio</a>
              <a href="/prs">PRs</a>
              <a href="/context">Context</a>
              <a href="/settings">Settings</a>
            </nav>
          </aside>
          <main className="main">
            <header className="top">
              <div className="muted">Vibe UI</div>
              <div className="muted">v0</div>
            </header>
            <div className="content">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
