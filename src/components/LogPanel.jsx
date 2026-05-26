export function LogPanel({ logs }) {
  return logs.map((entry) => (
    <pre key={entry.id} className={entry.ghost ? 'ghost' : ''}>{entry.text}</pre>
  ))
}
