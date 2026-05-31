import { useCallback, useRef } from 'react'
import { useGame } from '../game/useGame'
import { getDayConfig } from '../game/days'
import { SCREENS } from '../game/constants'
import { tryAdvanceGuide, isGuideDone, getCurrentGuide } from '../game/guides'
import { applyStatEvent, applyLogStats } from '../game/stats'
import background from '../assets/background.png'
import chloeNeutral from '../assets/chloe1.png'
import chloeDim from '../assets/chloe2.png'
import chloeSad from '../assets/chloe3.png'
import avatar from '../assets/avatar.png'
import { GameHeader } from './GameHeader'
import { Sidebar } from './Sidebar'
import { DialogueBox } from './DialogueBox'
import { MissionPanel } from './MissionPanel'
import { Workspace } from './Workspace'
import { MiniGameComplete } from './MiniGameComplete'
import { SettingsModal } from './SettingsModal'
import { NotificationsPanel } from './NotificationsPanel'
import { TutorialModal } from './TutorialModal'
import { markAllRead } from '../game/notifications'
import { unreadCount, addNotification } from '../game/notifications'

const TUTORIAL_STEPS = {
  1: { view: 'log',     hint: 'Открой вкладку ЛОГИ — здесь появляются все серверные запросы' },
  2: { view: 'inspect', hint: 'Отлично! Теперь открой БРАУЗЕР (INSPECT) — тут можно редактировать код' },
  3: { view: 'form',    hint: 'Хорошо! Открой ГЛАВНАЯ (ФОРМА) — здесь находятся формы ввода' },
  4: { view: null,      hint: 'Последнее задание: напиши простую форму в INSPECT и нажми «Проверить»' },
}

function pickChloeSprite(dialogue, speakerYou) {
  if (speakerYou) return { src: chloeDim, dimmed: true }
  if (dialogue?.mood === 'sad') return { src: chloeSad, dimmed: false }
  return { src: chloeNeutral, dimmed: false }
}

export function GameScreen() {
  const { state, setState } = useGame()
  const day = getDayConfig(state.currentDay)
  const dialogues = day.introDialogues ?? []
  const currentLine = dialogues[state.dialogueIndex]
  const speakerYou = currentLine?.speaker === 'you'
  const chloe = pickChloeSprite(currentLine, speakerYou)
  const inIntro = state.dayPhase === 'intro'
  const inPlay = state.dayPhase === 'play' || state.dayPhase === 'mini'
  const guideHighlight = getCurrentGuide(state)?.highlight
  const uiPanel = state.uiPanel
  const notifUnread = unreadCount(state)
  const tabSwitchRef = useRef({ count: 0, ts: 0 })

  const showTutorial = state.currentDay === 1 && !state.tutorialSeen && state.dayPhase === 'intro'
  const tutorialStep = state.tutorialStep ?? 0
  const inTutorialGuide = tutorialStep >= 1 && tutorialStep <= 4
  const tutorialDone = state.currentDay === 1 && tutorialStep >= 5
  const tutorialHint = inTutorialGuide ? TUTORIAL_STEPS[tutorialStep]?.hint : null
  const showWorkspace = inPlay || inTutorialGuide

  const reportGuide = useCallback(
    (action) => {
      setState((s) => tryAdvanceGuide(s, action))
    },
    [setState],
  )

  const setView = useCallback(
    (view) => {
      setState((s) => {
        let next = { ...s, activeView: view }

        // advance tutorial interactive guide
        if (s.tutorialStep > 0 && s.tutorialStep <= 3) {
          const expected = TUTORIAL_STEPS[s.tutorialStep]?.view
          if (view === expected) {
            const nextStep = s.tutorialStep + 1
            // step 4 = inspect code task, auto-switch to inspect
            if (nextStep === 4) {
              return { ...next, tutorialStep: nextStep, activeView: 'inspect' }
            }
            return { ...next, tutorialStep: nextStep }
          }
          return next
        }

        if (view !== s.activeView && (s.dayPhase === 'play' || s.dayPhase === 'mini')) {
          const now = Date.now()
          if (now - tabSwitchRef.current.ts > 12000) {
            tabSwitchRef.current = { count: 0, ts: now }
          }
          tabSwitchRef.current.count += 1
          if (tabSwitchRef.current.count >= 5) {
            next = applyStatEvent(next, 'tab_overload')
            tabSwitchRef.current = { count: 0, ts: now }
          }
        }

        if (view === 'log') {
          next = tryAdvanceGuide(next, 'view_log')
          if (next.serverLogs.some((l) => l.ghost && l.status === 'accepted')) {
            next = tryAdvanceGuide(next, 'saw_ghost_log')
          }
          if (next.serverLogs.some((l) => String(l.status).includes('blocked'))) {
            next = tryAdvanceGuide(next, 'saw_blocked_log')
            if (isGuideDone(next)) next.dayPhase = 'complete'
          }
        }
        if (view === 'form') next = tryAdvanceGuide(next, 'view_form')
        if (view === 'inspect') next = tryAdvanceGuide(next, 'view_inspect')
        return next
      })
    },
    [setState],
  )

  const advanceDialogue = () => {
    if (state.dialogueIndex < dialogues.length - 1) {
      setState({ dialogueIndex: state.dialogueIndex + 1 })
    } else {
      setState((s) => ({
        ...s,
        introComplete: true,
        ...addNotification(s, 'Диалог дня ' + state.currentDay + ' завершён', 'info'),
      }))
      reportGuide('dialogues_done')
    }
  }

  const startMission = () => {
    setState((s) => {
      let next = {
        ...s,
        dayPhase: 'play',
        activeView: 'log',
        missionTasks: day.tasks,
        serverLogs:
          s.currentDay === 1 ? s.serverLogs : [...(day.ghostLogs ?? []), ...s.serverLogs],
        formFields:
          s.currentDay === 4
            ? { ...s.formFields, message: 'i am still here' }
            : s.formFields,
      }
      if (s.currentDay >= 2) {
        next = applyLogStats(next, day.ghostLogs ?? [])
      }
      if (s.currentDay === 4) {
        next = applyStatEvent(next, 'dom_corrupted')
      }
      next = tryAdvanceGuide(next, 'mission_start')
      next = tryAdvanceGuide(next, 'view_log')
      return next
    })
  }

  const onMiniComplete = useCallback(
    (miniId) => {
      const map = {
        'add-csrf': 'csrf_added',
        'session-check': 'session_checked',
        'origin-trap': 'origin_locked',
        'dom-cleaned': 'dom_cleaned',
      }
      setState((s) => {
        let next = tryAdvanceGuide(s, map[miniId] ?? '')
        if (miniId === 'add-csrf') {
          setTimeout(() => setState((x) => ({ ...x, activeView: 'log' })), 150)
        }
        if (isGuideDone(next)) {
          next = { ...next, completedTasks: day.tasks, dayPhase: 'complete' }
        }
        return next
      })
    },
    [day.tasks, setState],
  )

  const nextDay = () => {
    if (state.currentDay >= 5) {
      setState({ dayPhase: 'final', activeView: 'form' })
      return
    }
    const n = state.currentDay + 1
    const cfg = getDayConfig(n)
    setState({
      currentDay: n,
      dayPhase: 'intro',
      dialogueIndex: 0,
      introComplete: false,
      guideStep: 0,
      tutorialStep: 0,
      activeView: 'log',
      missionTasks: cfg.tasks,
      completedTasks: [],
      serverLogs: [],
    })
  }

  const finalChoice = (choice) => {
    const statMap = {
      delete: 'final_delete',
      contain: 'final_contain',
      negotiate: 'final_negotiate',
    }
    setState((s) => {
      const guided = tryAdvanceGuide(s, 'final_choice')
      const next = applyStatEvent(guided, statMap[choice] ?? 'final_contain')
      return {
        ...next,
        completedTasks: day.tasks,
        flags: { ...next.flags, finalChoice: choice },
        screen: SCREENS.ENDING,
        dayPhase: 'done',
      }
    })
  }

  return (
    <div className="game-screen" data-guide-highlight={guideHighlight || ''}>
      <GameHeader
        day={state.currentDay}
        stats={state.stats}
        unreadCount={notifUnread}
        onNotifications={() => setState({ uiPanel: 'notifications' })}
        onSettings={() => setState({ uiPanel: 'settings' })}
      />
      <div className="game-body">
        <Sidebar
          activeView={state.activeView}
          inPlay={inPlay}
          stats={state.stats}
          username={state.username}
          avatarSrc={avatar}
          notifCount={notifUnread}
          onViewChange={setView}
          tutorialStep={tutorialStep}
        />

        <main className={`game-center ${showWorkspace ? 'has-workspace' : 'vn-only'}`}>
          <div className="scene" style={{ backgroundImage: `url(${background})` }}>
            <img
              src={chloe.src}
              alt="Хлоя"
              className={`character ${chloe.dimmed ? 'dimmed' : ''}`}
            />
            {inIntro && currentLine && !showTutorial && !inTutorialGuide && (
              <DialogueBox
                key={`${state.currentDay}-${state.dialogueIndex}`}
                dialogue={currentLine}
                onComplete={advanceDialogue}
              />
            )}
          </div>

          {showWorkspace && (
            <Workspace
              activeView={state.activeView}
              onTabChange={setView}
              serverLogs={state.serverLogs}
              currentDay={state.currentDay}
              dayPhase={state.dayPhase}
              onMiniComplete={onMiniComplete}
              onGhostSeen={() => reportGuide('saw_ghost_log')}
              onBlockedSeen={() => {
                setState((s) => {
                  const next = tryAdvanceGuide(s, 'saw_blocked_log')
                  return isGuideDone(next)
                    ? { ...next, completedTasks: day.tasks, dayPhase: 'complete' }
                    : next
                })
              }}
              onFinalChoice={finalChoice}
              onFinalMistake={() => setState((s) => applyStatEvent(s, 'mistake'))}
              tutorialStep={tutorialStep}
              onTutorialInspectDone={() => setState({ tutorialStep: 5 })}
            />
          )}
        </main>

        <MissionPanel
          day={state.currentDay}
          tasks={state.missionTasks.length ? state.missionTasks : day.tasks}
          completed={state.completedTasks}
          phase={state.dayPhase}
          dialoguesDone={state.introComplete}
          activityItems={state.activityLog.length ? state.activityLog : day.activity}
          onStart={startMission}
          guideState={inPlay ? state : null}
        />
      </div>

      {uiPanel === 'settings' && (
        <SettingsModal onClose={() => setState({ uiPanel: null })} />
      )}
      {uiPanel === 'notifications' && (
        <NotificationsPanel
          notifications={state.notifications ?? []}
          onClose={() => setState({ uiPanel: null })}
          onMarkRead={() =>
            setState((s) => {
              const hadUnread = unreadCount(s) > 0
              let next = markAllRead(s)
              return hadUnread ? applyStatEvent(next, 'notifications_cleared') : next
            })
          }
        />
      )}

      {state.dayPhase === 'complete' && (
        <MiniGameComplete
          message={day.miniGame?.successMessage}
          onNextDay={nextDay}
          isLast={state.currentDay >= 5}
        />
      )}

      {showTutorial && (
        <TutorialModal
          onStart={() =>
            setState({ tutorialSeen: true, tutorialStep: 1, activeView: 'log' })
          }
        />
      )}

      {inTutorialGuide && tutorialHint && (
        <div className="tutorial-hint-bar">
          <span className="tutorial-hint-step">{tutorialStep}/4</span>
          <span className="tutorial-hint-text">{tutorialHint}</span>
        </div>
      )}

      {tutorialDone && state.dayPhase === 'intro' && (
        <div className="tutorial-done-badge">
          Отлично! Ты знаешь интерфейс. Читай диалог Хлои наверху и жми <strong>СТАРТ!</strong>
        </div>
      )}
    </div>
  )
}
