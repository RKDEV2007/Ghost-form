import { FormPanel } from './FormPanel'
import { InspectPanel } from './InspectPanel'
import { LogPanel } from './LogPanel'

export function Workspace({ activeView, logs }) {
  return (
    <main className="workspace">
      <div className="tabs"><button className="tab active">{activeView.toUpperCase()}</button></div>
      <section className="panel">
        {activeView === 'form' && <FormPanel />}
        {activeView === 'log' && <LogPanel logs={logs} />}
        {activeView === 'inspect' && <InspectPanel />}
      </section>
    </main>
  )
}
