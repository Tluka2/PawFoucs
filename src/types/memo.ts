export interface Memo {
  id: string
  content: string           // 1-500 chars
  timestamp: number
  isImportant: boolean
  category: string
  completed: boolean
  deadline?: string         // YYYY-MM-DD
  remindDays?: number       // 提前几天提醒: 1 或 3
}

export const PRESET_CATEGORIES = ['学习', '工作', '生活', '灵感', '待办'] as const