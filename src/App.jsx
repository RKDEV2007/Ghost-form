import { useState } from 'react'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { Workspace } from './components/Workspace'
import { MissionPanel } from './components/MissionPanel'
import { TitleScreen } from './components/TitleScreen'
import { IntroScreen } from './components/IntroScreen'
import { DialoguePanel } from './components/DialoguePanel'
import { ActivityFeed } from './components/ActivityFeed'
import { INITIAL_LOGS } from './data/logs'

export default function App() {
  const [screen, setScreen] = useState('title')
  const [activeView, setActiveView] = useState('log')

  if (screen === 'title') return <TitleScreen onStart={() => setScreen('intro')} />
  if (screen === 'intro') return <IntroScreen onDone={() => setScreen('game')} />

  return (
    <div className="screen">
      <Header />
      <div className="layout">
        <Sidebar activeView={activeView} onView={setActiveView} />
        <main>
          <div className="scene-grid"><DialoguePanel /><ActivityFeed /></div>
          <Workspace activeView={activeView} logs={INITIAL_LOGS} />
        </main>
        <MissionPanel />
      </div>
    </div>
  )
}
