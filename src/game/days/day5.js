export const day5 = {
  id: 5,
  title: 'Ghost Form',
  missionTitle: 'День 5 — Kill or Contain',
  missionDesc: 'Ghost — не пользователь. Это процесс отправки. Напиши финальную команду и вставь токен: form_engine_lock_5.',
  tasks: [
    'Прочитать лог FORM ENGINE',
    'Понять: actor merged with system',
    'Вставить токен form_engine_lock_5 в финальную команду',
  ],
  introDialogues: [
    { speaker: 'ghost', text: 'i am not inside the form\ni am the form' },
    { speaker: 'chloe', text: 'он перестал быть пользователем' },
    { speaker: 'you', text: 'тогда что он?' },
    { speaker: 'chloe', text: 'процесс отправки' },
  ],
  miniGame: {
    id: 'final-choice',
    title: 'Kill or Contain',
    hint: 'Выбери финальную стратегию. NEGOTIATE — секретная концовка.',
    successMessage: 'Финал разблокирован',
  },
  ghostLogs: [
    {
      method: 'POST',
      path: '/submit_form',
      source: 'FORM ENGINE',
      actor: 'ghost_user (merged with system)',
      required_token: 'form_engine_lock_5',
      status: 'autonomous',
      ghost: true,
    },
  ],
  activity: ['source: FORM ENGINE', 'actor: ghost_user + system', 'token: form_engine_lock_5'],
  endings: {
    delete: {
      id: 'bad',
      title: 'BAD END',
      status: 'compromised',
      desc: 'Endpoint удалён. Сайт сломан. Формы автономны.',
    },
    contain: {
      id: 'good',
      title: 'GOOD END',
      status: 'secure',
      desc: 'Ghost неактивен. Форма стабильна. Защита держится.',
    },
    negotiate: {
      id: 'secret',
      title: 'SECRET END',
      status: 'cooperative',
      desc: '«i will only submit what is allowed»',
    },
    out_of_lives: {
      id: 'bad',
      title: 'GAME OVER',
      status: 'failed',
      desc: 'Сердца закончились. Ghost Form перехватил поток отправки.',
    },
  },
}
