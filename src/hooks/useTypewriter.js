/* eslint-disable react-hooks/set-state-in-effect -- typewriter reset on line change */
import { useCallback, useEffect, useRef, useState } from 'react'

export function useTypewriter(text, active, speed = 28) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!active) return undefined
    setIndex(0)
    const id = setInterval(() => {
      setIndex((i) => {
        const next = i + 1
        if (next >= text.length) clearInterval(id)
        return next
      })
    }, speed)
    return () => clearInterval(id)
  }, [text, active, speed])

  const displayed = active ? text.slice(0, index) : ''
  const done = active && index >= text.length

  const skip = useCallback(() => {
    setIndex(text.length)
  }, [text])

  return { displayed, done, skip }
}

export function useTypewriterDone(done, onDone) {
  const called = useRef(false)
  useEffect(() => {
    if (done && onDone && !called.current) {
      called.current = true
      onDone()
    }
    if (!done) called.current = false
  }, [done, onDone])
}
