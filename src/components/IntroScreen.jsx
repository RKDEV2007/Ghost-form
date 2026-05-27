import { INTRO_LINES } from '../data/story'
import { useStep } from '../hooks/useStep'

export function IntroScreen({ onDone }) {
  const { step, next } = useStep(INTRO_LINES.length - 1)
  const advance = () => step >= INTRO_LINES.length - 1 ? onDone() : next()

  return (
    <div className="intro">
      <div className="intro-frame">
        {INTRO_LINES.slice(0, step + 1).map((line, index) => (
          <div className="bubble" key={line}>
            {line}
            {index === step && <button className="next" onClick={advance}>→</button>}
          </div>
        ))}
      </div>
    </div>
  )
}
