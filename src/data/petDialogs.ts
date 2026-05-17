import type { PetType } from '@/types/pet'

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'

export interface PetDialogSet {
  greetings: Record<TimeOfDay, string[]>
  idle: string[]
  click: string[]
  happy: string[]
  sad: string[]
  encourage: string[]
  pomodoroComplete: string[]
  breakTime: string[]
  sleep: string[]
  speciesAction: string[]
  habitReminder: string[]
  memoReminder: string[]
  todayTodo: string[]
}

function getTimeOfDay(): TimeOfDay {
  const h = new Date().getHours()
  if (h >= 6 && h < 12) return 'morning'
  if (h >= 12 && h < 18) return 'afternoon'
  if (h >= 18 && h < 22) return 'evening'
  return 'night'
}

const DIALOGS: Record<PetType, PetDialogSet> = {
  cat: {
    greetings: {
      morning: ['早安喵~ 今天的阳光好暖', '喵呜...新的一天开始啦', '主人早上好，伸个懒腰~'],
      afternoon: ['下午好喵~ 吃午饭了吗?', '喵~ 下午也要加油哦', '太阳暖暖的好想打盹...'],
      evening: ['晚上好喵~ 今天辛苦了', '喵呜~ 回家啦，我来迎接你', '晚餐时间到喵!'],
      night: ['这么晚了还在学吗喵?', '喵~ 夜深了注意休息', '我陪你熬夜喵...'],
    },
    idle: ['喵~', '蹭蹭~', '尾巴摇摇~', '打个哈欠...', '舔舔爪子~', '喵呜~', '用头蹭你~', '竖起耳朵听~'],
    click: ['喵！别戳我~', '嘻嘻，好痒~', '喵呜~ 再摸摸', '蹭蹭主人的手~', '喵喵喵!', '尾巴竖起来啦~'],
    happy: ['开心到转圈圈喵!', '喵呜~ 太棒了!', '幸福地打呼噜~', '蹭蹭蹭~ 最喜欢你了!', '喵~ 开心!', '尾巴翘得高高的~'],
    sad: ['喵...我不开心', '低着头喵...', '尾巴垂下来了...', '喵呜...抱抱我', '蜷成一团...', '呜喵...'],
    encourage: ['主人加油喵!', '我可以陪你哦~', '专注的时候最帅了喵!', '喵~ 你能做到的!', '一起努力吧喵!', '我会一直在这里~'],
    pomodoroComplete: ['太厉害了喵!', '喵呜~ 完成一个啦!', '休息一下吧喵~', '主人真棒喵!', '喵~ 奖励自己一下吧!'],
    breakTime: ['休息时间喵~', '来玩一会儿吧喵!', '喵~ 伸个懒腰', '喝点水喵~', '跟我玩一下嘛~'],
    sleep: ['喵...好困...', '打盹中...zzz', '蜷成一团睡着了...', '喵呼...喵呼...'],
    speciesAction: ['舔了舔爪子', '用尾巴扫了扫你的手', '竖起耳朵听了听', '弓背伸了个懒腰', '用头蹭了蹭你', '悄悄踩了踩你的脚'],
    habitReminder: ['喵~ 今天的习惯还没完成哦', '打卡时间到喵！', '坚持就是胜利喵~', '别忘了打卡喵！', '一起完成今天的习惯吧喵~'],
    memoReminder: ['喵~ 有事快到期了哦', '别忘了你的备忘哦喵！', '喵呜~ 赶紧看看备忘吧', '有重要的事要处理喵！'],
    todayTodo: ['喵~ 今天还有事要做哦', '新的一天喵，一起加油！', '今天也有不���事呢喵~', '喵呜~ 规划好今天的行程吧！'],
  },

  dog: {
    greetings: {
      morning: ['汪! 早上好主人!', '摇尾巴~ 新的一天!', '主人起床啦! 汪汪!'],
      afternoon: ['汪~ 下午好!', '主人吃饭了吗? 汪!', '下午也要元气满满汪!'],
      evening: ['主人回来啦! 汪汪汪!', '摇尾巴迎接你~ 汪!', '晚上好汪! 我等你好久了'],
      night: ['汪...该休息了', '主人别太晚汪~', '我守着你汪...'],
    },
    idle: ['汪~', '摇尾巴~', '趴着等你~', '吐舌头~', '歪头看你~', '汪汪~', '耳朵竖起来~', '我在这里陪着你哦主人！', '汪汪！'],
    click: ['汪! 摸摸我!', '开心地转圈圈!', '汪汪! 再摸摸!', '舔舔你的手~', '摇尾巴~汪!', '蹭蹭你!'],
    happy: ['汪汪汪! 太开心了!', '疯狂摇尾巴~', '跳起来汪!', '转圈圈汪汪汪!', '汪~ 幸福!', '舌头伸出来笑~'],
    sad: ['汪...呜呜', '耷拉耳朵...', '趴着不动了汪...', '呜汪...陪陪我', '尾巴垂下来了...', '用鼻子拱你的手...'],
    encourage: ['主人加油汪!', '汪汪! 你最棒了!', '我给你加油汪~', '汪! 一定行的!', '陪主人一起努力汪!', '汪汪~ 冲冲冲!'],
    pomodoroComplete: ['汪汪汪! 太棒了!', '主人好厉害汪!', '跳起来庆祝汪~', '汪! 休息一下!'],
    breakTime: ['玩球球汪!', '汪~ 出去走走吧', '摇尾巴等你玩~', '汪汪~ 休息啦!'],
    sleep: ['汪...呼呼...', '趴着打盹中...', '翻了个身继续睡...', '汪呼...汪呼...'],
    speciesAction: ['疯狂摇尾巴', '歪头看你了一下', '用鼻子拱了拱你', '趴下来把头放在爪子上'],
    habitReminder: ['汪！今天的习惯还没打卡！', '汪汪~ 快去打卡吧！', '坚持打卡汪！', '汪~ 你能坚持的对吧！', '汪汪汪！别忘了习惯哦！'],
    memoReminder: ['汪！有备忘快到期了！', '汪汪~ 别忘了你的待办！', '汪~ 赶紧看看备忘吧！', '有事情要处理汪！'],
    todayTodo: ['汪！今天还有事没做！', '汪汪~ 加油完成今天的事！', '新的一天汪！冲冲冲！', '汪~ 我陪你一起完成任务！'],
  },
}

export function getPetDialog(petType: PetType, category: keyof PetDialogSet): string[] {
  const set = DIALOGS[petType]
  if (!set) return []
  if (category === 'greetings') {
    return set.greetings[getTimeOfDay()]
  }
  return set[category] as string[]
}

export function getRandomDialog(
  petType: PetType,
  category: keyof PetDialogSet,
  exclude: string[] = []
): string {
  const pool = getPetDialog(petType, category).filter(t => !exclude.includes(t))
  const source = pool.length > 0 ? pool : getPetDialog(petType, category)
  if (source.length === 0) return '...'
  return source[Math.floor(Math.random() * source.length)]
}

export { getTimeOfDay }
