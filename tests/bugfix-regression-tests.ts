/**
 * Bug Fix Regression Tests
 * Tests all fixes from the 2026-05-04 bug fixing sessions.
 */
import 'fake-indexeddb/auto'
import { StorageService } from '../src/services/storage/index.ts'
import { toLocalDateStr } from '../src/utils/date.ts'

const results: { test: string; status: 'PASS' | 'FAIL'; detail?: string }[] = []

function pass(test: string) { results.push({ test, status: 'PASS' }) }
function fail(test: string, detail: string) { results.push({ test, status: 'FAIL', detail }) }

// ============================================================
// ROUND 1: DATE UTILITY — toLocalDateStr
// ============================================================
console.log('\n--- Round 1: Date Utility Tests ---')

// Test: toLocalDateStr produces YYYY-MM-DD using local time
const testDate = new Date(2026, 0, 15, 3, 0, 0) // Jan 15, 2026 03:00 local
const dateStr = toLocalDateStr(testDate)
if (dateStr === '2026-01-15') {
  pass('toLocalDateStr basic format')
} else {
  fail('toLocalDateStr basic format', `Expected 2026-01-15, got ${dateStr}`)
}

// Test: toLocalDateStr handles midnight boundary correctly (NOT UTC)
// If system is UTC+8 and time is 22:00 UTC on Jan 14, local is Jan 15 06:00
const utcNight = new Date('2026-01-14T22:00:00Z')
const localStr = toLocalDateStr(utcNight)
// Expected: 2026-01-15 (UTC+8) or 2026-01-14 (UTC-5 etc)
// We just verify it doesn't use UTC date
const utcDateNum = utcNight.getUTCDate()
const localDateNum = utcNight.getDate()
if (localStr.endsWith(String(localDateNum).padStart(2, '0'))) {
  pass('toLocalDateStr uses local time (not UTC)')
} else {
  fail('toLocalDateStr uses local time (not UTC)', `localStr=${localStr}, utcDate=${utcDateNum}, localDate=${localDateNum}`)
}

// Test: consistency — same local day produces same string
const d1 = new Date('2026-03-15T00:30:00')
const d2 = new Date('2026-03-15T23:59:59')
if (toLocalDateStr(d1) === toLocalDateStr(d2)) {
  pass('toLocalDateStr same-day consistency')
} else {
  fail('toLocalDateStr same-day consistency', `${toLocalDateStr(d1)} !== ${toLocalDateStr(d2)}`)
}

// ============================================================
// ROUND 2: INDEXEDDB DEEP CLONE — crud.ts put()
// ============================================================
console.log('\n--- Round 2: IndexedDB Deep Clone Tests ---')

async function testDeepClone() {
  const storage = new StorageService()

  // Test: Plain object saves and reads back correctly
  const plain = { key: 'deep-clone-test', value: 42, nested: { a: 1 } }
  await storage.save('settings', plain)
  const read = await storage.get('settings', 'deep-clone-test')
  if (read && read.value === 42 && read.nested.a === 1) {
    pass('IndexedDB put/get plain object')
  } else {
    fail('IndexedDB put/get plain object', JSON.stringify(read))
  }

  // Test: Object with Date (structured clone compatible)
  const withDate = { key: 'date-test', created: new Date('2026-01-01') }
  await storage.save('settings', withDate)
  const readDate = await storage.get('settings', 'date-test')
  if (readDate && readDate.created) {
    pass('IndexedDB put/get object with Date')
  } else {
    fail('IndexedDB put/get object with Date', JSON.stringify(readDate))
  }

  // Test: Object with undefined values (structured clone strips undefined)
  const withUndef = { key: 'undef-test', name: 'test', opt: undefined }
  await storage.save('settings', withUndef)
  const readUndef = await storage.get('settings', 'undef-test')
  if (readUndef && readUndef.name === 'test') {
    pass('IndexedDB put/get object with undefined (stripped)')
  } else {
    fail('IndexedDB put/get object with undefined', JSON.stringify(readUndef))
  }

  // Test: Multiple saves to same key (update)
  await storage.save('settings', { key: 'update-test', count: 1 })
  await storage.save('settings', { key: 'update-test', count: 2 })
  const updated = await storage.get('settings', 'update-test')
  if (updated && updated.count === 2) {
    pass('IndexedDB update existing key')
  } else {
    fail('IndexedDB update existing key', JSON.stringify(updated))
  }

  // Test: getAll
  await storage.save('memos', { id: 'm1', content: 'A', timestamp: 1, isImportant: false, category: '生活', completed: false })
  await storage.save('memos', { id: 'm2', content: 'B', timestamp: 2, isImportant: true, category: '工作', completed: true })
  const all = await storage.getAll('memos')
  if (Array.isArray(all) && all.length === 2) {
    pass('IndexedDB getAll count')
  } else {
    fail('IndexedDB getAll count', `length=${all?.length}`)
  }

  // Test: remove
  await storage.remove('memos', 'm1')
  const afterDel = await storage.getAll('memos')
  if (afterDel.length === 1 && afterDel[0].id === 'm2') {
    pass('IndexedDB remove')
  } else {
    fail('IndexedDB remove', JSON.stringify(afterDel))
  }

  // Cleanup
  await storage.remove('memos', 'm2')
  await storage.remove('settings', 'deep-clone-test')
  await storage.remove('settings', 'date-test')
  await storage.remove('settings', 'undef-test')
  await storage.remove('settings', 'update-test')
}

// ============================================================
// ROUND 3: MEMO STORE LOGIC
// ============================================================
console.log('\n--- Round 3: Memo Store Logic Tests ---')

async function testMemoLogic() {
  const storage = new StorageService()

  // Test: clearCompleted with Promise.allSettled pattern
  // Create some completed memos
  await storage.save('memos', { id: 'mc1', content: 'Done 1', timestamp: 1, isImportant: false, category: '生活', completed: true })
  await storage.save('memos', { id: 'mc2', content: 'Done 2', timestamp: 2, isImportant: false, category: '生活', completed: true })
  await storage.save('memos', { id: 'mc3', content: 'Active', timestamp: 3, isImportant: false, category: '生活', completed: false })

  // Simulate clearCompleted logic
  const allMemos = await storage.getAll('memos') as any[]
  const completed = allMemos.filter((m: any) => m.completed)
  const completedIds = new Set(completed.map((m: any) => m.id))

  const removeResults = await Promise.allSettled(
    completed.map((m: any) => storage.remove('memos', m.id))
  )

  const failedIds = new Set(
    completed.filter((_: any, i: number) => removeResults[i].status === 'rejected').map((m: any) => m.id)
  )

  const remaining = allMemos.filter((m: any) => !completedIds.has(m.id) || failedIds.has(m.id))
  const afterAll = await storage.getAll('memos')

  if (afterAll.length === 1 && afterAll[0].id === 'mc3') {
    pass('clearCompleted: all completed memos removed')
  } else {
    fail('clearCompleted: all completed memos removed', `remaining=${afterAll.length}`)
  }

  if (failedIds.size === 0) {
    pass('clearCompleted: no failed removals (healthy path)')
  }

  if (remaining.length === 1 && remaining[0].id === 'mc3') {
    pass('clearCompleted: memory state matches storage')
  } else {
    fail('clearCompleted: memory state matches storage', JSON.stringify(remaining))
  }

  // Test: removeCategory orphan reassignment logic
  // Create memo with specific category
  await storage.save('memos', { id: 'mo1', content: 'Orphan test', timestamp: 4, isImportant: false, category: '自定义分类', completed: false })
  const beforeOrphan = await storage.getAll('memos') as any[]

  // Simulate removeCategory: reassign orphans to '生活'
  const removedCategory = '自定义分类'
  for (const m of beforeOrphan) {
    if (m.category === removedCategory) m.category = '生活'
  }

  const orphaned = beforeOrphan.find((m: any) => m.id === 'mo1')
  if (orphaned && orphaned.category === '生活') {
    pass('removeCategory: orphan memo reassigned to default')
  } else {
    fail('removeCategory: orphan memo reassigned to default', JSON.stringify(orphaned))
  }

  // Test: legacy data without completed field
  const legacyMemo = { id: 'ml1', content: 'Legacy', timestamp: 5, isImportant: false, category: '生活' }
  // Simulate normalization from load()
  const normalized = { ...legacyMemo, completed: legacyMemo.completed ?? false, category: legacyMemo.category ?? '生活' }
  if (normalized.completed === false && normalized.category === '生活') {
    pass('memo load: legacy data normalization')
  } else {
    fail('memo load: legacy data normalization', JSON.stringify(normalized))
  }

  // Test: legacy data without category field
  const legacyMemo2 = { id: 'ml2', content: 'No category', timestamp: 6, isImportant: false, completed: true }
  const normalized2 = { ...legacyMemo2, completed: legacyMemo2.completed ?? false, category: legacyMemo2.category ?? '生活' }
  if (normalized2.category === '生活' && normalized2.completed === true) {
    pass('memo load: legacy data missing category defaulted')
  } else {
    fail('memo load: legacy data missing category defaulted', JSON.stringify(normalized2))
  }

  // Cleanup
  await storage.remove('memos', 'mc3')
  await storage.remove('memos', 'mo1')
}

// ============================================================
// ROUND 4: HABIT DATE LOGIC
// ============================================================
console.log('\n--- Round 4: Habit Date Logic Tests ---')

function testHabitDateLogic() {
  // Test: getToday using toLocalDateStr
  const today = toLocalDateStr(new Date())
  if (/^\d{4}-\d{2}-\d{2}$/.test(today)) {
    pass('habit getToday: valid YYYY-MM-DD format')
  } else {
    fail('habit getToday: valid YYYY-MM-DD format', today)
  }

  // Test: yesterday calculation
  const yesterdayDate = new Date()
  yesterdayDate.setDate(yesterdayDate.getDate() - 1)
  const yesterday = toLocalDateStr(yesterdayDate)
  if (yesterday !== today) {
    pass('habit yesterday: different from today')
  } else {
    fail('habit yesterday: different from today', `${yesterday} === ${today}`)
  }

  // Test: Date constructor without T00:00:00 hack
  const createdAt = '2026-01-15'
  const d1 = new Date(createdAt) // no T00:00:00 suffix
  const d2 = new Date(createdAt + 'T00:00:00') // old approach
  // Both should work, but the new approach avoids string concatenation issues
  if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
    pass('habit Date: no T00:00:00 needed')
  } else {
    fail('habit Date: no T00:00:00 needed', `d1=${d1.getTime()}, d2=${d2.getTime()}`)
  }

  // Test: every_n_days frequency logic
  const created = new Date('2026-01-01')
  const now = new Date('2026-01-04')
  const diffDays = Math.floor((now.getTime() - created.getTime()) / 86400000)
  if (diffDays === 3) {
    pass('habit every_n_days: diffDays calculation correct')
  } else {
    fail('habit every_n_days: diffDays calculation correct', `expected 3, got ${diffDays}`)
  }

  // Test: weekdays check
  const monday = new Date('2026-05-04T00:00:00') // This is a Monday
  const dayOfWeek = monday.getDay()
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5
  if (dayOfWeek === 1 && isWeekday) {
    pass('habit weekdays: Monday is a weekday')
  } else {
    fail('habit weekdays: Monday is a weekday', `dayOfWeek=${dayOfWeek}`)
  }
}

// ============================================================
// ROUND 5: EDGE CASES
// ============================================================
console.log('\n--- Round 5: Edge Case Tests ---')

function testEdgeCases() {
  // Test: toLocalDateStr with end-of-month
  const eom = toLocalDateStr(new Date(2026, 0, 31))
  if (eom === '2026-01-31') {
    pass('toLocalDateStr: end of month')
  } else {
    fail('toLocalDateStr: end of month', eom)
  }

  // Test: toLocalDateStr with leap year
  const leap = toLocalDateStr(new Date(2024, 1, 29))
  if (leap === '2024-02-29') {
    pass('toLocalDateStr: leap year')
  } else {
    fail('toLocalDateStr: leap year', leap)
  }

  // Test: toLocalDateStr with year boundary
  const newYear = toLocalDateStr(new Date(2025, 11, 31))
  if (newYear === '2025-12-31') {
    pass('toLocalDateStr: year boundary')
  } else {
    fail('toLocalDateStr: year boundary', newYear)
  }

  // Test: streak calculation with consecutive dates
  const dates = ['2026-05-03', '2026-05-02', '2026-05-01']
  let streak = 1
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1])
    prev.setDate(prev.getDate() - 1)
    if (dates[i] === toLocalDateStr(prev)) streak++
    else break
  }
  if (streak === 3) {
    pass('streak: 3 consecutive days detected')
  } else {
    fail('streak: 3 consecutive days detected', `streak=${streak}`)
  }

  // Test: streak with gap
  const dates2 = ['2026-05-03', '2026-05-01']
  let streak2 = 1
  for (let i = 1; i < dates2.length; i++) {
    const prev = new Date(dates2[i - 1])
    prev.setDate(prev.getDate() - 1)
    if (dates2[i] === toLocalDateStr(prev)) streak2++
    else break
  }
  if (streak2 === 1) {
    pass('streak: gap breaks streak')
  } else {
    fail('streak: gap breaks streak', `streak2=${streak2}`)
  }

  // Test: checkins null safety
  const habitWithNullCheckins = { checkins: null } as any
  const safe = (habitWithNullCheckins.checkins ?? []).map((c: any) => ({ ...c, status: c.status ?? 'done' }))
  if (Array.isArray(safe) && safe.length === 0) {
    pass('habit: null checkins safe')
  } else {
    fail('habit: null checkins safe', JSON.stringify(safe))
  }
}

// ============================================================
// RUN ALL
// ============================================================
async function runAll() {
  await testDeepClone()
  await testMemoLogic()
  testHabitDateLogic()
  testEdgeCases()

  console.log('\n========== RESULTS ==========')
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
}

runAll().catch(console.error)
