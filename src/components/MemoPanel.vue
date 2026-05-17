<template>
  <div class="memo-panel">
    <div class="memo-header">
      <span class="memo-title"><AppIcon name="memo" :size="18" /> 备忘录</span>
      <div class="header-actions">
        <button v-if="showExportMenu" class="export-overlay" @click="showExportMenu = false"></button>
        <button class="btn-icon" @click="showExportMenu = !showExportMenu"><AppIcon name="download" :size="16" /></button>
        <div v-if="showExportMenu" class="export-dropdown">
          <button @click="doExport('json')">导出 JSON</button>
          <button @click="doExport('txt')">导出 TXT</button>
        </div>
      </div>
    </div>

    <!-- 分类标签栏 -->
    <div class="category-bar">
      <div
        ref="catScrollRef"
        class="cat-scroll"
        :class="{ dragging: isCatDragging }"
        @mousedown="onCatDragStart"
        @mousemove="onCatDragMove"
        @mouseup="onCatDragEnd"
        @mouseleave="onCatDragEnd"
        @click.capture="onCatDragClick"
        @wheel="onCatWheel"
      >
        <button
          class="cat-pill"
          :class="{ active: memoStore.currentFilter === '全部' }"
          @click="memoStore.currentFilter = '全部'"
        >全部</button>
        <button
          v-for="cat in memoStore.categories"
          :key="cat"
          class="cat-pill"
          :class="{ active: memoStore.currentFilter === cat }"
          @click="handleCatPillClick(cat)"
        >{{ cat }}</button>
      </div>
      <button class="cat-add" @click="showAddCat = true">+</button>
    </div>

    <!-- 添加自定义分类弹窗 -->
    <div v-if="showAddCat" class="cat-dialog" @click.self="showAddCat = false">
      <div class="cat-dialog-inner">
        <div class="cat-dialog-title">添加分类</div>
        <input
          v-model="newCatName"
          class="cat-input"
          placeholder="分类名称"
          maxlength="8"
          @keydown.enter="confirmAddCat"
          ref="catInputRef"
        />
        <div class="cat-dialog-btns">
          <button class="cat-dialog-cancel" @click="showAddCat = false">取消</button>
          <button class="cat-dialog-ok" @click="confirmAddCat">添加</button>
        </div>
        <div v-if="memoStore.customCategories.length" class="custom-cat-list">
          <div v-for="c in memoStore.customCategories" :key="c" class="custom-cat-row">
            <span>{{ c }}</span>
            <button class="cat-remove" @click="memoStore.removeCategory(c)"><AppIcon name="close" :size="12" /></button>
          </div>
        </div>
      </div>
    </div>

    <!-- 新建输入区 -->
    <div class="input-area">
      <textarea
        v-model="newContent"
        class="memo-textarea"
        placeholder="写点什么..."
        rows="2"
        maxlength="500"
        @keydown.enter.ctrl="handleAdd"
      ></textarea>
      <div class="input-actions">
        <div class="cat-dropdown-wrapper">
          <button v-if="showCatMenu" class="cat-overlay" @click="showCatMenu = false"></button>
          <button class="cat-btn" @click="showCatMenu = !showCatMenu">{{ newCategory }} ▾</button>
          <div v-if="showCatMenu" class="cat-dropdown">
            <button
              v-for="cat in memoStore.categories"
              :key="cat"
              :class="{ active: newCategory === cat }"
              @click="handleCatItemClick(cat, 'new')"
            >{{ cat }}</button>
          </div>
        </div>
        <button
          class="btn-star"
          :class="{ active: newImportant }"
          @click="newImportant = !newImportant"
        ><AppIcon :name="newImportant ? 'star' : 'starOff'" :size="16" /></button>
        <button class="btn-add" @click="handleAdd" :disabled="!newContent.trim()">添加</button>
      </div>
    </div>

    <!-- 备忘列表 -->
    <div class="memo-list">
      <div v-if="memoStore.filteredMemos.length === 0" class="memo-empty">
        暂无备忘
      </div>
      <TransitionGroup name="memo-list">
      <div
        v-for="memo in memoStore.filteredMemos"
        :key="memo.id"
        class="memo-card"
        :class="{ important: memo.isImportant, completed: memo.completed }"
        @dblclick.stop="openEditDialog(memo)"
      >
        <div class="memo-card-header">
          <div class="memo-tags">
            <span class="memo-cat-tag">{{ memo.category }}</span>
            <span
              v-if="memo.deadline && !memo.completed"
              class="deadline-tag"
              :class="memoStore.getDeadlineStatus(memo)"
            >{{ deadlineText(memo) }}</span>
          </div>
          <span class="memo-time">{{ formatTime(memo.timestamp) }}</span>
        </div>
        <div v-if="editingId !== memo.id" class="memo-content" :class="{ done: memo.completed }" @click="handleContentClick(memo)">
          {{ memo.content }}
        </div>
        <textarea
          v-else
          class="memo-edit-area"
          v-model="editContent"
          maxlength="500"
          rows="2"
          @blur="saveEdit(memo)"
          @keydown.enter.ctrl="saveEdit(memo)"
        ></textarea>
        <div class="memo-card-actions">
          <button class="btn-tiny btn-check" :class="{ checked: memo.completed }" @click="memoStore.toggleCompleted(memo.id)">
            <AppIcon :name="memo.completed ? 'check' : 'square'" :size="14" />
          </button>
          <button class="btn-tiny" @click="memoStore.toggleImportant(memo.id)">
            <AppIcon :name="memo.isImportant ? 'star' : 'starOff'" :size="14" />
          </button>
          <button
            class="btn-tiny btn-calendar"
            :class="{ active: !!memo.deadline }"
            @click="openCalendar(memo)"
          ><AppIcon name="calendar" :size="14" /></button>
          <button class="btn-tiny btn-delete" @click="memoStore.deleteMemo(memo.id)"><AppIcon name="trash" :size="14" /></button>
        </div>
      </div>
      </TransitionGroup>
    </div>

    <!-- 日历弹窗 -->
    <div v-if="calMemoId" class="cal-overlay" @click.self="closeCalendar">
      <div class="cal-dialog">
        <div class="cal-title">选择截止日期</div>
        <div class="cal-nav">
          <button class="cal-nav-btn" @click="calPrevMonth"><AppIcon name="chevronLeft" :size="14" /></button>
          <span class="cal-month-label">{{ calYear }}年{{ calMonth + 1 }}月</span>
          <button class="cal-nav-btn" @click="calNextMonth"><AppIcon name="chevronRight" :size="14" /></button>
        </div>
        <div class="cal-grid">
          <div class="cal-weekday" v-for="d in ['一','二','三','四','五','六','日']" :key="d">{{ d }}</div>
          <button
            v-for="(cell, idx) in calCells"
            :key="idx"
            class="cal-day"
            :class="{
              empty: !cell,
              selected: cell && cell === calSelected,
              today: cell && cell === todayStr,
              past: cell && cell < todayStr,
            }"
            :disabled="!cell || cell < todayStr"
            @click="cell && selectDate(cell)"
          >
            <span v-if="cell">{{ +cell.split('-')[2] }}</span>
          </button>
        </div>
        <div class="cal-actions">
          <button v-if="calSelected" class="cal-btn-clear" @click="clearDeadline">清除截止日期</button>
          <button class="cal-btn-close" @click="closeCalendar">关闭</button>
        </div>
      </div>
    </div>

    <!-- 编辑弹窗（双击触发） -->
    <div v-if="editDialogId" class="edit-overlay" @click.self="closeEditDialog">
      <div class="edit-dialog">
        <div class="edit-dialog-title">编辑备忘录</div>

        <textarea
          v-model="editFormContent"
          class="edit-textarea"
          placeholder="内容"
          maxlength="500"
          rows="3"
        ></textarea>

        <div class="edit-row">
          <span class="edit-label">分类</span>
          <div class="cat-dropdown-wrapper">
            <button class="cat-btn" @click="showEditCatMenu = !showEditCatMenu">{{ editFormCategory }} ▾</button>
            <div v-if="showEditCatMenu" class="cat-dropdown">
              <button
                v-for="cat in memoStore.categories"
                :key="cat"
                :class="{ active: editFormCategory === cat }"
                @click="handleCatItemClick(cat, 'edit')"
              >{{ cat }}</button>
            </div>
          </div>
        </div>

        <div class="edit-row">
          <span class="edit-label">重要</span>
          <button class="edit-star-btn" :class="{ active: editFormImportant }" @click="editFormImportant = !editFormImportant">
            <AppIcon :name="editFormImportant ? 'star' : 'starOff'" :size="14" /> {{ editFormImportant ? '重要' : '普通' }}
          </button>
        </div>

        <div class="edit-row">
          <span class="edit-label">截止日期</span>
          <div class="edit-deadline-row">
            <span v-if="editFormDeadline" class="edit-deadline-text">{{ editFormDeadline }}</span>
            <span v-else class="edit-deadline-none">未设置</span>
            <button class="edit-cal-btn" @click="openEditDialogCalendar"><AppIcon name="calendar" :size="14" /></button>
            <button v-if="editFormDeadline" class="edit-cal-clear" @click="editFormDeadline = undefined"><AppIcon name="close" :size="12" /></button>
          </div>
        </div>

        <div class="edit-dialog-btns">
          <button class="edit-btn-cancel" @click="closeEditDialog">取消</button>
          <button class="edit-btn-save" @click="saveEditDialog" :disabled="!editFormContent.trim()">保存</button>
        </div>
      </div>
    </div>

    <!-- 分类编辑弹窗 -->
    <div v-if="showCatEditDialog" class="cat-edit-overlay" @click.self="showCatEditDialog = false">
      <div class="cat-edit-inner">
        <div class="cat-edit-title">编辑分类</div>
        <input
          v-model="catEditName"
          class="cat-edit-input"
          placeholder="分类名称"
          maxlength="10"
        />
        <div class="cat-edit-btns">
          <button class="btn-dialog-cancel" @click="showCatEditDialog = false">取消</button>
          <button class="btn-dialog-ok" @click="saveCatEdit">保存</button>
          <button v-if="!isPresetCat" class="btn-dialog-delete" @click="catDeletePending = true">删除</button>
        </div>
        <div v-if="catDeletePending" class="cat-delete-confirm">
          <div class="cat-delete-hint">确定删除「{{ catEditTarget }}」？该分类下的备忘将移至「生活」</div>
          <div class="cat-edit-btns">
            <button class="btn-dialog-cancel" @click="catDeletePending = false">取消</button>
            <button class="btn-dialog-delete" @click="confirmDeleteCat">确认删除</button>
          </div>
        </div>
      </div>
    </div>

    <div class="memo-footer">
      <span class="memo-stats">已完成：{{ memoStore.completedCount }}条 / 全部：{{ memoStore.memos.length }}条</span>
      <template v-if="clearPending">
        <button class="btn-clear btn-clear-cancel" @click="clearPending = false">取消</button>
        <button class="btn-clear btn-clear-confirm" @click="doClear">确认清理？</button>
      </template>
      <button
        v-else-if="memoStore.completedCount > 0"
        class="btn-clear"
        @click="clearPending = true"
      >一键清理已完成</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted, onUnmounted } from 'vue'
import { useMemoStore } from '@/stores/memo'
import type { Memo } from '@/types/memo'
import { PRESET_CATEGORIES } from '@/types/memo'
import AppIcon from '@/components/AppIcon.vue'

const memoStore = useMemoStore()

const newContent = ref('')
const newCategory = ref('生活')
const newImportant = ref(false)
const showExportMenu = ref(false)
const showCatMenu = ref(false)
const showAddCat = ref(false)
const newCatName = ref('')
const catInputRef = ref<HTMLInputElement | null>(null)
const editingId = ref<string | null>(null)
const editContent = ref('')
const clearPending = ref(false)

// --- Category bar drag-to-scroll ---
const catScrollRef = ref<HTMLDivElement | null>(null)
const isCatDragging = ref(false)
const catDragMoved = ref(false)
let catDragActive = false
let catDragStartX = 0
let catDragStartScroll = 0
let catVelocity = 0
let catLastX = 0
let catRafId: number | null = null

function onCatDragStart(e: MouseEvent) {
  const el = catScrollRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const relY = e.clientY - rect.top
  // 如果点击在水平滚动条区域（clientHeight 以下），让原生滚动条拖动接管
  if (relY > el.clientHeight) return

  if (catRafId) { cancelAnimationFrame(catRafId); catRafId = null }
  catDragActive = true
  isCatDragging.value = false
  catDragMoved.value = false
  catDragStartX = e.clientX
  catDragStartScroll = el.scrollLeft
  catLastX = e.clientX
  catVelocity = 0
}

function onCatDragMove(e: MouseEvent) {
  if (!catDragActive) return
  const dx = e.clientX - catDragStartX
  if (!catDragMoved.value && Math.abs(dx) > 4) {
    catDragMoved.value = true
    isCatDragging.value = true
  }
  if (catDragMoved.value && catScrollRef.value) {
    e.preventDefault()
    const walk = catDragStartX - e.clientX
    catScrollRef.value.scrollLeft = catDragStartScroll + walk
    catVelocity = e.clientX - catLastX
    catLastX = e.clientX
  }
}

function onCatDragEnd() {
  if (!catDragActive) return
  catDragActive = false
  isCatDragging.value = false
  if (Math.abs(catVelocity) > 1.5) {
    startCatInertia()
  }
  if (catDragMoved.value) {
    setTimeout(() => { catDragMoved.value = false }, 60)
  }
}

function startCatInertia() {
  if (!catScrollRef.value) return
  const decay = 0.93
  function step() {
    if (!catScrollRef.value) return
    catVelocity *= decay
    catScrollRef.value.scrollLeft -= catVelocity
    if (Math.abs(catVelocity) > 0.4) {
      catRafId = requestAnimationFrame(step)
    } else {
      catRafId = null
    }
  }
  catRafId = requestAnimationFrame(step)
}

function onCatDragClick(e: MouseEvent) {
  if (catDragMoved.value) {
    e.stopPropagation()
  }
}

function onCatWheel(e: WheelEvent) {
  if (!catScrollRef.value) return
  if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
    e.preventDefault()
    catScrollRef.value.scrollLeft += e.deltaY
  }
}

function onGlobalMouseUp() {
  if (catDragActive) onCatDragEnd()
}

onMounted(() => {
  window.addEventListener('mouseup', onGlobalMouseUp)
})

onUnmounted(() => {
  window.removeEventListener('mouseup', onGlobalMouseUp)
  if (catRafId) cancelAnimationFrame(catRafId)
})

// --- Calendar state ---
const calMemoId = ref<string | null>(null)
const calSelected = ref<string | null>(null)
const calMonth = ref(new Date().getMonth())
const calYear = ref(new Date().getFullYear())

// --- Edit dialog state (dblclick) ---
const editDialogId = ref<string | null>(null)
const editFormContent = ref('')
const editFormCategory = ref('生活')
const editFormImportant = ref(false)
const editFormDeadline = ref<string | undefined>(undefined)
const showEditCatMenu = ref(false)
const calendarFromEdit = ref(false)

// --- Category edit dialog state ---
const showCatEditDialog = ref(false)
const catEditTarget = ref('')
const catEditName = ref('')
const catDeletePending = ref(false)
const isPresetCat = computed(() => (PRESET_CATEGORIES as readonly string[]).includes(catEditTarget.value))

function openCatEditor(cat: string) {
  catEditTarget.value = cat
  catEditName.value = cat
  catDeletePending.value = false
  showCatEditDialog.value = true
  showCatMenu.value = false
  showEditCatMenu.value = false
}

// Distinguish single-click (select) vs double-click (edit) on dropdown items
let catClickTimer: number | null = null
let catClickCat = ''
let catClickSource: 'new' | 'edit' = 'new'

function handleCatItemClick(cat: string, source: 'new' | 'edit') {
  if (catClickTimer && catClickCat === cat && catClickSource === source) {
    // Double click — open editor
    clearTimeout(catClickTimer)
    catClickTimer = null
    openCatEditor(cat)
  } else {
    // First click — start timer
    if (catClickTimer) clearTimeout(catClickTimer)
    catClickCat = cat
    catClickSource = source
    catClickTimer = window.setTimeout(() => {
      catClickTimer = null
      // Single click — select category
      if (source === 'new') {
        newCategory.value = cat
        showCatMenu.value = false
      } else {
        editFormCategory.value = cat
        showEditCatMenu.value = false
      }
    }, 300)
  }
}

// Distinguish single-click (switch filter) vs double-click (edit) on top category pills
let catPillClickTimer: number | null = null
let catPillClickTarget = ''

function handleCatPillClick(cat: string) {
  if (catPillClickTimer && catPillClickTarget === cat) {
    // Double click — open editor
    clearTimeout(catPillClickTimer)
    catPillClickTimer = null
    openCatEditor(cat)
  } else {
    // First click — start timer
    if (catPillClickTimer) clearTimeout(catPillClickTimer)
    catPillClickTarget = cat
    catPillClickTimer = window.setTimeout(() => {
      catPillClickTimer = null
      // Single click — switch filter
      memoStore.currentFilter = cat
    }, 300)
  }
}

function saveCatEdit() {
  const name = catEditName.value.trim()
  if (!name || name === catEditTarget.value) {
    showCatEditDialog.value = false
    return
  }
  memoStore.renameCategory(catEditTarget.value, name)
  showCatEditDialog.value = false
}

function confirmDeleteCat() {
  memoStore.removeCategory(catEditTarget.value)
  catDeletePending.value = false
  showCatEditDialog.value = false
}

let clearTimer = 0

watch(showAddCat, (v) => {
  if (v) nextTick(() => catInputRef.value?.focus())
})

watch(() => memoStore.currentFilter, () => {
  clearPending.value = false
  clearTimeout(clearTimer)
})

watch(clearPending, (v) => {
  clearTimeout(clearTimer)
  if (v) clearTimer = window.setTimeout(() => { clearPending.value = false }, 5000)
})

if (!memoStore.isLoaded) memoStore.load()

// --- Computed ---
const todayStr = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})

const calCells = computed(() => {
  const firstDay = new Date(calYear.value, calMonth.value, 1)
  const daysInMonth = new Date(calYear.value, calMonth.value + 1, 0).getDate()
  let startOffset = firstDay.getDay() - 1
  if (startOffset < 0) startOffset = 6

  const cells: (string | null)[] = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${calYear.value}-${String(calMonth.value + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push(date)
  }
  return cells
})

// --- Actions ---
function handleAdd() {
  if (!newContent.value.trim()) return
  memoStore.addMemo(newContent.value.trim(), newImportant.value, newCategory.value)
  newContent.value = ''
  newImportant.value = false
}

function doClear() {
  memoStore.clearCompleted()
  clearPending.value = false
}

function startEdit(memo: Memo) {
  editingId.value = memo.id
  editContent.value = memo.content
  nextTick(() => {
    const el = document.querySelector<HTMLTextAreaElement>('.memo-edit-area')
    el?.focus()
  })
}

function handleContentClick(memo: Memo) {
  if (memo.completed) return
  startEdit(memo)
}

function saveEdit(memo: Memo) {
  if (editingId.value !== memo.id) return
  const trimmed = editContent.value.trim()
  if (trimmed) {
    memoStore.updateContent(memo.id, trimmed)
  }
  editingId.value = null
}

// --- Edit dialog (dblclick) ---
function openEditDialog(memo: Memo) {
  if (memo.completed) return
  editDialogId.value = memo.id
  editFormContent.value = memo.content
  editFormCategory.value = memo.category
  editFormImportant.value = memo.isImportant
  editFormDeadline.value = memo.deadline
}

function closeEditDialog() {
  editDialogId.value = null
  showEditCatMenu.value = false
}

async function saveEditDialog() {
  if (!editDialogId.value) return
  const trimmed = editFormContent.value.trim()
  if (!trimmed) return
  await memoStore.updateMemo(editDialogId.value, {
    content: trimmed,
    category: editFormCategory.value,
    isImportant: editFormImportant.value,
    deadline: editFormDeadline.value,
  })
  closeEditDialog()
}

function openEditDialogCalendar() {
  if (!editDialogId.value) return
  calendarFromEdit.value = true
  calMemoId.value = editDialogId.value
  if (editFormDeadline.value) {
    const parts = editFormDeadline.value.split('-')
    calYear.value = +parts[0]
    calMonth.value = +parts[1] - 1
    calSelected.value = editFormDeadline.value
  } else {
    calMonth.value = new Date().getMonth()
    calYear.value = new Date().getFullYear()
    calSelected.value = null
  }
}

function confirmAddCat() {
  const name = newCatName.value.trim()
  if (!name) return
  memoStore.addCategory(name)
  newCatName.value = ''
  showAddCat.value = false
}

function doExport(format: 'json' | 'txt') {
  showExportMenu.value = false
  const data = format === 'json' ? memoStore.exportAsJSON() : memoStore.exportAsTXT()
  const type = format === 'json' ? 'application/json' : 'text/plain'
  const ext = format === 'json' ? 'json' : 'txt'
  const blob = new Blob([data], { type: `${type};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `memos.${ext}`
  a.click()
  URL.revokeObjectURL(url)
}

// --- Calendar ---
function openCalendar(memo: Memo) {
  calendarFromEdit.value = false
  calMemoId.value = memo.id
  if (memo.deadline) {
    const parts = memo.deadline.split('-')
    calYear.value = +parts[0]
    calMonth.value = +parts[1] - 1
    calSelected.value = memo.deadline
  } else {
    calMonth.value = new Date().getMonth()
    calYear.value = new Date().getFullYear()
    calSelected.value = null
  }
}

function closeCalendar() {
  calMemoId.value = null
  calSelected.value = null
  calendarFromEdit.value = false
}

function selectDate(date: string) {
  if (!calMemoId.value) return
  calSelected.value = date
  if (calendarFromEdit.value) {
    editFormDeadline.value = date
  } else {
    memoStore.updateDeadline(calMemoId.value, date, 3)
  }
}

function clearDeadline() {
  if (!calMemoId.value) return
  calSelected.value = null
  if (calendarFromEdit.value) {
    editFormDeadline.value = undefined
  } else {
    memoStore.updateDeadline(calMemoId.value, undefined)
  }
  closeCalendar()
}

function calPrevMonth() {
  calMonth.value--
  if (calMonth.value < 0) { calMonth.value = 11; calYear.value-- }
}

function calNextMonth() {
  calMonth.value++
  if (calMonth.value > 11) { calMonth.value = 0; calYear.value++ }
}

// --- Helpers ---
function formatTime(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins}分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  return new Date(ts).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

function deadlineText(memo: Memo): string {
  if (!memo.deadline) return ''
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dl = new Date(memo.deadline + 'T00:00:00')
  const diff = Math.ceil((dl.getTime() - today.getTime()) / 86400000)
  if (diff < 0) return `已过期${Math.abs(diff)}天`
  if (diff === 0) return '今天到期'
  if (diff === 1) return '明天到期'
  return `${diff}天后到期`
}
</script>

<style scoped>
.memo-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--c-bg);
  overflow-y: auto;
  width: 100%;
  min-width: 0;
}

/* ===== Header ===== */
.memo-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid var(--c-border);
}

.memo-title {
  font-weight: 700;
  font-size: 16px;
  color: var(--c-text-primary);
}

.header-actions {
  position: relative;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 2px;
  line-height: 1;
}

.export-overlay {
  position: fixed;
  inset: 0;
  z-index: 10;
  background: transparent;
  border: none;
  padding: 0;
}

.export-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 11;
  background: white;
  border: 1.5px solid var(--c-border);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-width: 100px;
}

.export-dropdown button {
  display: block;
  width: 100%;
  padding: 6px 12px;
  background: none;
  border: none;
  font-size: 13px;
  font-family: inherit;
  color: var(--c-text-primary);
  cursor: pointer;
  text-align: left;
}

.export-dropdown button:hover {
  background: var(--c-bg);
}

/* ===== Category bar ===== */
.category-bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 8px 0 8px 12px;
  height: 38px;
  border-bottom: 1px solid var(--c-border);
}

.cat-scroll {
  flex: 1;
  display: flex;
  gap: 5px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 2px;
  min-width: 0;
  scrollbar-width: thin;
  scrollbar-color: var(--c-border) transparent;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
}

.cat-scroll.dragging {
  cursor: grabbing;
}

.cat-scroll::-webkit-scrollbar { height: 3px; }
.cat-scroll::-webkit-scrollbar-track { background: transparent; }
.cat-scroll::-webkit-scrollbar-thumb { background: var(--c-border); border-radius: 2px; }

.cat-pill {
  flex-shrink: 0;
  padding: 4px 10px;
  border: 1px solid var(--c-border);
  border-radius: 12px;
  background: white;
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
  color: var(--c-text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.cat-pill:hover { border-color: var(--c-primary); color: var(--c-primary); }

.cat-pill.active {
  background: var(--c-primary);
  border-color: var(--c-primary);
  color: white;
}

.cat-add {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  margin: 0 8px;
  padding: 0;
  border: 1px dashed var(--c-border);
  border-radius: 50%;
  background: white;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  color: var(--c-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.cat-add:hover { color: var(--c-primary); border-color: var(--c-primary); }

/* ===== Category dialog ===== */
.cat-dialog {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cat-dialog-inner {
  background: white;
  border-radius: clamp(12px, 2vmin, 16px);
  padding: clamp(12px, 3vmin, 20px);
  width: clamp(220px, 60vmin, 280px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.cat-dialog-title {
  font-size: clamp(14px, 2.2vmin, 17px);
  font-weight: 700;
  color: var(--c-text-primary);
  margin-bottom: clamp(8px, 2vmin, 12px);
}

.cat-input {
  width: 100%;
  padding: clamp(5px, 1vmin, 8px) clamp(8px, 1.5vmin, 10px);
  border: 1.5px solid var(--c-border);
  border-radius: clamp(6px, 1vmin, 8px);
  font-size: clamp(12px, 1.8vmin, 15px);
  font-family: inherit;
  outline: none;
  color: var(--c-text-primary);
  box-sizing: border-box;
}

.cat-input:focus { border-color: var(--c-primary); }

.cat-dialog-btns {
  display: flex;
  gap: clamp(6px, 1.5vmin, 10px);
  margin-top: clamp(8px, 2vmin, 12px);
}

.cat-dialog-cancel, .cat-dialog-ok {
  flex: 1;
  padding: clamp(5px, 1vmin, 7px);
  border-radius: clamp(6px, 1vmin, 8px);
  font-size: clamp(12px, 1.7vmin, 14px);
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  border: none;
}

.cat-dialog-cancel {
  background: var(--c-border);
  color: var(--c-text-secondary);
}

.cat-dialog-ok {
  background: var(--c-primary);
  color: white;
}

.custom-cat-list {
  margin-top: clamp(8px, 2vmin, 12px);
  border-top: 1px solid var(--c-border);
  padding-top: clamp(6px, 1.5vmin, 10px);
}

.custom-cat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: clamp(3px, 0.6vmin, 5px) 0;
  font-size: clamp(11px, 1.6vmin, 14px);
  color: var(--c-text-primary);
}

.cat-remove {
  background: none;
  border: none;
  color: var(--c-text-muted);
  cursor: pointer;
  font-size: clamp(11px, 1.6vmin, 14px);
  padding: 0 4px;
}

.cat-remove:hover { color: var(--c-danger); }

/* ===== Input area ===== */
.input-area {
  flex-shrink: 0;
  padding: 6px 12px;
}

.memo-textarea {
  width: 100%;
  padding: 6px 10px;
  border: 1.5px solid var(--c-border);
  border-radius: 10px;
  font-size: 13px;
  font-family: inherit;
  resize: none;
  outline: none;
  color: var(--c-text-primary);
  background: white;
  box-sizing: border-box;
  line-height: 1.4;
}

.memo-textarea:focus { border-color: var(--c-primary); }

.input-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  flex-wrap: wrap;
  min-width: 0;
}

.cat-dropdown-wrapper {
  position: relative;
  flex-shrink: 0;
}

.cat-overlay {
  position: fixed;
  inset: 0;
  z-index: 10;
  background: transparent;
  border: none;
  padding: 0;
}

.cat-btn {
  padding: 3px 8px;
  border: 1.5px solid var(--c-border);
  border-radius: 7px;
  font-size: 12px;
  font-family: inherit;
  font-weight: 600;
  color: var(--c-text-primary);
  background: white;
  cursor: pointer;
  white-space: nowrap;
}

.cat-btn:hover { border-color: var(--c-primary); }

.cat-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 11;
  background: white;
  border: 1.5px solid var(--c-border);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 160px;
  overflow-y: auto;
  min-width: 90px;
  margin-top: 4px;
  margin-bottom: 0;
  scrollbar-width: thin;
  scrollbar-color: var(--c-border) transparent;
}

.cat-dropdown::-webkit-scrollbar { width: 4px; }
.cat-dropdown::-webkit-scrollbar-track { background: transparent; }
.cat-dropdown::-webkit-scrollbar-thumb { background: var(--c-border); border-radius: 2px; }

.cat-dropdown button {
  display: block;
  width: 100%;
  padding: 5px 12px;
  background: none;
  border: none;
  font-size: 12px;
  font-family: inherit;
  color: var(--c-text-primary);
  cursor: pointer;
  text-align: left;
  white-space: nowrap;
}

.cat-dropdown button:hover {
  background: var(--c-bg);
  color: var(--c-primary);
}

.cat-dropdown button.active {
  color: var(--c-primary);
  font-weight: 700;
}

.btn-star {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 0 2px;
  line-height: 1;
  opacity: 0.5;
  transition: opacity 0.15s;
}

.btn-star.active { opacity: 1; }

.btn-add {
  margin-left: auto;
  padding: 5px 14px;
  background: linear-gradient(145deg, var(--c-primary), var(--c-danger));
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-add:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-add:not(:disabled):hover { transform: translateY(-1px); }

/* ===== Memo list ===== */
.memo-list {
  flex: 1;
  padding: 6px 12px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-height: 0;
  position: relative;
  overflow-x: hidden;
}

.memo-empty {
  text-align: center;
  color: var(--c-text-muted);
  font-size: 13px;
  padding: 20px 0;
}

.memo-card {
  background: white;
  border: 1.5px solid var(--c-border);
  border-radius: 12px;
  padding: 8px 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: opacity 0.35s ease, transform 0.35s ease;
  min-width: 0;
  max-width: 100%;
}

.memo-list-move {
  transition: transform 0.4s ease;
}

.memo-list-enter-active {
  transition: all 0.3s ease;
}

.memo-list-leave-active {
  transition: all 0.25s ease;
  position: absolute;
  width: calc(100% - 24px);
}

.memo-list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.memo-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.memo-card.important {
  border-left: 3px solid var(--c-primary);
}

.memo-card.completed {
  opacity: 0.55;
  transition: opacity 0.35s ease;
}

.memo-card.completed .memo-content.done {
  text-decoration: line-through;
  text-decoration-color: var(--c-text-muted);
  color: var(--c-text-secondary);
}

.memo-card.completed:hover {
  opacity: 0.75;
}

.memo-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3px;
  flex-wrap: wrap;
  gap: 2px;
}

.memo-tags {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  min-width: 0;
}

.memo-cat-tag {
  font-size: 11px;
  font-weight: 700;
  color: var(--c-primary);
  background: rgba(242, 158, 109, 0.1);
  padding: 1px 6px;
  border-radius: 5px;
}

.deadline-tag {
  font-size: 10px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 5px;
  white-space: nowrap;
}

.deadline-tag.normal {
  color: var(--c-text-secondary);
  background: var(--c-border);
}

.deadline-tag.urgent {
  color: var(--c-danger);
  background: rgba(232, 139, 90, 0.12);
}

.deadline-tag.overdue {
  color: var(--c-danger);
  background: rgba(211, 47, 47, 0.1);
}

.memo-time {
  font-size: 11px;
  color: var(--c-text-muted);
}

.memo-content {
  font-size: 13px;
  color: var(--c-text-primary);
  line-height: 1.5;
  cursor: pointer;
  white-space: pre-wrap;
  word-break: break-word;
  min-width: 0;
}

.memo-content:hover { color: var(--c-primary); }
.memo-content.done { cursor: default; }
.memo-content.done:hover { color: var(--c-text-secondary); }

.memo-edit-area {
  width: 100%;
  padding: 4px 6px;
  border: 1.5px solid var(--c-primary);
  border-radius: 7px;
  font-size: 13px;
  font-family: inherit;
  resize: none;
  outline: none;
  color: var(--c-text-primary);
  line-height: 1.5;
  box-sizing: border-box;
}

.memo-card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 3px;
}

.btn-tiny {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 2px;
  line-height: 1;
  opacity: 0.4;
  transition: opacity 0.15s;
}

.btn-tiny:hover { opacity: 1; }
.btn-delete:hover { opacity: 1; color: var(--c-danger); }

.btn-check {
  opacity: 0.35;
  transition: opacity 0.15s, transform 0.15s;
}

.btn-check.checked {
  opacity: 0.7;
}

.btn-check:hover {
  opacity: 1;
  transform: scale(1.15);
}

.btn-calendar {
  opacity: 0.35;
}

.btn-calendar.active {
  opacity: 0.9;
  color: var(--c-primary);
}

.btn-calendar:hover {
  opacity: 1;
}

/* ===== Calendar Dialog ===== */
.cal-overlay {
  position: fixed;
  inset: 0;
  z-index: 210;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cal-dialog {
  background: white;
  border-radius: clamp(14px, 3vmin, 20px);
  padding: clamp(14px, 3.5vmin, 22px);
  width: clamp(240px, 65vmin, 300px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
}

.cal-title {
  font-size: clamp(14px, 2.2vmin, 17px);
  font-weight: 700;
  color: var(--c-text-primary);
  text-align: center;
  margin-bottom: clamp(8px, 2vmin, 12px);
}

.cal-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: clamp(6px, 1.5vmin, 10px);
}

.cal-nav-btn {
  background: none;
  border: none;
  font-size: clamp(12px, 2vmin, 16px);
  color: var(--c-text-muted);
  cursor: pointer;
  padding: clamp(2px, 0.5vmin, 4px) clamp(6px, 1.5vmin, 10px);
  font-family: inherit;
}

.cal-nav-btn:hover { color: var(--c-primary); }

.cal-month-label {
  font-size: clamp(12px, 1.8vmin, 15px);
  font-weight: 700;
  color: var(--c-text-primary);
}

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: clamp(2px, 0.4vmin, 3px);
}

.cal-weekday {
  text-align: center;
  font-size: clamp(9px, 1.2vmin, 11px);
  color: var(--c-text-muted);
  font-weight: 600;
  padding: clamp(2px, 0.5vmin, 4px) 0;
}

.cal-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: clamp(4px, 1vmin, 6px);
  font-size: clamp(10px, 1.5vmin, 13px);
  color: var(--c-text-primary);
  cursor: pointer;
  background: white;
  border: 1.5px solid transparent;
  transition: all 0.15s;
  padding: 0;
  font-family: inherit;
}

.cal-day:not(.empty):hover { border-color: var(--c-primary); }

.cal-day.empty {
  background: transparent;
  cursor: default;
}

.cal-day.past {
  color: var(--c-border);
  cursor: not-allowed;
}

.cal-day.past:hover { border-color: transparent; }

.cal-day.today {
  border-color: var(--c-secondary);
  border-width: 2px;
  font-weight: 700;
}

.cal-day.selected {
  background: var(--c-primary);
  border-color: var(--c-primary);
  color: white;
  font-weight: 700;
}

.cal-day.selected.today {
  border-color: var(--c-primary);
}

.cal-actions {
  display: flex;
  justify-content: center;
  gap: clamp(8px, 2vmin, 12px);
  margin-top: clamp(10px, 2.5vmin, 14px);
}

.cal-btn-clear, .cal-btn-close {
  padding: clamp(5px, 1vmin, 7px) clamp(12px, 3vmin, 18px);
  border-radius: clamp(6px, 1.2vmin, 8px);
  font-size: clamp(11px, 1.5vmin, 13px);
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  border: none;
}

.cal-btn-clear {
  background: rgba(211, 47, 47, 0.1);
  color: var(--c-danger);
}

.cal-btn-clear:hover { background: rgba(211, 47, 47, 0.18); }

.cal-btn-close {
  background: var(--c-border);
  color: var(--c-text-secondary);
}

.cal-btn-close:hover { background: var(--c-border); }

/* ===== Footer ===== */
.memo-footer {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  font-size: 11px;
  color: var(--c-text-muted);
  border-top: 1px solid var(--c-border);
  flex-wrap: wrap;
  gap: 4px;
}

.memo-stats {
  white-space: normal;
}

.btn-clear {
  padding: 4px 10px;
  border: 1px solid var(--c-border);
  border-radius: 7px;
  background: white;
  font-size: 11px;
  font-family: inherit;
  font-weight: 600;
  color: var(--c-text-muted);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.btn-clear:hover { border-color: var(--c-danger); color: var(--c-danger); }

.btn-clear-confirm {
  border-color: var(--c-danger);
  color: var(--c-danger);
  background: var(--c-bg);
  animation: pulse-confirm 1s ease infinite;
}

.btn-clear-cancel {
  color: var(--c-text-muted);
  border-color: var(--c-border);
}

.btn-clear-cancel:hover {
  border-color: var(--c-text-muted);
  color: var(--c-text-primary);
}

@keyframes pulse-confirm {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* ===== Edit Dialog (dblclick) ===== */
.edit-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-dialog {
  background: white;
  border-radius: clamp(12px, 2vmin, 16px);
  padding: clamp(14px, 3vmin, 20px);
  width: clamp(240px, 65vmin, 300px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 1.8vmin, 12px);
}

.edit-dialog-title {
  font-size: clamp(14px, 2.2vmin, 17px);
  font-weight: 700;
  color: var(--c-text-primary);
}

.edit-textarea {
  width: 100%;
  padding: clamp(6px, 1.2vmin, 8px) clamp(8px, 1.5vmin, 10px);
  border: 1.5px solid var(--c-border);
  border-radius: clamp(8px, 1.5vmin, 12px);
  font-size: clamp(12px, 1.8vmin, 15px);
  font-family: inherit;
  resize: none;
  outline: none;
  color: var(--c-text-primary);
  line-height: 1.5;
  box-sizing: border-box;
}

.edit-textarea:focus { border-color: var(--c-primary); }

.edit-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.edit-label {
  font-size: clamp(12px, 1.6vmin, 14px);
  font-weight: 600;
  color: var(--c-text-primary);
}

.edit-star-btn {
  padding: clamp(3px, 0.6vmin, 5px) clamp(8px, 2vmin, 12px);
  border: 1.5px solid var(--c-border);
  border-radius: clamp(6px, 1vmin, 8px);
  background: white;
  font-size: clamp(11px, 1.5vmin, 13px);
  font-family: inherit;
  font-weight: 600;
  color: var(--c-text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}

.edit-star-btn.active {
  border-color: var(--c-primary);
  color: var(--c-primary);
  background: rgba(242, 158, 109, 0.08);
}

.edit-deadline-row {
  display: flex;
  align-items: center;
  gap: clamp(4px, 1vmin, 6px);
}

.edit-deadline-text {
  font-size: clamp(11px, 1.5vmin, 13px);
  font-weight: 600;
  color: var(--c-primary);
  background: rgba(242, 158, 109, 0.1);
  padding: clamp(2px, 0.4vmin, 3px) clamp(6px, 1.2vmin, 8px);
  border-radius: clamp(4px, 0.8vmin, 6px);
}

.edit-deadline-none {
  font-size: clamp(11px, 1.5vmin, 13px);
  color: var(--c-text-muted);
}

.edit-cal-btn {
  background: none;
  border: 1.5px solid var(--c-border);
  border-radius: clamp(4px, 0.8vmin, 6px);
  padding: clamp(2px, 0.4vmin, 3px) clamp(5px, 1vmin, 7px);
  font-size: clamp(12px, 1.8vmin, 15px);
  cursor: pointer;
  line-height: 1;
}

.edit-cal-btn:hover { border-color: var(--c-primary); }

.edit-cal-clear {
  background: none;
  border: none;
  color: var(--c-text-muted);
  font-size: clamp(10px, 1.4vmin, 13px);
  cursor: pointer;
  padding: 0 2px;
}

.edit-cal-clear:hover { color: var(--c-danger); }

.edit-dialog-btns {
  display: flex;
  gap: clamp(8px, 2vmin, 12px);
  margin-top: clamp(2px, 0.5vmin, 4px);
}

.edit-btn-cancel, .edit-btn-save {
  flex: 1;
  padding: clamp(6px, 1.2vmin, 8px);
  border-radius: clamp(6px, 1.2vmin, 8px);
  font-size: clamp(12px, 1.7vmin, 14px);
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  border: none;
}

.edit-btn-cancel {
  background: var(--c-border);
  color: var(--c-text-secondary);
}

.edit-btn-save {
  background: linear-gradient(145deg, var(--c-primary), var(--c-danger));
  color: white;
}

.edit-btn-save:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.edit-btn-save:not(:disabled):hover { transform: translateY(-1px); }

/* ===== Category Edit Dialog ===== */
.cat-edit-overlay {
  position: fixed;
  inset: 0;
  z-index: 220;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cat-edit-inner {
  background: white;
  border-radius: 14px;
  padding: 16px;
  width: 250px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.cat-edit-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--c-text-primary);
  margin-bottom: 10px;
}

.cat-edit-input {
  width: 100%;
  padding: 6px 9px;
  border: 1.5px solid var(--c-border);
  border-radius: 7px;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  color: var(--c-text-primary);
  box-sizing: border-box;
}

.cat-edit-input:focus { border-color: var(--c-primary); }

.cat-edit-btns {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.btn-dialog-cancel, .btn-dialog-ok, .btn-dialog-delete {
  flex: 1;
  padding: 6px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  border: none;
}

.btn-dialog-cancel { background: var(--c-border); color: var(--c-text-secondary); }
.btn-dialog-ok { background: var(--c-primary); color: white; }
.btn-dialog-delete { background: var(--c-danger); color: white; }

.btn-dialog-cancel:hover { background: var(--c-border); }
.btn-dialog-ok:hover { opacity: 0.9; }
.btn-dialog-delete:hover { opacity: 0.9; }

.cat-delete-confirm {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--c-border);
}

.cat-delete-hint {
  font-size: 11px;
  color: var(--c-text-muted);
  line-height: 1.4;
  margin-bottom: 8px;
}
</style>
