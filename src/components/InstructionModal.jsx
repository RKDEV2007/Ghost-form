import chloeNeutral from '../assets/chloe1.png'

const UI_SECTIONS = [
  {
    icon: '◈',
    title: 'Шапка — статистика',
    text: 'Вверху экрана: номер дня (1–5), жизни (сердца), концентрация и уровень безопасности. Нажми на любой показатель — увидишь подсказку. Жизни теряются за ошибки в коде, концентрация падает со временем и при аномалиях, безопасность растёт, когда ты правильно чинишь защиту.',
  },
  {
    icon: '▤',
    title: 'ЛОГИ (SERVER LOG)',
    text: 'Серверный журнал запросов. Здесь видно, кто и что отправил на сайт. Ищи строки с пометкой GHOST ENTRY — это подозрительные POST-запросы без участия пользователя. Сравнивай status: accepted (уязвимость) и blocked (защита сработала).',
  },
  {
    icon: '◎',
    title: 'БРАУЗЕР / INSPECT',
    text: 'Редактор HTML и конфигов. Именно здесь ты пишешь код защиты: добавляешь CSRF-токен, чистишь DOM, настраиваешь Origin. После правок нажми «Проверить код». Неверный ответ снимает жизнь.',
  },
  {
    icon: '⌂',
    title: 'ГЛАВНАЯ / FORM',
    text: 'Форма обратной связи сайта — поля name и message. Можно отправить запрос вручную и проверить, как сервер реагирует. На некоторых днях здесь видно, что форма уже «заражена» без твоего ввода.',
  },
  {
    icon: '◉',
    title: 'Миссии (справа)',
    text: 'Описание дня, список задач и кнопка СТАРТ!. Сначала прочитай диалог с Хлоей, затем жми СТАРТ! — откроется рабочая консоль. Во время игры справа появляются пошаговые подсказки (ПОДСКАЗКА).',
  },
  {
    icon: '🔔',
    title: 'Уведомления и настройки',
    text: 'Уведомления — системные сообщения о событиях (атака, ошибка, успех). Настройки — ручное сохранение и сброс прогресса. Прогресс также сохраняется автоматически в браузере и на сервере.',
  },
]

const GAMEPLAY_STEPS = [
  'Прочитай диалог Хлои в центре экрана (стрелка внизу).',
  'Нажми СТАРТ! справа — откроется консоль с вкладками LOG / FORM / INSPECT.',
  'Открой ЛОГИ и найди аномалию (ghost POST, странный origin и т.д.).',
  'Перейди в INSPECT и исправь код по заданию дня.',
  'Нажми «Проверить код» — при успехе вернись в ЛОГИ и убедись, что атака заблокирована.',
  'Выполни все задачи дня → переход на следующий день. День 5 — финальный выбор стратегии.',
]

const DAYS = [
  { n: 1, topic: 'CSRF-токены', why: 'Без токена любой сайт может отправить форму от твоего имени.' },
  { n: 2, topic: 'Сессии и куки', why: 'Ghost использует чужую session_id — нужно понять, чья сессия украдена.' },
  { n: 3, topic: 'Origin / SameSite', why: 'Запросы с fake-site.net нужно блокировать проверкой источника.' },
  { n: 4, topic: 'DOM-инъекции', why: 'В HTML впрыснуты iframe и скрытые поля — их нужно удалить.' },
  { n: 5, topic: 'Финальная стратегия', why: 'Ghost стал частью системы отправки — выбери delete, contain или negotiate.' },
]

const TERMS = [
  {
    term: 'CSRF (Cross-Site Request Forgery)',
    def: 'Атака, при которой другой сайт заставляет браузер отправить запрос на твой сервер, используя твои куки. Защита — скрытое поле csrf_token, которое знает только твоя страница.',
  },
  {
    term: 'Ghost POST',
    def: 'Симуляция атаки: форма отправляется «сама», с пустыми полями или чужими данными. В логах помечена как GHOST ENTRY.',
  },
  {
    term: 'Session / session_id',
    def: 'Идентификатор сессии пользователя в cookie. Если атакующий подставляет чужой session_id, сервер может принять запрос как легитимный.',
  },
  {
    term: 'Origin / Referrer',
    def: 'Заголовок, откуда пришёл запрос. Проверка Origin не даёт принимать POST с чужих доменов (например fake-site.net).',
  },
  {
    term: 'SameSite',
    def: 'Атрибут cookie: ограничивает отправку куки при cross-site запросах. SameSite=Lax/Strict снижает риск CSRF.',
  },
  {
    term: 'DOM-инъекция',
    def: 'Вредоносный HTML/JS, добавленный в страницу (скрытые input, iframe). Может менять поведение формы без видимых признаков.',
  },
  {
    term: 'Token rotation',
    def: 'Смена CSRF-токена после каждого запроса — усложняет повторное использование украденного токена.',
  },
]

export function InstructionModal({ onClose, isFirstView }) {
  return (
    <div className="tutorial-overlay instruction-overlay">
      <div className="tutorial-modal instruction-modal">
        <div className="tutorial-portrait">
          <img src={chloeNeutral} alt="Хлоя" className="tutorial-chloe" />
          <div className="instruction-name-badge">СПРАВКА</div>
        </div>

        <div className="tutorial-content instruction-content">
          <div className="tutorial-header">
            <span className="instruction-tag">ИНСТРУКЦИЯ</span>
            <h2 className="tutorial-title">Как устроена Ghost Form Stage</h2>
          </div>

          <p className="tutorial-greeting">
            Ты — администратор сайта с формой обратной связи. За 5 смен нужно найти уязвимости,
            починить их кодом и пережить атаки «Ghost» — невидимых отправок формы. Это симулятор
            основ веб-безопасности: ты не читаешь теорию, а делаешь руками.
          </p>

          <h3 className="instruction-block-title">Элементы интерфейса</h3>
          <div className="tutorial-sections">
            {UI_SECTIONS.map((s) => (
              <div key={s.title} className="tutorial-section instruction-section">
                <div className="tutorial-section-icon">{s.icon}</div>
                <div className="tutorial-section-body">
                  <strong className="tutorial-section-title">{s.title}</strong>
                  <p className="tutorial-section-text">{s.text}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="instruction-block-title">Что делать каждый день</h3>
          <ol className="instruction-steps">
            {GAMEPLAY_STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <h3 className="instruction-block-title">5 дней — 5 тем</h3>
          <div className="instruction-days">
            {DAYS.map((d) => (
              <div key={d.n} className="instruction-day">
                <span className="instruction-day-num">День {d.n}</span>
                <strong>{d.topic}</strong>
                <p>{d.why}</p>
              </div>
            ))}
          </div>

          <h3 className="instruction-block-title">Термины</h3>
          <div className="instruction-terms">
            {TERMS.map((t) => (
              <div key={t.term} className="instruction-term">
                <dt>{t.term}</dt>
                <dd>{t.def}</dd>
              </div>
            ))}
          </div>

          <p className="tutorial-closing">
            {isFirstView
              ? 'Дальше будет короткий интерактивный туториал — попробуешь вкладки на практике.'
              : 'Кнопка «ИНСТРУКЦИЯ» в шапке всегда открывает эту справку.'}
          </p>

          <button type="button" className="instruction-close-btn" onClick={onClose}>
            {isFirstView ? 'ПОНЯТНО, ДАЛЬШЕ →' : 'ЗАКРЫТЬ'}
          </button>
        </div>
      </div>
    </div>
  )
}
