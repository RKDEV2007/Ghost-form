import { useState } from 'react'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { Workspace } from './components/Workspace'
import { MissionPanel } from './components/MissionPanel'
import { INITIAL_LOGS } from './data/logs'

export default function App() {
  const [activeView, setActiveView] = useState('form')

  return (
    <div className="screen">
      <Header />
      <div className="layout">
        <Sidebar activeView={activeView} onView={setActiveView} />
        <Workspace activeView={activeView} logs={INITIAL_LOGS} />
        <MissionPanel />
      </div>
    </div>
  )
}
