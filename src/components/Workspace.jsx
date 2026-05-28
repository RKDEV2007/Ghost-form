import { FormView } from './FormView'
import { LogView } from './LogView'
import { InspectMode } from './InspectMode'
import { FinalChoice } from './FinalChoice'

const TABS = [
  { id: 'form', label: 'FORM' },
  { id: 'log', label: 'LOG' },
  { id: 'inspect', label: 'INSPECT' },
]

export function Workspace({
  activeView,
  onTabChange,
  serverLogs,
  currentDay,
  dayPhase,
  onMiniComplete,
  onGhostSeen,
  onBlockedSeen,
  onFinalChoice,
  onFinalMistake,
}) {
  return (
    <div className="workspace" data-highlight="console">
      <div className="workspace-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`workspace-tab tab-${t.id} ${activeView === t.id ? 'active' : ''}`}
            onClick={() => onTabChange(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="workspace-body">
        {currentDay === 5 && dayPhase === 'play' && (
          <FinalChoice onChoose={onFinalChoice} onMistake={onFinalMistake} />
        )}
        {activeView === 'form' && <FormView />}
        {activeView === 'log' && (
          <LogView logs={serverLogs} onGhostSeen={onGhostSeen} onBlockedSeen={onBlockedSeen} />
        )}
        {activeView === 'inspect' && <InspectMode onMiniComplete={onMiniComplete} />}
      </div>
    </div>
  )
}
