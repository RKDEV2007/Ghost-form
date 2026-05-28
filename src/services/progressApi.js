const STORAGE_KEY = 'ghost-form-player-id'
const LOCAL_SAVE_KEY = 'ghost-form-save'

export function getPlayerId() {
  let id = localStorage.getItem(STORAGE_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(STORAGE_KEY, id)
  }
  return id
}

export function loadLocalSave() {
  try {
    const raw = localStorage.getItem(LOCAL_SAVE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveLocal(state) {
  const payload = {
    state,
    clientUpdatedAt: Date.now(),
  }
  localStorage.setItem(LOCAL_SAVE_KEY, JSON.stringify(payload))
  return payload
}

export async function fetchRemoteSave(playerId) {
  try {
    const res = await fetch(`/api/save/${playerId}`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function pushRemoteSave(playerId, state, clientUpdatedAt) {
  try {
    const res = await fetch(`/api/save/${playerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state, clientUpdatedAt }),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export function mergeSaves(local, remote) {
  if (!local && !remote) return null
  if (!remote?.state) return local?.state ?? null
  if (!local?.state) return remote.state
  const localTs = local.clientUpdatedAt ?? 0
  const remoteTs = remote.clientUpdatedAt ?? remote.updatedAt ?? 0
  return remoteTs >= localTs ? remote.state : local.state
}

export async function forceSave(state) {
  const payload = saveLocal(state)
  const playerId = getPlayerId()
  const remote = await pushRemoteSave(playerId, state, payload.clientUpdatedAt)
  return { local: true, remote: !!remote, at: payload.clientUpdatedAt }
}

export function clearLocalSave() {
  localStorage.removeItem(LOCAL_SAVE_KEY)
}

export async function clearRemoteSave(playerId) {
  try {
    await fetch(`/api/save/${playerId}`, { method: 'DELETE' })
  } catch {
    /* offline */
  }
}

export async function resetAllProgress() {
  clearLocalSave()
  const playerId = getPlayerId()
  await clearRemoteSave(playerId)
}
