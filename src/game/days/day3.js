export const day3 = {
  id: 3,
  title: 'Поддельные сайты',
  missionTitle: 'День 3 — Ловушка форм',
  missionDesc: 'Токен валидный, но origin подозрительный. Напиши конфиг защиты: блоклист, SameSite, Origin check и rotation.',
  tasks: [
    'Проанализировать origin в логах',
    'Вписать fake-site.net в blockOrigins',
    'Поставить SameSite, Origin check и tokenRotation в true',
  ],
  introDialogues: [
    { speaker: 'chloe', text: 'твой токен не одноразовый' },
    { speaker: 'you', text: 'он же случайный' },
    { speaker: 'chloe', text: 'да, но не привязан к действию' },
  ],
  miniGame: {
    id: 'origin-trap',
    title: 'Ловушка форм',
    hint: 'Заблокируй подозрительные домены и включи все три защиты.',
    successMessage: 'Ghost начинает терять доступ',
  },
  ghostLogs: [
    {
      method: 'POST',
      path: '/submit_form',
      origin: 'fake-site.net',
      referrer: 'your-old-page.html',
      csrf: 'VALID',
      status: 'accepted',
      ghost: true,
    },
  ],
  activity: ['origin: fake-site.net', 'csrf: VALID (stolen?)'],
}
