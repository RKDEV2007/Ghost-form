export function addNotification(state, text, type = 'info') {
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    text,
    time: new Date().toISOString(),
    read: false,
    type,
  }
  return {
    notifications: [entry, ...(state.notifications ?? [])].slice(0, 30),
  }
}

export function markAllRead(state) {
  return {
    notifications: (state.notifications ?? []).map((n) => ({ ...n, read: true })),
  }
}

export function unreadCount(state) {
  return (state.notifications ?? []).filter((n) => !n.read).length
}
