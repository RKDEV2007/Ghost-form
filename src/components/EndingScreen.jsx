import { getDayConfig } from '../game/days'

export function EndingScreen({ ending, onRestart }) {
  const day5 = getDayConfig(5)
  const info = day5.endings?.[ending] ?? day5.endings?.contain

  return (
    <div className="ending-screen">
      <div className={`ending-card ${info?.id}`}>
        <h1>{info?.title}</h1>
        <p className="ending-status">status: {info?.status}</p>
        <p>{info?.desc}</p>
        <button type="button" className="lets-play" onClick={onRestart}>
          Играть снова
        </button>
      </div>
    </div>
  )
}
