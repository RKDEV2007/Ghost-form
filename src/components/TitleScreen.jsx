import { TITLE_LOGS } from '../data/story'

export function TitleScreen({ onStart }) {
  return (
    <div className="title-screen">
      <div className="title-window">
        <div className="chrome"><span className="dot" /><span className="dot" /><span className="dot" /></div>
        <button className="play" onClick={onStart}>LET&apos;S PLAY</button>
        <div className="banner"><h1>GHOST: //FORM</h1><strong>FUN FUN FUN</strong></div>
      </div>
      <div className="title-log">{TITLE_LOGS.map((line) => <p key={line}>{line}</p>)}</div>
    </div>
  )
}
