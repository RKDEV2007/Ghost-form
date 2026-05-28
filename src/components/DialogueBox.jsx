import { useState } from 'react'
import { SPEAKERS } from '../game/constants'
import { TypewriterText } from './TypewriterText'
import arrowIcon from '../assets/arrow.png'

export function DialogueBox({ dialogue, onComplete }) {
  const [done, setDone] = useState(false)
  const speaker = SPEAKERS[dialogue.speaker] ?? SPEAKERS.system
  const isCircle = speaker.circle

  return (
    <div className="dialogue-box" data-highlight="dialogue">
      <span
        className={`speaker-tag ${isCircle ? 'speaker-circle' : ''}`}
        style={{ background: speaker.color }}
      >
        {speaker.name}
      </span>
      <p className="dialogue-text">
        <TypewriterText text={dialogue.text} active onDone={() => setDone(true)} />
      </p>
      <button
        type="button"
        className="dialogue-next"
        onClick={() => done && onComplete()}
        disabled={!done}
        aria-label="Далее"
      >
        <img src={arrowIcon} alt="" />
      </button>
    </div>
  )
}
