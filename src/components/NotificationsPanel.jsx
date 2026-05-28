export function NotificationsPanel({ notifications, onClose, onMarkRead }) {
  const unread = notifications.filter((n) => !n.read).length

  const formatTime = (iso) => {
    try {
      return new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div className="modal notifications-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-head">
          <h2>УВЕДОМЛЕНИЯ</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </header>
        <div className="modal-body">
          {unread > 0 && (
            <button type="button" className="mark-read-btn" onClick={onMarkRead}>
              Отметить все прочитанными
            </button>
          )}
          {notifications.length === 0 && (
            <p className="notif-empty">Пока тихо. События появятся в игре.</p>
          )}
          <ul className="notif-list">
            {notifications.map((n) => (
              <li key={n.id} className={`notif-item ${n.read ? 'read' : ''} type-${n.type}`}>
                <span className="notif-time">{formatTime(n.time)}</span>
                <span className="notif-text">{n.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
