import { useState } from 'react'
import { useGame } from '../game/useGame'
import { createInitialState } from '../game/initialState'
import { forceSave, resetAllProgress } from '../services/progressApi'

export function SettingsModal({ onClose }) {
  const { state, setState } = useGame()
  const [status, setStatus] = useState(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [busy, setBusy] = useState(false)

  const handleSave = async () => {
    setBusy(true)
    setStatus(null)
    try {
      const result = await forceSave(state)
      const when = new Date(result.at).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      })
      setStatus(
        result.remote
          ? `Прогресс сохранён (локально + сервер) · ${when}`
          : `Прогресс сохранён локально · ${when}`,
      )
    } catch {
      setStatus('Ошибка сохранения')
    }
    setBusy(false)
  }

  const handleReset = async () => {
    if (!confirmReset) {
      setConfirmReset(true)
      return
    }
    setBusy(true)
    await resetAllProgress()
    setState(createInitialState())
    setBusy(false)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div className="modal settings-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-head">
          <h2>НАСТРОЙКИ</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </header>
        <div className="modal-body">
          <p className="modal-desc">Управление сохранением игры GHOST://FORM</p>

          <button type="button" className="modal-action save" onClick={handleSave} disabled={busy}>
            💾 Сохранить прогресс
          </button>
          <p className="modal-hint">Записывает в браузер и на сервер (если онлайн)</p>

          {status && <p className="modal-status">{status}</p>}

          <hr className="modal-divider" />

          {!confirmReset ? (
            <button type="button" className="modal-action reset" onClick={handleReset} disabled={busy}>
              ↺ Сбросить прогресс
            </button>
          ) : (
            <div className="reset-confirm">
              <p>Удалить весь прогресс и начать с начала?</p>
              <div className="reset-btns">
                <button type="button" className="modal-action reset-yes" onClick={handleReset} disabled={busy}>
                  Да, сбросить
                </button>
                <button type="button" className="modal-action cancel" onClick={() => setConfirmReset(false)}>
                  Отмена
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
