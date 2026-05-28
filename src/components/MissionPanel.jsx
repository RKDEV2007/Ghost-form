import { getDayConfig } from '../game/days'
import { GuideCoach } from './GuideCoach'

export function MissionPanel({
  day,
  tasks,
  completed,
  phase,
  dialoguesDone,
  onStart,
  guideState,
  activityItems,
}) {
  const config = getDayConfig(day)
  const activity = activityItems?.length ? activityItems : config.activity ?? []

  return (
    <aside className="sidebar right">
      <section className="activity-feed">
        <h3>Активность</h3>
        <ul>
          {activity.map((a, i) => (
            <li key={`${a}-${i}`}>{a}</li>
          ))}
        </ul>
      </section>

      <section className="mission-box">
        <h3 className="mission-title">{config.missionTitle}</h3>
        <p className="mission-desc">{config.missionDesc}</p>
        <h4 className="tasks-label">
          <span className="tasks-rocket">🚀</span> Задачи дня
        </h4>
        <ul className="task-list">
          {tasks.map((t) => (
            <li key={t} className={completed.includes(t) ? 'done' : ''}>
              <span className="task-icon">{completed.includes(t) ? '✔' : '○'}</span>
              {t}
            </li>
          ))}
        </ul>
      </section>

      {phase === 'intro' && !dialoguesDone && (
        <p className="mission-hint">↑ Сначала дочитай диалог с Хлоей</p>
      )}
      {phase === 'intro' && dialoguesDone && (
        <button type="button" className="start-btn" data-highlight="start-btn" onClick={onStart}>
          СТАРТ!
        </button>
      )}
      {(phase === 'play' || phase === 'mini') && guideState && (
        <GuideCoach state={guideState} />
      )}
    </aside>
  )
}
