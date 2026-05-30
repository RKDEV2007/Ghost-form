import { normalizeStats } from '../game/stats'

const NAV = [
  { id: 'home', label: 'ГЛАВНАЯ', icon: '⌂', view: 'form' },
  { id: 'logs', label: 'ЛОГИ', icon: '▤', view: 'log' },
  { id: 'browser', label: 'БРАУЗЕР', icon: '◎', view: 'inspect' },
  { id: 'files', label: 'ФАЙЛЫ', icon: '▣', view: null },
  { id: 'missions', label: 'МИССИИ', icon: '◉', view: null },
  { id: 'journal', label: 'ЖУРНАЛ', icon: '☰', view: null, badge: '!!!' },
]

const TUTORIAL_VIEW = { 1: 'log', 2: 'inspect', 3: 'form' }

export function Sidebar({ activeView, inPlay, stats, username, onViewChange, avatarSrc, notifCount, tutorialStep }) {
  const safeStats = normalizeStats(stats)
  const xpPct = Math.round((safeStats.xp / 1000) * 100)
  const tutorialActive = tutorialStep > 0 && tutorialStep <= 3
  const tutorialTargetView = TUTORIAL_VIEW[tutorialStep] ?? null

  return (
    <aside className="sidebar left">
      <nav className="sidebar-nav">
        {NAV.map((item) => {
          const active = (inPlay || tutorialActive) && item.view === activeView
          const introLogs = !inPlay && !tutorialActive && item.id === 'logs'
          const isTutorialHighlight = tutorialActive && item.view === tutorialTargetView
          const canClick = item.view && (inPlay || (tutorialActive && item.view === tutorialTargetView))
          return (
            <button
              key={item.id}
              type="button"
              data-nav={item.id}
              className={`nav-item ${active || introLogs ? 'active' : ''} ${isTutorialHighlight ? 'tutorial-highlight' : ''}`}
              disabled={!canClick}
              onClick={() => canClick && onViewChange(item.view)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.badge && (
                <span className="nav-badge">{notifCount > 0 ? notifCount : item.badge}</span>
              )}
            </button>
          )
        })}
      </nav>
      <div className="profile">
        <img src={avatarSrc} alt="" className="avatar" />
        <div className="profile-text">
          <strong>{username}</strong>
          <span className="profile-level">{safeStats.level} УРОВЕНЬ</span>
          <div className="xp-bar">
            <span style={{ width: `${xpPct}%` }} />
          </div>
          <small>{safeStats.xp} / 1000 XP</small>
        </div>
      </div>
    </aside>
  )
}
