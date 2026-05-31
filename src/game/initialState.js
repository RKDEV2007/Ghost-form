import { DEFAULT_STATS, SCREENS } from './constants'

export function createInitialState() {
  return {
    screen: SCREENS.TITLE,
    currentDay: 1,
    dayPhase: 'intro',
    dialogueIndex: 0,
    activeView: 'form',
    statsVersion: 2,
    stats: { ...DEFAULT_STATS },
    missionTasks: [],
    completedTasks: [],
    activityLog: [],
    serverLogs: [],
    formFields: {
      name: '',
      message: '',
      csrfToken: null,
      hiddenExtras: [],
    },
    flags: {
      csrfAdded: false,
      sessionChecked: false,
      originLocked: false,
      domCleaned: false,
      finalChoice: null,
    },
    introBubble: 0,
    titleLoading: false,
    titleProgress: 0,
    ghostBlocked: false,
    ending: null,
    username: 'ADMIN_main_404',
    introComplete: false,
    guideStep: 0,
    notifications: [],
    uiPanel: null,
    tutorialSeen: false,
    tutorialStep: 0,
    instructionSeen: false,
  }
}
