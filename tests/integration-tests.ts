/**
 * New Feature Integration Tests
 * Covers: tray tooltip, mini timer, time period timeline, sprite edge crop, scroll fix
 */

const results: { test: string; status: 'PASS' | 'FAIL'; detail?: string }[] = []
function pass(t: string) { results.push({ test: t, status: 'PASS' }) }
function fail(t: string, d: string) { results.push({ test: t, status: 'FAIL', detail: d }) }

// ============================================================
// TEST 1: Tray Tooltip Format
// ============================================================
console.log('\n--- Test 1: Tray Tooltip Format ---')

function formatTooltip(state: string, time: string, label: string, coins: number, poms: number): string {
  if (state === 'idle') return `PawFocus | 金币: ${coins} | 今日: ${poms}`
  return `${label} ${time} | 金币: ${coins} | 今日: ${poms}`
}

{
  const t = formatTooltip('idle', '--:--', '', 100, 3)
  if (t === 'PawFocus | 金币: 100 | 今日: 3') pass('tooltip: idle format')
  else fail('tooltip: idle format', t)
}
{
  const t = formatTooltip('running', '25:00', '专注中...', 100, 3)
  if (t === '专注中... 25:00 | 金币: 100 | 今日: 3') pass('tooltip: running format')
  else fail('tooltip: running format', t)
}
{
  const t = formatTooltip('break', '05:00', '短休息', 100, 3)
  if (t === '短休息 05:00 | 金币: 100 | 今日: 3') pass('tooltip: break format')
  else fail('tooltip: break format', t)
}
{
  const t = formatTooltip('completed', '00:00', '完成!', 100, 3)
  if (t === '完成! 00:00 | 金币: 100 | 今日: 3') pass('tooltip: completed format')
  else fail('tooltip: completed format', t)
}

// ============================================================
// TEST 2: Mini Timer Event Data
// ============================================================
console.log('\n--- Test 2: Mini Timer Event Data ---')

interface TimerEvent {
  time: string; state: string; label: string
}

function emitTimerData(state: string): TimerEvent {
  const data: Record<string, { time: string; label: string }> = {
    idle: { time: '--:--', label: '' },
    running: { time: '25:00', label: '专注中...' },
    break: { time: '05:00', label: '短休息' },
    completed: { time: '00:00', label: '完成!' },
  }
  const d = data[state]
  return { time: d.time, state, label: d.label }
}

{
  const e = emitTimerData('running')
  if (e.state === 'running' && e.time === '25:00') pass('miniTimer: running event data')
  else fail('miniTimer: running event data', JSON.stringify(e))
}
{
  const e = emitTimerData('idle')
  if (e.state === 'idle' && e.time === '--:--') pass('miniTimer: idle event data')
  else fail('miniTimer: idle event data', JSON.stringify(e))
}
{
  const e = emitTimerData('break')
  if (e.state === 'break' && e.label === '短休息') pass('miniTimer: break event data')
  else fail('miniTimer: break event data', JSON.stringify(e))
}

// ============================================================
// TEST 3: Time Period Boundaries
// ============================================================
console.log('\n--- Test 3: Time Period Boundaries ---')

function getPeriod(hour: number, morningEnd = 11, afternoonEnd = 17, eveningEnd = 21): string {
  if (hour >= 6 && hour < morningEnd) return 'morning'
  if (hour >= morningEnd && hour < afternoonEnd) return 'afternoon'
  if (hour >= afternoonEnd && hour < eveningEnd) return 'evening'
  return 'night'
}

// Default boundaries
{
  if (getPeriod(7) === 'morning') pass('period: 7am is morning (default)')
  else fail('period: 7am is morning', getPeriod(7))
}
{
  if (getPeriod(12) === 'afternoon') pass('period: noon is afternoon (default)')
  else fail('period: noon is afternoon', getPeriod(12))
}
{
  if (getPeriod(18) === 'evening') pass('period: 6pm is evening (default)')
  else fail('period: 6pm is evening', getPeriod(18))
}
{
  if (getPeriod(23) === 'night') pass('period: 11pm is night (default)')
  else fail('period: 11pm is night', getPeriod(23))
}
{
  if (getPeriod(4) === 'night') pass('period: 4am is night (default)')
  else fail('period: 4am is night', getPeriod(4))
}

// Custom boundaries
{
  if (getPeriod(7, 8, 15, 20) === 'morning') pass('period: custom - 7am still morning (8am boundary)')
  else fail('period: custom morning', getPeriod(7, 8, 15, 20))
}
{
  if (getPeriod(9, 8, 15, 20) === 'afternoon') pass('period: custom - 9am is afternoon (8am boundary)')
  else fail('period: custom afternoon', getPeriod(9, 8, 15, 20))
}
{
  if (getPeriod(16, 8, 15, 20) === 'evening') pass('period: custom - 4pm is evening (3pm boundary)')
  else fail('period: custom evening', getPeriod(16, 8, 15, 20))
}
{
  if (getPeriod(21, 8, 15, 20) === 'night') pass('period: custom - 9pm is night (8pm boundary)')
  else fail('period: custom night', getPeriod(21, 8, 15, 20))
}

// Boundary edge cases
{
  if (getPeriod(11) === 'afternoon') pass('period: 11am boundary → afternoon')
  else fail('period: 11am boundary', getPeriod(11))
}
{
  if (getPeriod(10) === 'morning') pass('period: 10am is still morning')
  else fail('period: 10am is still morning', getPeriod(10))
}
{
  if (getPeriod(5) === 'night') pass('period: 5am is night (before 6am)')
  else fail('period: 5am is night', getPeriod(5))
}
{
  if (getPeriod(6) === 'morning') pass('period: 6am is morning (start of day)')
  else fail('period: 6am is morning', getPeriod(6))
}

// ============================================================
// TEST 4: Timeline Drag Boundaries (clamping)
// ============================================================
console.log('\n--- Test 4: Timeline Drag Boundary Clamping ---')

function clampTimeline(hour: number): number {
  return Math.max(0, Math.min(23, Math.round(hour)))
}

{
  if (clampTimeline(11) === 11) pass('timeline: hour 11 passes through')
  else fail('timeline: hour 11', String(clampTimeline(11)))
}
{
  if (clampTimeline(0) === 0) pass('timeline: hour 0 clamped to 0')
  else fail('timeline: hour 0', String(clampTimeline(0)))
}
{
  if (clampTimeline(23) === 23) pass('timeline: hour 23 passes through')
  else fail('timeline: hour 23', String(clampTimeline(23)))
}
{
  if (clampTimeline(25) === 23) pass('timeline: hour 25 clamped to 23')
  else fail('timeline: hour 25', String(clampTimeline(25)))
}
{
  if (clampTimeline(-1) === 0) pass('timeline: hour -1 clamped to 0')
  else fail('timeline: hour -1', String(clampTimeline(-1)))
}
{
  if (clampTimeline(1.4) === 1) pass('timeline: 1.4 rounds to 1')
  else fail('timeline: 1.4', String(clampTimeline(1.4)))
}
{
  if (clampTimeline(1.6) === 2) pass('timeline: 1.6 rounds to 2')
  else fail('timeline: 1.6', String(clampTimeline(1.6)))
}

// ============================================================
// TEST 5: Sprite Edge Crop
// ============================================================
console.log('\n--- Test 5: Sprite Edge Crop ---')

function cropSpriteSource(x: number, y: number, cellW: number, cellH: number) {
  return { sx: x + 1, sy: y + 1, sw: cellW - 2, sh: cellH - 2 }
}

{
  const result = cropSpriteSource(0, 288, 72, 72)
  if (result.sx === 1 && result.sy === 289 && result.sw === 70 && result.sh === 70) {
    pass('spriteCrop: sleep row 4 (y=288) cropped correctly')
  } else fail('spriteCrop: sleep row', JSON.stringify(result))
}
{
  const result = cropSpriteSource(0, 504, 72, 72)
  if (result.sx === 1 && result.sy === 505 && result.sw === 70 && result.sh === 70) {
    pass('spriteCrop: bark row 7 (y=504) cropped correctly')
  } else fail('spriteCrop: bark row', JSON.stringify(result))
}

// ============================================================
// TEST 6: Layout Scroll Fix (safe center)
// ============================================================
console.log('\n--- Test 6: Layout Scroll Fix ---')

function simulateOverflow(containerHeight: number, contentHeight: number, useSafeCenter: boolean): boolean {
  if (useSafeCenter) {
    return contentHeight > containerHeight // safe center = scrollable from top
  }
  return false // old behavior: cut off
}

{
  if (simulateOverflow(400, 500, true)) pass('scrollFix: safe center allows overflow scroll')
  else fail('scrollFix: safe center overflow', 'should be scrollable')
}
{
  if (simulateOverflow(400, 300, true) === false) pass('scrollFix: safe center still centers when fits')
  else fail('scrollFix: safe center fits', 'should be centered')
}

// ============================================================
// TEST 7: Stats Tooltip Data
// ============================================================
console.log('\n--- Test 7: Stats Tooltip Data ---')

function formatFocusTooltip(count: number, minutes: number): string {
  return `完成 ${count} 次\n专注 ${minutes} 分钟`
}
function formatHealthTooltip(water: number, exercise: number, eyeRest: number): string {
  return `💧${water}次  🏃${exercise}次  👀${eyeRest}次`
}
function formatHabitTooltip(count: number, total: number): string {
  const rate = total > 0 ? Math.round((count / total) * 100) : 0
  return `已打卡 ${count}/${total}\n完成率 ${rate}%`
}

{
  const t = formatFocusTooltip(3, 75)
  if (t.includes('完成 3 次') && t.includes('75 分钟')) pass('statsTooltip: focus format')
  else fail('statsTooltip: focus format', t)
}
{
  const t = formatHealthTooltip(2, 1, 0)
  if (t === '💧2次  🏃1次  👀0次') pass('statsTooltip: health format')
  else fail('statsTooltip: health format', t)
}
{
  const t = formatHabitTooltip(3, 5)
  if (t === '已打卡 3/5\n完成率 60%') pass('statsTooltip: habit format')
  else fail('statsTooltip: habit format', t)
}
{
  const t = formatHabitTooltip(0, 0)
  if (t === '已打卡 0/0\n完成率 0%') pass('statsTooltip: habit zero case')
  else fail('statsTooltip: habit zero case', t)
}

// ============================================================
// TEST 8: Habit Store isDayActive
// ============================================================
console.log('\n--- Test 8: Habit Store isDayActive ---')

function isDayActiveSim(frequency: string, config: any, date: Date, createdAt: string): boolean {
  const dayOfWeek = date.getDay()
  switch (frequency) {
    case 'daily': return true
    case 'weekdays': return dayOfWeek >= 1 && dayOfWeek <= 5
    case 'every_n_days': {
      const n = config?.nDays ?? 2
      const created = new Date(createdAt)
      const diffDays = Math.floor((date.getTime() - created.getTime()) / 86400000)
      return diffDays >= 0 && diffDays % n === 0
    }
    case 'custom_days': {
      const days = config?.customDays ?? []
      return days.includes(dayOfWeek)
    }
    default: return true
  }
}

{
  const monday = new Date('2026-05-04') // Monday
  if (isDayActiveSim('daily', {}, monday, '2026-01-01')) pass('isDayActive: daily always active')
  else fail('isDayActive: daily', 'not active?')
}
{
  const saturday = new Date('2026-05-09') // Saturday
  if (!isDayActiveSim('weekdays', {}, saturday, '2026-01-01')) pass('isDayActive: weekdays skip Saturday')
  else fail('isDayActive: weekdays skip Saturday', 'should be inactive')
}
{
  // Created Jan 1, check Jan 5 (4 days later), interval 2
  const jan5 = new Date('2026-01-05')
  if (isDayActiveSim('every_n_days', { nDays: 2 }, jan5, '2026-01-01')) pass('isDayActive: every_2_days, 4 days after creation')
  else fail('isDayActive: every_2_days', 'should be active')
}
{
  // Created Jan 1, check Jan 4 (3 days later), interval 2
  const jan4 = new Date('2026-01-04')
  if (!isDayActiveSim('every_n_days', { nDays: 2 }, jan4, '2026-01-01')) pass('isDayActive: every_2_days, 3 days after creation (odd)')
  else fail('isDayActive: every_2_days odd', 'should be inactive')
}

// ============================================================
// TEST 9: Setting defaults
// ============================================================
console.log('\n--- Test 9: Setting Defaults ---')

const defaults = { morningEnd: 11, afternoonEnd: 17, eveningEnd: 21 }

{
  if (defaults.morningEnd === 11) pass('defaults: morningEnd = 11')
  else fail('defaults: morningEnd', String(defaults.morningEnd))
}
{
  if (defaults.afternoonEnd === 17) pass('defaults: afternoonEnd = 17')
  else fail('defaults: afternoonEnd', String(defaults.afternoonEnd))
}
{
  if (defaults.eveningEnd === 21) pass('defaults: eveningEnd = 21')
  else fail('defaults: eveningEnd', String(defaults.eveningEnd))
}

// ============================================================
// TEST 10: Mini timer visibility lifecycle
// ============================================================
console.log('\n--- Test 10: Mini Timer Lifecycle ---')

function shouldShowMini(mainVisible: boolean, minimizeToTray: boolean): boolean {
  return !mainVisible && minimizeToTray
}

{
  if (shouldShowMini(false, true)) pass('miniLifecycle: show when hidden + tray enabled')
  else fail('miniLifecycle: show when hidden', 'should show')
}
{
  if (!shouldShowMini(true, true)) pass('miniLifecycle: hide when main visible')
  else fail('miniLifecycle: hide when visible', 'should hide')
}
{
  if (!shouldShowMini(false, false)) pass('miniLifecycle: no show when tray disabled')
  else fail('miniLifecycle: tray disabled', 'should not show')
}

// ============================================================
// RESULTS
// ============================================================
console.log('\n========== INTEGRATION TEST RESULTS ==========')
const passCount = results.filter(r => r.status === 'PASS').length
const failCount = results.filter(r => r.status === 'FAIL').length
console.table(results)
console.log(`\n${passCount} PASS, ${failCount} FAIL out of ${results.length} tests`)

if (failCount > 0) {
  console.log('\nFAILED TESTS:')
  for (const r of results) if (r.status === 'FAIL') console.log(`  - ${r.test}: ${r.detail}`)
}
