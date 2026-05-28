import { addNotification } from './notifications'
import { DEFAULT_STATS, SCREENS } from './constants'

const EFFECTS = {
  mistake: { lives: -1, concentration: -10 },
  time_drain: { concentration: -3 },
  ghost_accepted: { concentration: -12 },
  ghost_blocked: { security: 15 },
  csrf_added: { security: 20 },
  session_checked: { security: 15 },
  origin_locked: { security: 30 },
  dom_cleaned: { security: 25 },
  form_submit_no_csrf: { lives: -1, concentration: -10 },
  form_submit_ok: { security: 5 },
  dom_corrupted: { concentration: -12 },
  ghost_log_seen: { concentration: -6 },
  wrong_origin_log: { concentration: -10 },
  notifications_cleared: { concentration: 3 },
  tab_overload: { concentration: -4 },
  final_delete: { concentration: -5, security: 10 },
  final_contain: { security: 20 },
  final_negotiate: { security: 10 },
}

const MESSAGES = {
  mistake: 'Ошибка в коде: −1 сердце',
  time_drain: 'Время идёт — концентрация падает',
  ghost_accepted: 'Ghost POST принят — сложнее сосредоточиться',
  ghost_blocked: 'Ghost заблокирован — защита растёт',
  csrf_added: 'CSRF установлен — защита +20',
  session_checked: 'Сессия разобрана — защита +15',
  origin_locked: 'Origin/referrer защищены — защита +30',
  dom_cleaned: 'DOM восстановлен — защита +25',
  form_submit_no_csrf: 'Отправка без CSRF — ошибка: −1 сердце',
  form_submit_ok: 'Чистая отправка — защита немного выросла',
  dom_corrupted: 'DOM переписан — концентрация падает',
  ghost_log_seen: 'Странная запись в логах — сложнее сосредоточиться',
  wrong_origin_log: 'POST с fake-site.net — нужно закрыть origin',
  notifications_cleared: 'Уведомления прочитаны — немного спокойнее',
  tab_overload: 'Слишком много переключений — теряешь фокус',
  final_delete: 'DELETE закрывает endpoint, но ломает часть формы',
  final_contain: 'Contain — Ghost изолирован',
  final_negotiate: 'Negotiate — компромисс с Ghost',
}

export const STAT_HINTS = {
  lives: 'Всегда стартуют на максимуме. Снимаются только за ошибки в коде и опасные действия.',
  concentration: 'Стартует на 100% и медленно падает во время работы. Аномалии и хаотичные действия ускоряют падение.',
  security: 'Стартует с 0%. Каждый день ты пишешь кусок защиты, и показатель растёт.',
}

export function normalizeStats(stats = {}) {
  const withDefaults = { ...DEFAULT_STATS, ...stats }
  const number = (value, fallback) => {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : fallback
  }
  return {
    ...withDefaults,
    lives: Math.max(0, Math.min(3, number(withDefaults.lives, DEFAULT_STATS.lives))),
    concentration: Math.max(
      0,
      Math.min(100, number(withDefaults.concentration, DEFAULT_STATS.concentration)),
    ),
    security: Math.max(0, Math.min(100, number(withDefaults.security, DEFAULT_STATS.security))),
    xp: number(withDefaults.xp, DEFAULT_STATS.xp),
    level: number(withDefaults.level, DEFAULT_STATS.level),
  }
}

export function applyStatEvent(state, event) {
  const effect = EFFECTS[event]
  if (!effect) return state

  const prev = normalizeStats(state.stats)
  const next = { ...prev }
  for (const [key, delta] of Object.entries(effect)) {
    if (key in next) next[key] += delta
  }

  const stats = normalizeStats(next)
  let patch = { stats }

  const msg = MESSAGES[event]
  if (msg) {
    const type =
      effect.lives < 0 || effect.concentration < 0 ? 'warn' : effect.security > 0 ? 'info' : 'warn'
    patch = { ...patch, ...addNotification(state, msg, type) }
  }

  return { ...state, ...patch }
}

export function applyStatEvents(state, events) {
  return events.reduce((s, event) => applyStatEvent(s, event), state)
}

export function inferLogStatEvents(log) {
  if (!log?.ghost) return []
  const status = String(log.status ?? '')
  if (status.includes('blocked')) return ['ghost_blocked']
  if (log.origin === 'fake-site.net') return ['wrong_origin_log']
  if (status === 'accepted' || status === 'autonomous') return ['ghost_accepted']
  if (status === 'pending') return ['ghost_log_seen']
  return ['ghost_log_seen']
}

export function applyLogStats(state, logs) {
  const events = logs.flatMap(inferLogStatEvents)
  return applyStatEvents(state, events)
}

export function statDelta(prev, next) {
  const safePrev = normalizeStats(prev)
  const safeNext = normalizeStats(next)
  return {
    lives: safeNext.lives - safePrev.lives,
    concentration: safeNext.concentration - safePrev.concentration,
    security: safeNext.security - safePrev.security,
  }
}

export function isStatLow(stats) {
  const safe = normalizeStats(stats)
  return {
    lives: safe.lives <= 1,
    concentration: safe.concentration < 30,
    security: safe.security < 40,
  }
}

export function normalizeGameState(state) {
  const flags = {
    csrfAdded: false,
    sessionChecked: false,
    originLocked: false,
    domCleaned: false,
    finalChoice: null,
    ...(state?.flags ?? {}),
  }
  const migratedStats =
    state?.statsVersion === 2
      ? normalizeStats(state?.stats)
      : normalizeStats({
          ...DEFAULT_STATS,
          security:
            (flags.csrfAdded ? 20 : 0) +
            (flags.sessionChecked ? 15 : 0) +
            (flags.originLocked ? 30 : 0) +
            (flags.domCleaned ? 25 : 0),
        })

  const normalized = {
    ...state,
    statsVersion: 2,
    stats: migratedStats,
    completedTasks: Array.isArray(state?.completedTasks) ? state.completedTasks : [],
    missionTasks: Array.isArray(state?.missionTasks) ? state.missionTasks : [],
    serverLogs: Array.isArray(state?.serverLogs) ? state.serverLogs : [],
    activityLog: Array.isArray(state?.activityLog) ? state.activityLog : [],
    notifications: Array.isArray(state?.notifications) ? state.notifications : [],
    flags,
    formFields: {
      name: '',
      message: '',
      csrfToken: null,
      hiddenExtras: [],
      ...(state?.formFields ?? {}),
    },
  }

  if (migratedStats.lives <= 0 && normalized.screen !== SCREENS.ENDING) {
    return {
      ...normalized,
      screen: SCREENS.ENDING,
      dayPhase: 'done',
      uiPanel: null,
      ending: 'out_of_lives',
    }
  }

  return normalized
}
