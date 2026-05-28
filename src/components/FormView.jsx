import { useGame } from '../game/useGame'
import { getCurrentGuide } from '../game/guides'
import { applyStatEvent } from '../game/stats'
import { addNotification } from '../game/notifications'

export function FormView() {
  const { state, setState } = useGame()
  const { formFields, flags, currentDay } = state
  const guide = getCurrentGuide(state)
  const hasCsrf = flags.csrfAdded || formFields.csrfToken
  const injected =
    currentDay >= 4 && !flags.domCleaned && formFields.message === 'i am still here'

  const submit = (e) => {
    e.preventDefault()
    const entry = {
      method: 'POST',
      path: '/submit_form',
      name: formFields.name || '—',
      message: formFields.message || '—',
      csrf: hasCsrf ? 'VALID' : 'MISSING',
      status: hasCsrf ? 'accepted' : 'blocked (no csrf)',
      ghost: false,
    }
    setState((s) => {
      let next = { ...s, serverLogs: [entry, ...s.serverLogs] }
      next = applyStatEvent(next, hasCsrf ? 'form_submit_ok' : 'form_submit_no_csrf')
      if (!hasCsrf) {
        next = {
          ...next,
          ...addNotification(next, 'Сервер отклонил POST — CSRF отсутствует', 'warn'),
        }
      }
      return next
    })
  }

  return (
    <div className="form-console">
      <div className="form-console-head">contact form</div>
      <form className="form-console-body" onSubmit={submit}>
        <label>
          <span>name</span>
          <input
            type="text"
            value={formFields.name}
            onChange={(e) =>
              setState({ formFields: { ...formFields, name: e.target.value } })
            }
            placeholder="введи имя или оставь пустым"
          />
        </label>
        <label>
          <span>message</span>
          <input
            type="text"
            value={injected ? 'i am still here' : formFields.message}
            readOnly={injected}
            onChange={(e) =>
              !injected &&
              setState({ formFields: { ...formFields, message: e.target.value } })
            }
            placeholder="текст сообщения"
          />
        </label>
        {hasCsrf && (
          <p className="form-csrf-ok">✔ csrf_token: sess_a8f3...</p>
        )}
        <button type="submit" className="send-btn">
          send
        </button>
      </form>
      {guide?.highlight === 'tab-form' && (
        <p className="inline-hint">Сейчас только смотри поля — отправка не обязательна.</p>
      )}
      {!hasCsrf && currentDay === 1 && (
        <p className="inline-hint warn">⚠ CSRF нет — форма уязвима</p>
      )}
    </div>
  )
}
