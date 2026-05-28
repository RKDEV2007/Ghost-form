import { getCurrentGuide, getGuideSteps } from '../game/guides'

export function GuideCoach({ state }) {
  const current = getCurrentGuide(state)
  const total = getGuideSteps(state.currentDay).length
  if (!current || state.dayPhase === 'complete') return null

  return (
    <div className="guide-coach">
      <div className="guide-coach-top">
        <span className="guide-pill">ПОДСКАЗКА</span>
        <span className="guide-step-num">
          {state.guideStep + 1} / {total}
        </span>
      </div>
      <strong className="guide-coach-title">{current.title}</strong>
      <p className="guide-coach-text">{current.text}</p>
      {current.inputHint && (
        <code className="guide-coach-code">{current.inputHint}</code>
      )}
    </div>
  )
}
