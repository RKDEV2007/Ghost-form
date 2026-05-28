import { normalizeStats } from '../game/stats'

const NAV = [
  { id: 'home', label: 'ГЛАВНАЯ', icon: '⌂', view: 'form' },
  { id: 'logs', label: 'ЛОГИ', icon: '▤', view: 'log' },
  { id: 'browser', label: 'БРАУЗЕР', icon: '◎', view: 'inspect' },
  { id: 'files', label: 'ФАЙЛЫ', icon: '▣', view: null },
  { id: 'missions', label: 'МИССИИ', icon: '◉', view: null },
  { id: 'journal', label: 'ЖУРНАЛ', icon: '☰', view: null, badge: '!!!' },
]

export function Sidebar({ activeView, inPlay, stats, username, onViewChange, avatarSrc, notifCount }) {
  const safeStats = normalizeStats(stats)
  const xpPct = Math.round((safeStats.xp / 1000) * 100)

  return (
    <aside className="sidebar left">
      <nav className="sidebar-nav">
        {NAV.map((item) => {
          const active = inPlay && item.view === activeView
          const introLogs = !inPlay && item.id === 'logs'
          return (
            <button
              key={item.id}
              type="button"
              data-nav={item.id}
              className={`nav-item ${active || introLogs ? 'active' : ''}`}
              disabled={!item.view || !inPlay}
              onClick={() => item.view && inPlay && onViewChange(item.view)}
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
