import { NAV_ITEMS } from '../data/navigation'

export function Sidebar({ activeView, onView }) {
  return (
    <aside className="side">
      <nav className="nav">
        {NAV_ITEMS.map((item) => (
          <button key={item.id} className={activeView === item.id ? 'active' : ''} onClick={() => onView(item.id)}>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
