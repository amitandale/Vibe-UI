import Link from 'next/link'
// app/projects/page.js
export const dynamic = 'force-dynamic';

function Card({ children }){
  return <div className="border rounded-xl p-4 mb-4 bg-white/5">{children}</div>
}

export default async function ProjectsPage(){
  const base = process.env.NEXT_PUBLIC_CI_URL;
  let items = [];
  try {
    const res = await fetch(`${base}/api/projects`, { cache: 'no-store' });
    if (res.ok){
      const json = await res.json();
      items = json.items || [];
    }
  } catch {}
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Link href="/projects/new" className="px-3 py-2 rounded-lg border">New Project</Link>
      </div>
      {items.length === 0 ? (
        <Card>No projects yet.</Card>
      ) : items.map(p => (
        <Card key={p.id}>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{p.owner}/{p.repo}</div>
              <div className="text-sm opacity-70">Status: {p.status}</div>
            </div>
            <a href={`/projects/${p.id}`} className="px-3 py-2 rounded-lg border">Open</a>
          </div>
        </Card>
      ))}
    </div>
  );
}