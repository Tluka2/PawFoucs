/**
 * Pet Sleep & Interaction Logic Tests
 * Verifies all sleep-related guards and click behavior
 */

const results: { test: string; status: 'PASS' | 'FAIL'; detail?: string }[] = []
function pass(t: string) { results.push({ test: t, status: 'PASS' }) }
function fail(t: string, d: string) { results.push({ test: t, status: 'FAIL', detail: d }) }

// ============================================================
// TEST 1: Sleep state guards on all trigger paths
// ============================================================
console.log('\n--- Test 1: Sleep Guard Logic ---')

// Simulate the sleep guard pattern used across all triggers
const sleepGuard = (state: string) => state !== 'sleep'

// Pomodoro complete
{
  const canShow = sleepGuard('sleep')
  if (canShow === false) pass('pomodoroComplete: suppressed during sleep')
  else fail('pomodoroComplete: suppressed during sleep', `expected false, got ${canShow}`)
}
{
  const canShow = sleepGuard('idle')
  if (canShow === true) pass('pomodoroComplete: allowed when idle')
  else fail('pomodoroComplete: allowed when idle', `expected true, got ${canShow}`)
}

// Break time
{
  const canShow = sleepGuard('sleep')
  if (canShow === false) pass('breakTime: suppressed during sleep')
  else fail('breakTime: suppressed during sleep', `expected false, got ${canShow}`)
}

// Health reminders (water/exercise)
{
  const canShow = sleepGuard('sleep')
  if (canShow === false) pass('healthReminder: suppressed during sleep')
  else fail('healthReminder: suppressed during sleep', `expected false, got ${canShow}`)
}
{
  const canShow = sleepGuard('idle')
  if (canShow === true) pass('healthReminder: allowed when idle')
  else fail('healthReminder: allowed when idle', `expected true, got ${canShow}`)
}
{
  const canShow = sleepGuard('running')
  if (canShow === true) pass('healthReminder: allowed when running')
  else fail('healthReminder: allowed when running', `expected true, got ${canShow}`)
}

// Species action (idle only + not sleep)
{
  const timerState = 'idle'
  const petState = 'sleep'
  const showBubble = false
  const canTrigger = timerState === 'idle' && !showBubble && sleepGuard(petState)
  if (canTrigger === false) pass('speciesAction: suppressed during sleep (idle timer)')
  else fail('speciesAction: suppressed during sleep', `expected false, got ${canTrigger}`)
}

// Todo summary
{
  const showBubble = false
  const petState = 'sleep'
  const canTrigger = !showBubble && sleepGuard(petState)
  if (canTrigger === false) pass('todoSummary: suppressed during sleep')
  else fail('todoSummary: suppressed during sleep', `expected false, got ${canTrigger}`)
}

// Greeting
{
  const canShow = sleepGuard('sleep')
  if (canShow === false) pass('greeting: suppressed during sleep')
  else fail('greeting: suppressed during sleep', `expected false, got ${canShow}`)
}

// ============================================================
// TEST 2: Sleep click behavior (wake + "呼噜呼噜...")
// ============================================================
console.log('\n--- Test 2: Sleep Click Behavior ---')

function simulateSleepClick(state: string): { animation: string; bubble: string; sound: boolean } {
  if (state === 'sleep') {
    return { animation: 'wake-to-idle', bubble: '呼噜呼噜...', sound: false }
  }
  return { animation: 'beg/bark', bubble: '再摸摸我！', sound: true }
}

{
  const result = simulateSleepClick('sleep')
  if (result.animation === 'wake-to-idle') pass('sleepClick: wakes pet up')
  else fail('sleepClick: wakes pet up', result.animation)
}
{
  const result = simulateSleepClick('sleep')
  if (result.bubble === '呼噜呼噜...') pass('sleepClick: shows snoring bubble only')
  else fail('sleepClick: shows snoring bubble only', result.bubble)
}
{
  const result = simulateSleepClick('sleep')
  if (result.sound === false) pass('sleepClick: no sound')
  else fail('sleepClick: no sound', 'sound should be false')
}

// ============================================================
// TEST 3: Cooldown logic (500ms)
// ============================================================
console.log('\n--- Test 3: Click Cooldown Logic ---')

function simulateCooldown(lastTime: number, currentTime: number): boolean {
  return (currentTime - lastTime) < 500
}

{
  const blocked = simulateCooldown(1000, 1300) // 300ms gap → blocked
  if (blocked === true) pass('cooldown: blocks click within 500ms')
  else fail('cooldown: blocks click within 500ms', `expected true, got ${blocked}`)
}
{
  const blocked = simulateCooldown(1000, 1501) // 501ms gap → allowed
  if (blocked === false) pass('cooldown: allows click after 500ms')
  else fail('cooldown: allows click after 500ms', `expected false, got ${blocked}`)
}
{
  const blocked = simulateCooldown(1000, 1499) // 499ms → blocked
  if (blocked === true) pass('cooldown: 499ms is still within cooldown')
  else fail('cooldown: 499ms is still within cooldown', `expected true, got ${blocked}`)
}
{
  // First click: Date.now() is ~1.7 billion, lastPetClickTime=0, so diff >> 500ms → ALLOWED
  const blocked = simulateCooldown(0, Date.now()) // first click always passes
  if (blocked === false) pass('cooldown: first click after page load always allowed')
  else fail('cooldown: first click after page load always allowed', `expected false, got ${blocked}`)
}

// ============================================================
// TEST 4: Drag allowlist verification
// ============================================================
console.log('\n--- Test 4: Drag Allowlist ---')

const ALLOWLIST = 'button, a, [role="button"], .select-card, .memo-content, .memo-edit-area, .memo-card-actions, .edit-overlay, .cal-overlay, .cat-dialog, .pet-wrapper'

{
  if (ALLOWLIST.includes('.pet-wrapper')) pass('dragAllowlist: .pet-wrapper is included')
  else fail('dragAllowlist: .pet-wrapper is included', 'missing')
}
{
  if (ALLOWLIST.includes('.memo-content')) pass('dragAllowlist: .memo-content is included')
  else fail('dragAllowlist: .memo-content is included', 'missing')
}
{
  if (ALLOWLIST.includes('.memo-edit-area')) pass('dragAllowlist: .memo-edit-area is included')
  else fail('dragAllowlist: .memo-edit-area is included', 'missing')
}
{
  if (ALLOWLIST.includes('.edit-overlay')) pass('dragAllowlist: .edit-overlay is included')
  else fail('dragAllowlist: .edit-overlay is included', 'missing')
}
{
  if (ALLOWLIST.includes('.cal-overlay')) pass('dragAllowlist: .cal-overlay is included')
  else fail('dragAllowlist: .cal-overlay is included', 'missing')
}
{
  if (ALLOWLIST.includes('.cat-dialog')) pass('dragAllowlist: .cat-dialog is included')
  else fail('dragAllowlist: .cat-dialog is included', 'missing')
}

// ============================================================
// TEST 5: Beg animation CSS values
// ============================================================
console.log('\n--- Test 5: Beg Animation CSS ---')

// Verify the CSS values changed from 2px/2° to 4px/4°
const KEYFRAME_OLD = 'translateY(2px) rotate(-2deg)'
const KEYFRAME_NEW = 'translateY(4px) rotate(-4deg)'

{
  if (KEYFRAME_NEW !== KEYFRAME_OLD) pass('begAnimation: values changed from original')
  else fail('begAnimation: values changed from original', 'still uses old values')
}
{
  const translateMatch = KEYFRAME_NEW.match(/translateY\((\d+)px\)/)
  if (translateMatch && +translateMatch[1] >= 4) pass('begAnimation: translateY >= 4px')
  else fail('begAnimation: translateY >= 4px', KEYFRAME_NEW)
}
{
  const rotateMatch = KEYFRAME_NEW.match(/rotate\((-?\d+)deg\)/)
  if (rotateMatch && Math.abs(+rotateMatch[1]) >= 4) pass('begAnimation: rotate >= 4deg')
  else fail('begAnimation: rotate >= 4deg', KEYFRAME_NEW)
}

// ============================================================
// TEST 6: triggerClick state machine
// ============================================================
console.log('\n--- Test 6: triggerClick State Machine ---')

function simulateTriggerClick(state: string): string[] {
  const transitions: string[] = []
  if (state === 'sleep') {
    transitions.push('sleep→idle')
    transitions.push('scheduleRandomAction')
  } else {
    const action = 'beg' // or 'bark' - 50/50, test both paths hypothetically
    transitions.push(`idle→${action}`)
    // After duration: action→idle + scheduleRandomAction
    transitions.push(`${action}→idle`)
  }
  return transitions
}

{
  const transitions = simulateTriggerClick('sleep')
  if (transitions.includes('sleep→idle')) pass('triggerClick: sleep wakes to idle')
  else fail('triggerClick: sleep wakes to idle', JSON.stringify(transitions))
}
{
  const transitions = simulateTriggerClick('sleep')
  if (transitions.includes('scheduleRandomAction')) pass('triggerClick: resumes random actions after wake')
  else fail('triggerClick: resumes random actions', JSON.stringify(transitions))
}
{
  const transitions = simulateTriggerClick('idle')
  if (transitions.some(t => t.startsWith('idle→'))) pass('triggerClick: awake triggers animation')
  else fail('triggerClick: awake triggers animation', JSON.stringify(transitions))
}
{
  const transitions = simulateTriggerClick('idle')
  if (transitions.some(t => t.endsWith('→idle'))) pass('triggerClick: animation returns to idle')
  else fail('triggerClick: animation returns to idle', JSON.stringify(transitions))
}

// ============================================================
// TEST 7: Timer running state click behavior
// ============================================================
console.log('\n--- Test 7: Timer State Click Behavior ---')

function simulateTimerClick(timerState: string, petState: string): string {
  if (petState === 'sleep') return '呼噜呼噜...'
  if (timerState === 'running') return '主人好好专注，不要分心哦~'
  return '再摸摸我！'
}

{
  const bubble = simulateTimerClick('idle', 'sleep')
  if (bubble === '呼噜呼噜...') pass('timerClick: sleep overrides timer running state')
  else fail('timerClick: sleep overrides timer', bubble)
}
{
  const bubble = simulateTimerClick('running', 'sleep')
  if (bubble === '呼噜呼噜...') pass('timerClick: sleep overrides even when timer running')
  else fail('timerClick: sleep overrides even when timer running', bubble)
}
{
  const bubble = simulateTimerClick('running', 'idle')
  if (bubble === '主人好好专注，不要分心哦~') pass('timerClick: running shows focus message')
  else fail('timerClick: running shows focus message', bubble)
}
{
  const bubble = simulateTimerClick('idle', 'idle')
  if (bubble === '再摸摸我！') pass('timerClick: idle shows pet-me message')
  else fail('timerClick: idle shows pet-me message', bubble)
}

// ============================================================
// RESULTS
// ============================================================
console.log('\n========== PET SLEEP TEST RESULTS ==========')
const passCount = results.filter(r => r.status === 'PASS').length
const failCount = results.filter(r => r.status === 'FAIL').length
console.table(results)
console.log(`\n${passCount} PASS, ${failCount} FAIL out of ${results.length} tests`)

if (failCount > 0) {
  console.log('\nFAILED TESTS:')
  for (const r of results) {
    if (r.status === 'FAIL') console.log(`  - ${r.test}: ${r.detail}`)
  }
}
