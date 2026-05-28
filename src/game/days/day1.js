export const day1 = {
  id: 1,
  title: 'Пустая форма',
  missionTitle: 'День 1 — Пустая форма',
  missionDesc: `На сайте есть форма обратной связи: имя, сообщение, кнопка «отправить». Ты ничего не вводил — но в логах уже есть POST. Пустые поля, статус accepted.

Хлоя говорит: проблема может быть в отсутствии CSRF. Пока токена нет, любой сайт может нажать send за тебя.`,
  tasks: [
    'Посмотреть ghost POST в логах',
    'Открыть FORM и убедиться, что CSRF нет',
    'В INSPECT самому написать hidden csrf_token',
    'Проверить, что Ghost POST теперь blocked',
  ],
  introDialogues: [
    { speaker: 'chloe', text: 'у тебя вообще есть csrf?', mood: 'neutral' },
    { speaker: 'you', text: 'и?' },
    { speaker: 'chloe', text: 'значит любой сайт может нажать «send» за тебя', mood: 'neutral' },
  ],
  miniGame: {
    id: 'add-csrf',
    title: 'Добавь защиту',
    successMessage: 'Ghost submit заблокирован: status blocked (no csrf)',
  },
  ghostLogs: [
    { method: 'POST', path: '/submit_form', name: '—', message: '—', status: 'accepted', ghost: true },
  ],
  activity: ['Подозрительный POST', 'CSRF тоже отсутствует', 'Подозрительный POST'],
}
