import express from 'express'
import cors from 'cors'
import { getSave, upsertSave, listSaves, deleteSave } from './db.js'

const PORT = process.env.PORT || 3001
const app = express()

app.use(cors())
app.use(express.json({ limit: '512kb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'ghost-form-save' })
})

app.get('/api/save/:playerId', (req, res) => {
  const save = getSave(req.params.playerId)
  if (!save) {
    return res.status(404).json({ error: 'not_found' })
  }
  res.json(save)
})

app.put('/api/save/:playerId', (req, res) => {
  const { playerId } = req.params
  const body = req.body
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'invalid_body' })
  }
  const saved = upsertSave(playerId, body)
  res.json(saved)
})

app.delete('/api/save/:playerId', (req, res) => {
  deleteSave(req.params.playerId)
  res.json({ ok: true })
})

app.get('/api/saves', (_req, res) => {
  res.json(listSaves())
})

app.listen(PORT, () => {
  console.log(`[ghost-form] save server http://localhost:${PORT}`)
})
