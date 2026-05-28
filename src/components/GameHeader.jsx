import fullHeart from '../assets/full_heart.png'
import heartIcon from '../assets/heart_icon.png'
import confusionIcon from '../assets/confusion.png'
import securityIcon from '../assets/security.png'
import bellIcon from '../assets/notofocation.png'
import settingsIcon from '../assets/settings.png'
import { useState } from 'react'
import { STAT_HINTS, isStatLow, normalizeStats } from '../game/stats'
import { useStatDeltas } from '../hooks/useStatDeltas'

function DeltaBadge({ value, suffix = '' }) {
  if (!value) return null
  const sign = value > 0 ? '+' : ''
  const cls = value > 0 ? 'up' : 'down'
  return (
    <span className={`stat-delta ${cls}`}>
      {sign}
      {value}
      {suffix}
    </span>
  )
}

function StatHint({ open, text, onClose }) {
  if (!open) return null
  return (
    <div className="stat-hint" role="tooltip">
      <p>{text}</p>
      <button type="button" className="stat-hint-close" onClick={onClose}>
        ×
      </button>
    </div>
  )
}

export function GameHeader({
  day,
  stats,
  unreadCount = 0,
  onNotifications,
  onSettings,
}) {
  const safeStats = normalizeStats(stats)
  const [hint, setHint] = useState(null)
  const deltas = useStatDeltas(safeStats)
  const low = isStatLow(safeStats)
  const hearts = [0, 1, 2].map((i) => (i < safeStats.lives ? fullHeart : heartIcon))

  return (
    <header className="game-header">
      <div className="header-left">
        <h1 className="logo">GHOST://FORM</h1>
        <span className="day-badge">ДЕНЬ {day} ИЗ 5</span>
      </div>

      <div className="stats-bar">
        <button
          type="button"
          className={`stat-card stat-interactive ${low.lives ? 'stat-danger' : ''} ${deltas?.lives ? 'stat-pulse' : ''}`}
          onClick={() => setHint(hint === 'lives' ? null : 'lives')}
          aria-label="Жизни — подробнее"
        >
          <span className="stat-label">ЖИЗНИ</span>
          <div className="hearts">
            {hearts.map((src, i) => (
              <img key={i} src={src} alt="" />
            ))}
          </div>
          <DeltaBadge value={deltas?.lives} />
          <StatHint
            open={hint === 'lives'}
            text={STAT_HINTS.lives}
            onClose={() => setHint(null)}
          />
        </button>

        <button
          type="button"
          className={`stat-card stat-interactive ${low.concentration ? 'stat-danger' : ''} ${deltas?.concentration ? 'stat-pulse' : ''}`}
          onClick={() => setHint(hint === 'concentration' ? null : 'concentration')}
          aria-label="Концентрация — подробнее"
        >
          <img src={confusionIcon} alt="" className="stat-icon" />
          <div className="stat-inner">
            <span className="stat-label">КОНЦЕНТРАЦИЯ</span>
            <div className="mini-bar pink">
              <span style={{ width: `${safeStats.concentration}%` }} />
            </div>
            <span className="stat-pct">{safeStats.concentration}%</span>
          </div>
          <DeltaBadge value={deltas?.concentration} suffix="%" />
          <StatHint
            open={hint === 'concentration'}
            text={STAT_HINTS.concentration}
            onClose={() => setHint(null)}
          />
        </button>

        <button
          type="button"
          className={`stat-card stat-interactive ${low.security ? 'stat-danger' : ''} ${deltas?.security ? 'stat-pulse' : ''}`}
          onClick={() => setHint(hint === 'security' ? null : 'security')}
          aria-label="Безопасность — подробнее"
        >
          <img src={securityIcon} alt="" className="stat-icon" />
          <div className="stat-inner">
            <span className="stat-label">БЕЗОПАСНОСТЬ</span>
            <div className="mini-bar green">
              <span style={{ width: `${safeStats.security}%` }} />
            </div>
            <span className="stat-pct">{safeStats.security}%</span>
          </div>
          <DeltaBadge value={deltas?.security} suffix="%" />
          <StatHint
            open={hint === 'security'}
            text={STAT_HINTS.security}
            onClose={() => setHint(null)}
          />
        </button>
      </div>

      <div className="header-utils">
        <button type="button" className="util-btn" onClick={onNotifications}>
          <img src={bellIcon} alt="" />
          УВЕДОМЛЕНИЯ
          {unreadCount > 0 && <span className="util-badge">{unreadCount}</span>}
        </button>
        <button type="button" className="util-btn" onClick={onSettings}>
          <img src={settingsIcon} alt="" />
          НАСТРОЙКИ
        </button>
      </div>
    </header>
  )
}
