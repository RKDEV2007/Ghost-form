import { useEffect, useRef, useState } from 'react'
import { statDelta } from '../game/stats'

export function useStatDeltas(stats) {
  const prev = useRef(stats)
  const [deltas, setDeltas] = useState(null)

  useEffect(() => {
    const d = statDelta(prev.current, stats)
    const changed = d.lives || d.concentration || d.security
    if (changed) {
      setDeltas(d)
      const t = setTimeout(() => setDeltas(null), 2200)
      prev.current = stats
      return () => clearTimeout(t)
    }
    prev.current = stats
    return undefined
  }, [stats])

  return deltas
}
