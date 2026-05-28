import { useState } from 'react'
import { useGame } from '../game/useGame'
import { INTRO_BUBBLES } from '../game/introBubbles'
import { SCREENS } from '../game/constants'
import { getDayConfig } from '../game/days'
import { TypewriterText } from './TypewriterText'
import arrowIcon from '../assets/arrow.png'

export function IntroVN() {
  const { setState } = useGame()
  const [bubble, setBubble] = useState(0)
  const [typingDone, setTypingDone] = useState(false)

  const next = () => {
    if (!typingDone) return
    if (bubble < INTRO_BUBBLES.length - 1) {
      setBubble((b) => b + 1)
      setTypingDone(false)
    } else {
      const day1 = getDayConfig(1)
      setState({
        screen: SCREENS.GAME,
        dayPhase: 'intro',
        dialogueIndex: 0,
        introComplete: false,
        guideStep: 0,
        serverLogs: [],
        activityLog: day1.activity ?? [],
        notifications: [],
      })
    }
  }

  return (
    <div className="intro-vn">
      <div className="intro-frame">
        {INTRO_BUBBLES.slice(0, bubble + 1).map((text, i) => (
          <div
            key={i}
            className={`intro-bubble intro-bubble-${i} ${i === bubble ? 'active' : 'past'}`}
          >
            {i === bubble ? (
              <TypewriterText
                text={text}
                active
                onDone={() => setTypingDone(true)}
              />
            ) : (
              text
            )}
            {i === bubble && (
              <button
                type="button"
                className="next-btn"
                onClick={next}
                disabled={!typingDone}
                aria-label="Далее"
              >
                <img src={arrowIcon} alt="" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
