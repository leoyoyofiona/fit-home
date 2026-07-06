import type { Checkin } from '../types'

// 排行榜选手统计
export interface PlayerStats {
  name: string
  totalMinutes: number // 累计训练分钟
  totalActions: number // 累计完成动作数
  streak: number // 连续打卡天数（中断则归零）
  isMe?: boolean
}

// 日期 → 'YYYY-MM-DD'
function dateKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${dd}`
}

// 计算连续打卡天数：从今天往回数，若今天未打卡则从昨天起算（给今天一个宽限），
// 遇到缺勤日即中断归零
export function calcStreak(checkins: Record<string, Checkin>): number {
  const keys = new Set(Object.keys(checkins))
  if (keys.size === 0) return 0
  const d = new Date()
  // 今天未打卡 → 从昨天起算（今天还没练不算中断）
  if (!keys.has(dateKey(d))) {
    d.setDate(d.getDate() - 1)
    if (!keys.has(dateKey(d))) return 0
  }
  let streak = 0
  while (keys.has(dateKey(d))) {
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

// 综合得分：训练分钟×1 + 完成动作×2 + 连续打卡×8
// 连续打卡权重最高，鼓励坚持不中断
export function scoreOf(s: Pick<PlayerStats, 'totalMinutes' | 'totalActions' | 'streak'>): number {
  return s.totalMinutes + s.totalActions * 2 + s.streak * 8
}

// 示范选手（本地演示用，跨用户真实排行需联网后端 —— Phase 2）
// 数据刻意拉开梯度，便于用户随训练积累逐步攀升
export const DEMO_PLAYERS: PlayerStats[] = [
  { name: '健身达人小王', totalMinutes: 320, totalActions: 580, streak: 14 },
  { name: '坚持的阿明', totalMinutes: 210, totalActions: 410, streak: 9 },
  { name: '马甲线少女', totalMinutes: 180, totalActions: 350, streak: 7 },
  { name: '每日打卡侠', totalMinutes: 150, totalActions: 290, streak: 12 },
  { name: '周末战士', totalMinutes: 90, totalActions: 180, streak: 0 },
  { name: '新手小李', totalMinutes: 60, totalActions: 120, streak: 3 },
]

export type SortKey = 'score' | 'minutes' | 'actions' | 'streak'

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'score', label: '综合' },
  { key: 'minutes', label: '时长' },
  { key: 'actions', label: '动作' },
  { key: 'streak', label: '连续' },
]

export function getValue(p: PlayerStats, key: SortKey): number {
  switch (key) {
    case 'score':
      return scoreOf(p)
    case 'minutes':
      return p.totalMinutes
    case 'actions':
      return p.totalActions
    case 'streak':
      return p.streak
  }
}
