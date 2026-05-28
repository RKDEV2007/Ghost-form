import { useEffect, useState } from 'react'
import { useGame } from '../game/useGame'
import { SCREENS } from '../game/constants'
import { TITLE_LOG_LINES } from '../game/introBubbles'
import { TypewriterText } from './TypewriterText'

export function TitleScreen() {
  const { state, setState } = useGame()
  const { titleLoading, titleProgress } = state
  const [logLine, setLogLine] = useState(-1)

  useEffect(() => {
    if (!titleLoading) return
    if (titleProgress >= 100) {
      const t = setTimeout(() => {
        setState({ screen: SCREENS.INTRO, titleLoading: false, titleProgress: 0 })
      }, 500)
      return () => clearTimeout(t)
    }
    const id = setInterval(() => {
      setState((s) => ({
        titleProgress: Math.min(100, s.titleProgress + Math.random() * 12 + 4),
      }))
    }, 200)
    return () => clearInterval(id)
  }, [titleLoading, titleProgress, setState])

  useEffect(() => {
    const id = setTimeout(() => {
      setLogLine(titleLoading ? 0 : -1)
    }, 0)
    return () => clearTimeout(id)
  }, [titleLoading])

  const start = () => {
    setState({ titleLoading: true, titleProgress: 0 })
  }

  const onLogLineDone = (i) => {
    if (i < TITLE_LOG_LINES.length - 1) {
      setLogLine(i + 1)
    }
  }

  return (
    <div className="title-screen">
      <div className="title-window">
        <div className="window-chrome">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
        </div>
        <button
          type="button"
          className={`lets-play ${titleLoading ? 'active' : ''}`}
          onClick={start}
          disabled={titleLoading}
        >
          LET&apos;S PLAY
        </button>
        <div className="title-banner">
          <h1>GHOST: //FORM</h1>
          <span className="fun-tag">FUN FUN FUN</span>
        </div>
        {titleLoading && (
          <div className="title-progress">
            <span>{Math.round(titleProgress)}%</span>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${titleProgress}%` }} />
            </div>
          </div>
        )}
      </div>
      <div className="title-log">
        <span className="log-star log-star-a" aria-hidden>★</span>
        <span className="log-star log-star-b" aria-hidden>★</span>
        <div className="log-lines">
          {TITLE_LOG_LINES.map((line, i) => (
            <p key={line} className="log-line">
              {!titleLoading ? (
                line
              ) : i <= logLine ? (
                <TypewriterText
                  text={line}
                  active={i === logLine}
                  onDone={() => onLogLineDone(i)}
                />
              ) : null}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
