import { useEffect, useRef } from 'react'

export function LogView({ logs, onGhostSeen, onBlockedSeen }) {
  const ghostDone = useRef(false)
  const blockedDone = useRef(false)

  const hasGhost = logs.some((l) => l.ghost && l.status === 'accepted')
  const hasBlocked = logs.some((l) => String(l.status).includes('blocked'))

  useEffect(() => {
    if (hasGhost && !ghostDone.current) {
      ghostDone.current = true
      onGhostSeen?.()
    }
  }, [hasGhost, onGhostSeen])

  useEffect(() => {
    if (hasBlocked && !blockedDone.current) {
      blockedDone.current = true
      onBlockedSeen?.()
    }
  }, [hasBlocked, onBlockedSeen])

  return (
    <div className="log-console">
      <div className="log-console-head">SERVER LOG</div>
      <div className="log-console-body">
        {logs.length === 0 && (
          <p className="log-empty">ожидание… ghost POST появится через несколько секунд</p>
        )}
        {logs.map((entry, i) => (
          <pre key={i} className={`log-line ${entry.ghost ? 'ghost' : ''}`}>
            {formatLog(entry)}
          </pre>
        ))}
      </div>
    </div>
  )
}

function formatLog(e) {
  const lines = []
  if (e.method) lines.push(`${e.method} ${e.path || e.action || ''}`)
  for (const [k, v] of Object.entries(e)) {
    if (['method', 'path', 'action', 'ghost', 'time'].includes(k)) continue
    lines.push(`${k}: ${JSON.stringify(v)}`)
  }
  if (e.ghost) lines.push('>>> GHOST ENTRY <<<')
  return lines.join('\n')
}
