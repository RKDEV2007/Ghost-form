import { TASKS } from '../data/tasks'

export function MissionPanel() {
  return (
    <aside className="mission">
      <h3>День 1 — базовый интерфейс</h3>
      <p className="hint">Собран каркас: компоненты, панели, данные и первые состояния.</p>
      <ul className="tasks">{TASKS.map((task) => <li key={task}>{task}</li>)}</ul>
    </aside>
  )
}
