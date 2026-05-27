import { TASKS } from '../data/tasks'

export function MissionPanel() {
  return (
    <aside className="mission">
      <h3>Первые аномалии</h3>
      <p className="hint">Система показывает первый самостоятельный POST и ведёт игрока через старт, intro и лог Ghost.</p>
      <ul className="tasks">{TASKS.map((task) => <li key={task}>{task}</li>)}</ul>
    </aside>
  )
}
