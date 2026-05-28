/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useEffect, useReducer, useRef } from 'react'
import { getDayConfig } from './days'
import { createInitialState } from './initialState'
import { SCREENS } from './constants'
import { useProgressSync } from '../hooks/useProgressSync'
import { addNotification } from './notifications'
import { applyStatEvent, applyLogStats, normalizeGameState } from './stats'

export const GameContext = createContext(null)

function reducer(state, action) {
  if (action.type === 'MERGE') {
    const patch = typeof action.payload === 'function' ? action.payload(state) : action.payload
    return normalizeGameState({ ...state, ...patch })
  }
  return normalizeGameState(state)
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState)

  const setState = useCallback((patch) => {
    dispatch({ type: 'MERGE', payload: patch })
  }, [])

  useProgressSync(state, setState)

  const ghostTimer = useRef(null)

  useEffect(() => {
    if (state.screen !== SCREENS.GAME) return
    if (state.currentDay !== 1 || state.flags.csrfAdded) return
    if (state.dayPhase !== 'play' && state.dayPhase !== 'mini') return

    ghostTimer.current = setTimeout(() => {
      dispatch({
        type: 'MERGE',
        payload: (s) => {
          if (s.flags.csrfAdded) return s
          const day = getDayConfig(1)
          const hasGhost = s.serverLogs.some((l) => l.ghost && l.status === 'accepted')
          if (hasGhost) return s
          let next = {
            ...s,
            serverLogs: [...(day.ghostLogs ?? []), ...s.serverLogs],
            activityLog: [...new Set([...s.activityLog, ...(day.activity ?? [])])],
          }
          next = applyLogStats(next, day.ghostLogs ?? [])
          next = { ...next, ...addNotification(next, 'Подозрительный POST', 'warn') }
          next = { ...next, ...addNotification(next, 'CSRF токен отсутствует', 'warn') }
          return next
        },
      })
    }, 3500)

    return () => clearTimeout(ghostTimer.current)
  }, [state.screen, state.currentDay, state.flags.csrfAdded, state.dayPhase])

  useEffect(() => {
    if (state.screen !== SCREENS.GAME) return
    if (state.dayPhase !== 'play' && state.dayPhase !== 'mini') return

    const id = setInterval(() => {
      dispatch({
        type: 'MERGE',
        payload: (s) => applyStatEvent(s, 'time_drain'),
      })
    }, 12000)

    return () => clearInterval(id)
  }, [state.screen, state.dayPhase])

  return (
    <GameContext.Provider value={{ state, setState }}>{children}</GameContext.Provider>
  )
}
