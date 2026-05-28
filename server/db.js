import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, 'data')
const DB_FILE = path.join(DATA_DIR, 'saves.json')

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ saves: {} }, null, 2))
  }
}

function readDb() {
  ensureDb()
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))
}

function writeDb(data) {
  ensureDb()
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
}

export function getSave(playerId) {
  const db = readDb()
  return db.saves[playerId] ?? null
}

export function upsertSave(playerId, payload) {
  const db = readDb()
  const now = Date.now()
  const existing = db.saves[playerId]
  const merged = {
    playerId,
    state: payload.state ?? existing?.state ?? {},
    updatedAt: now,
    clientUpdatedAt: payload.clientUpdatedAt ?? now,
  }
  if (existing && payload.clientUpdatedAt && existing.clientUpdatedAt > payload.clientUpdatedAt) {
    return existing
  }
  db.saves[playerId] = merged
  writeDb(db)
  return merged
}

export function listSaves() {
  const db = readDb()
  return Object.values(db.saves).map((s) => ({
    playerId: s.playerId,
    updatedAt: s.updatedAt,
    screen: s.state?.screen,
    currentDay: s.state?.currentDay,
  }))
}

export function deleteSave(playerId) {
  const db = readDb()
  if (db.saves[playerId]) {
    delete db.saves[playerId]
    writeDb(db)
    return true
  }
  return false
}
