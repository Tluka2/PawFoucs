import { ref, watch, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import type { AnimationName } from '@/assets/pets/sprites/types'
import type { PetType } from '@/types/pet'

interface AnimCfg { frameCount: number; fps: number; duration: number; loop?: boolean }

const DOG_ANIM: Record<AnimationName, AnimCfg> = {
  idle:   { frameCount: 2, fps: 1.25, duration: 0 },
  walk:   { frameCount: 4, fps: 1.5, duration: 4000 },
  roll:   { frameCount: 6, fps: 2, duration: 3000 },
  beg:    { frameCount: 2, fps: 1, duration: 4000 },
  sleep:  { frameCount: 2, fps: 0.4, duration: 0 },
  shake:  { frameCount: 3, fps: 2, duration: 2000 },
  drink:  { frameCount: 2, fps: 1, duration: 4000 },
  bark:   { frameCount: 2, fps: 1.5, duration: 1500 },
}

const CAT_ANIM: Record<AnimationName, AnimCfg> = {
  idle:   { frameCount: 2, fps: 1.25, duration: 0 },
  walk:   { frameCount: 4, fps: 1.5, duration: 4000 },
  roll:   { frameCount: 4, fps: 1, duration: 5000, loop: false },
  beg:    { frameCount: 2, fps: 1, duration: 4000 },
  sleep:  { frameCount: 2, fps: 0.4, duration: 0 },
  shake:  { frameCount: 2, fps: 2, duration: 2000 },
  drink:  { frameCount: 2, fps: 1, duration: 4000 },
  bark:   { frameCount: 2, fps: 1.5, duration: 1500 },
}

const PET_ANIM: Record<PetType, Record<AnimationName, AnimCfg>> = {
  dog: DOG_ANIM,
  cat: CAT_ANIM,
}

// Per-pet idle random action pools
const IDLE_ACTIONS: Record<PetType, AnimationName[]> = {
  dog: ['shake', 'beg', 'roll'],
  cat: ['shake', 'beg'],   // shake=舔毛, beg=伸懒腰(Stretch)
}

// Per-pet click interaction pools
const CLICK_ACTIONS: Record<PetType, AnimationName[]> = {
  dog: ['beg', 'bark', 'roll'],
  cat: ['beg', 'bark', 'roll'],  // beg=伸懒腰, bark=meow, roll=打滚
}

export function usePetAnimation(petType: Ref<PetType> | PetType = 'dog') {
  const resolvedType = typeof petType === 'string' ? { value: petType } as Ref<PetType> : petType
  const currentState = ref<AnimationName>('idle')
  const currentFrame = ref(0)

  let frameTimer: ReturnType<typeof setInterval> | null = null
  const timers: ReturnType<typeof setTimeout>[] = []
  let timeCheckTimer: ReturnType<typeof setInterval> | null = null

  function isSleepTime(): boolean {
    const hour = new Date().getHours()
    return hour >= 22 || hour < 6
  }

  function clearAllTimers() {
    timers.forEach(t => clearTimeout(t))
    timers.length = 0
  }

  function removeTimer(id: ReturnType<typeof setTimeout>) {
    const idx = timers.indexOf(id)
    if (idx !== -1) timers.splice(idx, 1)
  }

  function startFrameCycling() {
    stopFrameCycling()
    const config = PET_ANIM[resolvedType.value][currentState.value]
    if (!config) return
    currentFrame.value = 0
    const interval = 1000 / config.fps
    frameTimer = setInterval(() => {
      const next = currentFrame.value + 1
      if (next >= config.frameCount) {
        if (config.loop === false) {
          currentFrame.value = config.frameCount - 1
          stopFrameCycling()
          return
        }
        currentFrame.value = 0
      } else {
        currentFrame.value = next
      }
    }, interval)
  }

  // Restart cycling when pet type changes
  watch(resolvedType, () => {
    startFrameCycling()
  })

  function stopFrameCycling() {
    if (frameTimer) {
      clearInterval(frameTimer)
      frameTimer = null
    }
  }

  function switchState(state: AnimationName) {
    currentState.value = state
    startFrameCycling()
  }

  function scheduleRandomAction() {
    const delay = 8000 + Math.random() * 7000
    const id = setTimeout(() => {
      removeTimer(id)
      if (currentState.value === 'idle') {
        const pool = IDLE_ACTIONS[resolvedType.value]
        const action = pool[Math.floor(Math.random() * pool.length)]
        switchState(action)

        const dur = PET_ANIM[resolvedType.value][action].duration
        if (dur > 0) {
          const innerId = setTimeout(() => {
            removeTimer(innerId)
            if (currentState.value !== 'sleep') {
              switchState('idle')
              scheduleRandomAction()
            }
          }, dur)
          timers.push(innerId)
        }
      } else {
        scheduleRandomAction()
      }
    }, delay)
    timers.push(id)
  }

  function triggerClick() {
    if (currentState.value === 'sleep') {
      switchState('idle')
      scheduleRandomAction()
    } else {
      const pool = CLICK_ACTIONS[resolvedType.value]
      const action = pool[Math.floor(Math.random() * pool.length)]
      switchState(action)
      const id = setTimeout(() => {
        removeTimer(id)
        if (currentState.value === action) {
          switchState('idle')
          scheduleRandomAction()
        }
      }, PET_ANIM[resolvedType.value][action].duration)
      timers.push(id)
    }
  }

  function checkSleepTime() {
    const sleeping = isSleepTime()
    if (sleeping && currentState.value !== 'sleep') {
      clearAllTimers()
      switchState('sleep')
    } else if (!sleeping && currentState.value === 'sleep') {
      switchState('idle')
      scheduleRandomAction()
    }
  }

  onMounted(() => {
    checkSleepTime()
    startFrameCycling()
    if (!isSleepTime()) {
      scheduleRandomAction()
    }
    timeCheckTimer = setInterval(checkSleepTime, 60000)
  })

  onUnmounted(() => {
    stopFrameCycling()
    clearAllTimers()
    if (timeCheckTimer) clearInterval(timeCheckTimer)
  })

  function playAnimation(state: AnimationName) {
    clearAllTimers()
    switchState(state)
    const dur = PET_ANIM[resolvedType.value][state].duration
    if (dur > 0) {
      const id = setTimeout(() => {
        removeTimer(id)
        if (currentState.value === state) {
          switchState('idle')
          scheduleRandomAction()
        }
      }, dur)
      timers.push(id)
    }
  }

  return {
    currentState,
    currentFrame,
    triggerClick,
    playAnimation,
  }
}
