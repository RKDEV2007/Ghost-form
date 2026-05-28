import { useEffect, useRef } from 'react'
import {
  fetchRemoteSave,
  getPlayerId,
  loadLocalSave,
  mergeSaves,
  pushRemoteSave,
  saveLocal,
} from '../services/progressApi'
import { normalizeGameState } from '../game/stats'

export function useProgressSync(state, setState) {
  const playerId = useRef(getPlayerId())
  const saveTimer = useRef(null)
  const hydrated = useRef(false)

  useEffect(() => {
    if (hydrated.current) return
    hydrated.current = true
    ;(async () => {
      const local = loadLocalSave()
      const remote = await fetchRemoteSave(playerId.current)
      const merged = mergeSaves(local, remote)
      if (merged) setState(normalizeGameState(merged))
    })()
  }, [setState])

  useEffect(() => {
    if (!hydrated.current) return
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      const payload = saveLocal(state)
      if (navigator.onLine) {
        pushRemoteSave(playerId.current, state, payload.clientUpdatedAt)
      }
    }, 400)
    return () => clearTimeout(saveTimer.current)
  }, [state])

  useEffect(() => {
    const onOnline = () => {
      const local = loadLocalSave()
      if (local?.state) {
        pushRemoteSave(playerId.current, local.state, local.clientUpdatedAt)
      }
    }
    window.addEventListener('online', onOnline)
    return () => window.removeEventListener('online', onOnline)
  }, [])
}
