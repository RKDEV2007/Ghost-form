import { GameProvider } from './game/GameContext'
import { useGame } from './game/useGame'
import { SCREENS } from './game/constants'
import { createInitialState } from './game/initialState'
import { TitleScreen } from './components/TitleScreen'
import { IntroVN } from './components/IntroVN'
import { GameScreen } from './components/GameScreen'
import { EndingScreen } from './components/EndingScreen'
import './styles/game.css'

function GameRouter() {
  const { state, setState } = useGame()

  if (state.screen === SCREENS.TITLE) return <TitleScreen />
  if (state.screen === SCREENS.INTRO) return <IntroVN />
  if (state.screen === SCREENS.ENDING) {
    return (
      <EndingScreen
        ending={state.ending ?? state.flags.finalChoice ?? 'contain'}
        onRestart={() => setState(createInitialState())}
      />
    )
  }
  return <GameScreen />
}

function App() {
  return (
    <GameProvider>
      <div className="app-root">
        <GameRouter />
      </div>
    </GameProvider>
  )
}

export default App
