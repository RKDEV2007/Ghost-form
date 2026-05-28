export function MiniGameComplete({ message, onNextDay, isLast }) {
  return (
    <div className="mini-complete overlay">
      <div className="mini-complete-box">
        <h3>✔ День пройден</h3>
        <p>{message}</p>
        <button type="button" className="start-btn" onClick={onNextDay}>
          {isLast ? 'К финалу' : 'Следующий день'}
        </button>
      </div>
    </div>
  )
}
