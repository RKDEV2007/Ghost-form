import chloeNeutral from '../assets/chloe1.png'

const SECTIONS = [
  {
    icon: '▤',
    title: 'ЛОГИ',
    text: 'Во вкладке Logs появляются запросы пользователей, системные события и подозрительная активность. Именно здесь чаще всего можно заметить первые признаки аномалии.',
  },
  {
    icon: '◎',
    title: 'INSPECT',
    text: 'Вкладка Inspect позволяет изучать элементы подробнее. Если что-то выглядит странно — проверь объект через Inspect и сравни его с нормальным поведением.',
  },
  {
    icon: '⌂',
    title: 'FORMS',
    text: 'Во вкладке Forms находятся формы и данные, которые иногда приходится исправлять. Некоторые угрозы пытаются изменять содержимое форм или внедрять вредоносный код.',
  },
  {
    icon: '🔔',
    title: 'УВЕДОМЛЕНИЯ',
    text: 'Здесь появляются важные уведомления, подсказки и системные сообщения. Не игнорируй их — иногда они содержат полезную информацию для расследования.',
  },
  {
    icon: '◉',
    title: 'МИССИИ',
    text: 'Справа находится список текущих задач. Выполняй их по порядку, чтобы продвигаться по истории.',
  },
]

export function TutorialModal({ onStart }) {
  return (
    <div className="tutorial-overlay">
      <div className="tutorial-modal">
        <div className="tutorial-portrait">
          <img src={chloeNeutral} alt="Хлоя" className="tutorial-chloe" />
          <div className="tutorial-name-badge">ХЛОЯ</div>
        </div>

        <div className="tutorial-content">
          <div className="tutorial-header">
            <span className="tutorial-tag">ИНСТРУКТАЖ</span>
            <h2 className="tutorial-title">Добро пожаловать в Ghost Form Stage</h2>
          </div>

          <p className="tutorial-greeting">
            Привет! Я Хлоя, твой напарник на этой смене. Прежде чем мы начнём — быстро покажу тебе
            основные инструменты. Они помогут находить аномалии и выполнять задания.
          </p>

          <div className="tutorial-sections">
            {SECTIONS.map((s) => (
              <div key={s.title} className="tutorial-section">
                <div className="tutorial-section-icon">{s.icon}</div>
                <div className="tutorial-section-body">
                  <strong className="tutorial-section-title">{s.title}</strong>
                  <p className="tutorial-section-text">{s.text}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="tutorial-closing">
            Если заметишь что-то необычное — не спеши делать выводы. Наблюдай, анализируй и
            проверяй факты. Удачи на первой смене!
          </p>

          <button type="button" className="tutorial-start-btn" onClick={onStart}>
            ПРИСТУПИТЬ К РАБОТЕ →
          </button>
        </div>
      </div>
    </div>
  )
}
