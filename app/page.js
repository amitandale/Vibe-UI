import Link from 'next/link'

export default function Page(){
  return (
    <div className="card">
      <h2>Vibe Studio</h2>
      <p className="muted">Start in <Link href="/studio">Studio</Link> to paste a diff and open a PR via your Bridge Agent.</p>
    </div>
  )
}