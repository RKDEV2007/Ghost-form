export const day4 = {
  id: 4,
  title: 'Форма живая',
  missionTitle: 'День 4 — DOM cleanup',
  missionDesc: 'Ghost переписывает форму перед отправкой. Удали injected DOM и вставь строку: <input type="hidden" name="csrf_token" value="dom_snapshot_v4" />',
  tasks: [
    'Найти ghost_payload и iframe',
    'Удалить injected DOM из редактора',
    'Вставить <input type="hidden" name="csrf_token" value="dom_snapshot_v4" />',
  ],
  introDialogues: [
    { speaker: 'chloe', text: 'он начал переписывать DOM' },
    { speaker: 'you', text: 'как вирус?' },
    { speaker: 'chloe', text: 'как привычка' },
  ],
  miniGame: {
    id: 'dom-cleanup',
    title: 'DOM cleanup',
    hint: 'Удали все injected поля и восстанови оригинальную разметку.',
    successMessage: 'Форма снова нестабильна — но под контролем',
  },
  domInjected: true,
  ghostLogs: [
    {
      action: '/submit_form',
      modified_by: 'unknown script',
      iframe: 'injected',
      required_token: 'dom_snapshot_v4',
      message: 'я улучшаю форму для тебя',
      status: 'pending',
      ghost: true,
    },
  ],
  activity: ['DOM modified_by: unknown', 'iframe source injected', 'token: dom_snapshot_v4'],
}
