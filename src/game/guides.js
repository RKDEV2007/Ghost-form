export const GUIDES = {
  1: [
    {
      id: 'd1-intro',
      title: 'Шаг 1 · Диалог',
      text: 'Пролистай все реплики Хлои. Жми зелёную стрелку → внизу.',
      completeOn: 'dialogues_done',
      highlight: 'dialogue',
    },
    {
      id: 'd1-start',
      title: 'Шаг 2 · Старт',
      text: 'Нажми розовую кнопку **СТАРТ!** справа — откроется рабочая панель.',
      completeOn: 'mission_start',
      highlight: 'start-btn',
    },
    {
      id: 'd1-logs',
      title: 'Шаг 3 · Консоль',
      text: 'Слева выбери **ЛОГИ**. Внизу появится SERVER LOG — смотри POST-запросы.',
      completeOn: 'view_log',
      highlight: 'nav-logs',
    },
    {
      id: 'd1-read-log',
      title: 'Шаг 4 · Аномалия',
      text: 'В консоли найди: POST /submit_form, name: "—", message: "—". Форма ушла сама.',
      completeOn: 'saw_ghost_log',
      highlight: 'console',
      completesTask: 'Посмотреть ghost POST в логах',
    },
    {
      id: 'd1-form',
      title: 'Шаг 5 · Форма',
      text: 'Вкладка **FORM** внизу. Поля name и message — пока не трогай, только смотри.',
      completeOn: 'view_form',
      highlight: 'tab-form',
      completesTask: 'Открыть FORM и убедиться, что CSRF нет',
    },
    {
      id: 'd1-inspect',
      title: 'Шаг 6 · Inspect',
      text: 'Вкладка **INSPECT** — HTML формы. Ищи, где нет csrf.',
      completeOn: 'view_inspect',
      highlight: 'tab-inspect',
    },
    {
      id: 'd1-csrf',
      title: 'Шаг 7 · Напиши токен',
      text: 'В редакторе INSPECT сам добавь hidden input с csrf_token. Потом нажми **Проверить код**.',
      completeOn: 'csrf_added',
      highlight: 'btn-csrf',
      inputHint: '<input type="hidden" name="csrf_token" value="sess_a8f3...">',
      completesTask: 'В INSPECT самому написать hidden csrf_token',
    },
    {
      id: 'd1-verify',
      title: 'Шаг 8 · Проверка',
      text: 'Снова **ЛОГИ**. Новый ghost POST должен быть: status: blocked (no csrf)',
      completeOn: 'saw_blocked_log',
      highlight: 'nav-logs',
      completesTask: 'Проверить, что Ghost POST теперь blocked',
    },
  ],
  2: [
    { id: 'd2-intro', title: 'Шаг 1 · Диалог', text: 'Дочитай реплики. Жми стрелку, пока не появится **СТАРТ!**.', completeOn: 'dialogues_done', highlight: 'dialogue' },
    { id: 'd2-start', title: 'Шаг 2 · Логи', text: 'Нажми **СТАРТ!**. В логах найди ghost_user и его session_id.', completeOn: 'mission_start', highlight: 'start-btn' },
    { id: 'd2-inspect', title: 'Шаг 3 · Напиши вывод', text: 'Открой **INSPECT** и впиши в код ghost_user + точный session_id. Ошибка снимет сердце.', completeOn: 'session_checked', highlight: 'console' },
  ],
  3: [
    { id: 'd3-intro', title: 'Шаг 1 · Диалог', text: 'Дочитай объяснение про внешний origin, потом нажми **СТАРТ!**.', completeOn: 'dialogues_done', highlight: 'dialogue' },
    { id: 'd3-protect', title: 'Шаг 2 · Конфиг', text: 'В **INSPECT** сам заполни конфиг: fake-site.net в блоклист, SameSite, Origin check и Token rotation = true.', completeOn: 'origin_locked', highlight: 'console' },
  ],
  4: [
    { id: 'd4-intro', title: 'Шаг 1 · Диалог', text: 'Дочитай про DOM corruption. Потом нажми **СТАРТ!**.', completeOn: 'dialogues_done', highlight: 'dialogue' },
    { id: 'd4-clean', title: 'Шаг 2 · Чистка DOM', text: 'В **INSPECT** удали ghost_payload, iframe и ghost://inject. Вместо комментария вставь `<input type="hidden" name="csrf_token" value="dom_snapshot_v4" />`.', completeOn: 'dom_cleaned', highlight: 'console' },
  ],
  5: [
    { id: 'd5-intro', title: 'Шаг 1 · Финал', text: 'Дочитай финальный диалог и нажми **СТАРТ!**.', completeOn: 'dialogues_done', highlight: 'dialogue' },
    { id: 'd5-choice', title: 'Шаг 2 · Решение', text: 'В центральной консоли напиши стратегию и токен: `contain --token=form_engine_lock_5`. Можно заменить contain на delete или negotiate.', completeOn: 'final_choice', highlight: 'final-choice' },
  ],
}

export function getGuideSteps(day) {
  return GUIDES[day] ?? []
}

export function getCurrentGuide(state) {
  return getGuideSteps(state.currentDay)[state.guideStep] ?? null
}

export function tryAdvanceGuide(state, action) {
  const steps = getGuideSteps(state.currentDay)
  const current = steps[state.guideStep]
  if (!current || current.completeOn !== action) return state
  const patch = { guideStep: state.guideStep + 1 }
  if (current.completesTask && !state.completedTasks.includes(current.completesTask)) {
    patch.completedTasks = [...state.completedTasks, current.completesTask]
  }
  return { ...state, ...patch }
}

export function isGuideDone(state) {
  return state.guideStep >= getGuideSteps(state.currentDay).length
}
