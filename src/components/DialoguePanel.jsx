import { DAY_DIALOGUES } from '../data/dialogues'

export function DialoguePanel() {
  return (
    <div className="scene-card">
      <h3>Диалог дня</h3>
      {DAY_DIALOGUES.map((line) => (
        <p key={line.text}><strong>{line.speaker}:</strong> {line.text}</p>
      ))}
    </div>
  )
}
