export const day2 = {
  id: 2,
  title: 'Ghost User',
  missionTitle: 'День 2 — Ghost User',
  missionDesc: 'CSRF уже есть, но ghost_user пишет через твою сессию. В INSPECT надо руками выписать user и session_id.',
  tasks: ['Найти ghost_user в логах', 'Скопировать session_id из cookies', 'Написать вывод в INSPECT и проверить код'],
  introDialogues: [
    { speaker: 'chloe', text: 'это не обход формы', mood: 'sad' },
    { speaker: 'you', text: 'а что тогда?' },
    { speaker: 'chloe', text: 'когда не закрыл вкладку....', mood: 'sad' },
    { speaker: 'chloe', text: 'он использует твою сессию', mood: 'sad' },
  ],
  miniGame: { id: 'session-check', successMessage: 'Session hijack подтверждён' },
  ghostLogs: [
    { method: 'POST', path: '/submit_form', csrf: 'VALID', user: 'ghost_user', message: 'ты изменил форму', status: 'accepted', ghost: true },
    { method: 'POST', path: '/submit_form', csrf: 'VALID', user: 'ghost_user', message: 'но я всё ещё могу писать', status: 'accepted', ghost: true },
  ],
  activity: ['ghost_user активен', 'session_id совпадает'],
}
