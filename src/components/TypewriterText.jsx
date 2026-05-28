import { useTypewriter, useTypewriterDone } from '../hooks/useTypewriter'

export function TypewriterText({ text, active, onDone, className }) {
  const { displayed, done, skip } = useTypewriter(text, active)
  useTypewriterDone(done, onDone)

  return (
    <span className={className} onClick={skip} role="presentation">
      {displayed}
      {active && !done && <span className="cursor-blink">▌</span>}
    </span>
  )
}
