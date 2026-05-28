import { useState } from 'react'

const FINAL_TOKEN = 'form_engine_lock_5'
const STRATEGIES = ['delete', 'contain', 'negotiate']

export function FinalChoice({ onChoose, onMistake }) {
  const [command, setCommand] = useState('contain --token=')
  const [error, setError] = useState('')

  const run = () => {
    const normalized = command.trim().toLowerCase()
    const strategy = STRATEGIES.find((item) => normalized.startsWith(item))
    if (!strategy) {
      setError('Команда не распознана. Напиши delete, contain или negotiate.')
      onMistake?.()
      return
    }
    if (!normalized.includes(FINAL_TOKEN)) {
      setError(`Не хватает токена. Вставь: ${FINAL_TOKEN}`)
      onMistake?.()
      return
    }
    onChoose(strategy)
  }

  return (
    <div className="final-choice" data-highlight="final-choice">
      <h3>Kill or Contain</h3>
      <p>Ghost — процесс отправки. Напиши финальную команду с токеном:</p>
      <textarea
        className="final-command"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        rows={2}
        spellCheck={false}
      />
      <p className="inline-hint">
        Токен: <code>{FINAL_TOKEN}</code>
      </p>
      <p className="inline-hint">Пример: contain --token={FINAL_TOKEN}</p>
      {error && <p className="inline-hint warn">{error}</p>}
      <button type="button" className="choice contain" onClick={run}>
        RUN STRATEGY
        <small>стратегия + токен завершат день 5</small>
      </button>
    </div>
  )
}
