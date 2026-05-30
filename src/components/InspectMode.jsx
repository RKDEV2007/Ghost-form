import { useEffect, useMemo, useState } from 'react'
import { useGame } from '../game/useGame'
import { addNotification } from '../game/notifications'
import { applyStatEvent } from '../game/stats'

const TUTORIAL_STARTER = `<form action="/submit" method="POST">
  <!-- добавь поле ввода здесь -->
  <button type="submit">Отправить</button>
</form>`

function validateTutorial(code) {
  return /<input/i.test(code) && /name\s*=/i.test(code)
}

export function TutorialInspect({ onDone }) {
  const [code, setCode] = useState(TUTORIAL_STARTER)
  const [status, setStatus] = useState('')
  const [done, setDone] = useState(false)

  const check = () => {
    if (done) return
    if (!validateTutorial(code)) {
      setStatus('Не хватает тега <input> с атрибутом name=. Попробуй ещё раз.')
      return
    }
    setStatus('Верно! Поле добавлено.')
    setDone(true)
    setTimeout(onDone, 800)
  }

  return (
    <div className="inspect-console">
      <div className="inspect-split">
        <div className="inspect-col">
          <span className="inspect-label">tutorial · попробуй Inspect</span>
          <textarea
            className="html-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={8}
            spellCheck={false}
            disabled={done}
          />
          <p className="inline-hint">
            Добавь поле ввода в форму: <code>{'<input type="text" name="username" />'}</code>
          </p>
          <button type="button" className="action-btn" onClick={check} disabled={done}>
            {done ? 'Готово ✓' : 'Проверить'}
          </button>
          {status && (
            <p className={`inline-hint ${status.startsWith('Не') ? 'warn' : ''}`}>{status}</p>
          )}
        </div>
        <div className="inspect-col">
          <span className="inspect-label">подсказка</span>
          <pre className="cookie-block">{`Синтаксис поля ввода:

<input
  type="text"
  name="username"
/>

type= указывает тип поля
name= — имя параметра,
  которое придёт на сервер`}</pre>
        </div>
      </div>
    </div>
  )
}

const BASE_HTML = `<form action="/submit_form" method="POST">
  <input type="text" name="name" />
  <textarea name="message"></textarea>
  <!-- добавь csrf здесь -->
  <button type="submit">send</button>
</form>`

const SESSION_COOKIE = 'session_id=sess_a8f3_k9m2; Path=/; HttpOnly'
const DAY4_CSRF_TOKEN = 'dom_snapshot_v4'

const DAY_CODE = {
  1: BASE_HTML,
  2: `// выпиши, какую сессию использует ghost_user
user = "ghost_user"
session_id = ""`,
  3: `export const formSecurity = {
  blockOrigins: [],
  sameSite: false,
  originCheck: false,
  tokenRotation: false,
}`,
  4: `${BASE_HTML}
<input type="hidden" name="ghost_payload" />
<iframe src="ghost://inject"></iframe>`,
}

function initialCode(day) {
  return DAY_CODE[day] ?? BASE_HTML
}

function validateCode(day, code) {
  if (day === 1) {
    return /type=["']hidden["']/i.test(code) && /name=["']csrf_token["']/i.test(code)
  }
  if (day === 2) {
    return /ghost_user/i.test(code) && /session_id\s*=\s*["']?sess_a8f3_k9m2/i.test(code)
  }
  if (day === 3) {
    return (
      /fake-site\.net/i.test(code) &&
      /sameSite\s*:\s*true/i.test(code) &&
      /originCheck\s*:\s*true/i.test(code) &&
      /tokenRotation\s*:\s*true/i.test(code)
    )
  }
  if (day === 4) {
    return (
      /name=["']csrf_token["']/i.test(code) &&
      code.includes(DAY4_CSRF_TOKEN) &&
      !/ghost_payload/i.test(code) &&
      !/<iframe/i.test(code) &&
      !/ghost:\/\//i.test(code)
    )
  }
  return false
}

function taskLabel(day) {
  const labels = {
    1: 'Добавь hidden input с csrf_token прямо в HTML.',
    2: 'Впиши ghost_user и точный session_id из cookies.',
    3: 'Заполни конфиг: заблокируй fake-site.net и включи три защиты.',
    4: `Удали injected-поля и iframe. Вместо комментария добавь строку: <input type="hidden" name="csrf_token" value="${DAY4_CSRF_TOKEN}" />`,
  }
  return labels[day] ?? 'Проверь код.'
}

function successEvent(day) {
  return {
    1: 'csrf_added',
    2: 'session_checked',
    3: 'origin_locked',
    4: 'dom_cleaned',
  }[day]
}

function miniId(day) {
  return {
    1: 'add-csrf',
    2: 'session-check',
    3: 'origin-trap',
    4: 'dom-cleaned',
  }[day]
}

export function InspectMode({ onMiniComplete }) {
  const { state, setState } = useGame()
  const [code, setCode] = useState(() => initialCode(state.currentDay))
  const [status, setStatus] = useState('')
  const currentEvent = successEvent(state.currentDay)
  const alreadyDone = useMemo(() => {
    if (state.currentDay === 1) return state.flags.csrfAdded
    if (state.currentDay === 2) return state.flags.sessionChecked
    if (state.currentDay === 3) return state.flags.originLocked
    if (state.currentDay === 4) return state.flags.domCleaned
    return false
  }, [state.currentDay, state.flags])

  useEffect(() => {
    const id = setTimeout(() => {
      setCode(initialCode(state.currentDay))
      setStatus('')
    }, 0)
    return () => clearTimeout(id)
  }, [state.currentDay])

  const checkCode = () => {
    if (!currentEvent || alreadyDone) return
    if (!validateCode(state.currentDay, code)) {
      setStatus('Не сходится. Сердце потеряно — поправь код и попробуй ещё раз.')
      setState((s) => applyStatEvent(s, 'mistake'))
      return
    }
    setState((s) =>
      applyStatEvent(
        applySuccessPatch(s, state.currentDay),
        currentEvent,
      ),
    )
    setStatus('Верно. Код принят.')
    onMiniComplete?.(miniId(state.currentDay))
  }

  return (
    <div className="inspect-console">
      <div className="inspect-split">
        <div className="inspect-col">
          <span className="inspect-label">code task</span>
          <textarea
            className="html-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={8}
            spellCheck={false}
            disabled={alreadyDone || state.currentDay === 5}
          />
          {state.currentDay < 5 && (
            <>
              <p className="inline-hint">{taskLabel(state.currentDay)}</p>
              <button
                type="button"
                className="action-btn"
                data-highlight={state.currentDay === 1 ? 'btn-csrf' : undefined}
                onClick={checkCode}
                disabled={alreadyDone}
              >
                {alreadyDone ? 'Задание выполнено' : 'Проверить код'}
              </button>
              {status && <p className={`inline-hint ${status.startsWith('Не') ? 'warn' : ''}`}>{status}</p>}
            </>
          )}
        </div>
        <div className="inspect-col">
          <span className="inspect-label">reference</span>
          <pre className="cookie-block">{SESSION_COOKIE}</pre>
          {state.currentDay === 1 && <pre className="cookie-block">Нужен csrf_token в hidden input.</pre>}
          {state.currentDay === 2 && <pre className="cookie-block">ghost_user использует эту же session_id.</pre>}
          {state.currentDay === 3 && <pre className="cookie-block">origin: fake-site.net{'\n'}защиты: SameSite, Origin check, Token rotation</pre>}
          {state.currentDay === 4 && (
            <pre className="cookie-block">
              token: {DAY4_CSRF_TOKEN}
              {'\n'}как вставить:
              {'\n'}&lt;input type="hidden" name="csrf_token" value="{DAY4_CSRF_TOKEN}" /&gt;
              {'\n'}удалить: ghost_payload, iframe, ghost://inject
            </pre>
          )}
          {alreadyDone && <p className="inspect-ok">Проверка пройдена ✓</p>}
        </div>
      </div>
    </div>
  )
}

function applySuccessPatch(state, day) {
  if (day === 1) {
    return {
      ...state,
      flags: { ...state.flags, csrfAdded: true },
      formFields: { ...state.formFields, csrfToken: 'sess_a8f3...' },
      serverLogs: [
        {
          method: 'POST',
          path: '/submit_form',
          name: '—',
          message: '—',
          status: 'blocked (no csrf)',
          ghost: true,
        },
        ...state.serverLogs,
      ],
      ...addNotification(state, 'Ghost submit: blocked (no csrf)', 'info'),
    }
  }
  if (day === 2) {
    return {
      ...state,
      flags: { ...state.flags, sessionChecked: true },
    }
  }
  if (day === 3) {
    return {
      ...state,
      flags: { ...state.flags, originLocked: true },
    }
  }
  if (day === 4) {
    return {
      ...state,
      flags: { ...state.flags, domCleaned: true },
      formFields: { ...state.formFields, message: '', hiddenExtras: [] },
    }
  }
  return state
}
