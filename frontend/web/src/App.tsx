import { useEffect, useState } from 'react'
import './App.css'

type Health = { status: string } | null

export default function App() {
  const [health, setHealth] = useState<Health>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/actuator/health')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data) => setHealth(data))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Unknown error'))
  }, [])

  return (
    <main>
      <h1>Flash Sale Platform</h1>
      {error && <p role=yt/"alert">Backend unavailable: {error}</p>}
      {!error && !health && <p>Checking backend…</p>}
      {health && <p>Backend status: {health.status}</p>}
    </main>
  )
}
