import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppState, Profile, Checkin } from '../types'
import { getPlan } from '../data/plans'
import { getExercise } from '../data/exercises'

interface Store extends AppState {
  setProfile: (p: Profile) => void
  setName: (name: string) => void
  enroll: (planId: string) => void
  unenroll: () => void
  checkin: (c: Checkin) => void
  // 当前应练第几天（由打卡记录推算，1-based）
  currentDay: () => number
  // 该计划已打卡天数
  completedDays: () => number
  isTodayChecked: () => boolean
}

function todayKey(): string {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

// 估算消耗（MET 粗略）：体重kg × 0.06 × 分钟
export function estimateCalories(weightKg: number, durationSec: number): number {
  const minutes = durationSec / 60
  return Math.round(weightKg * 0.06 * minutes * 10) / 10
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      profile: null,
      enrolledPlanId: null,
      checkins: {},

      setProfile: (p) => set({ profile: p }),

      setName: (name) =>
        set((s) => (s.profile ? { profile: { ...s.profile, name } } : s)),

      enroll: (planId) => set({ enrolledPlanId: planId, checkins: {} }),
      unenroll: () => set({ enrolledPlanId: null }),

      checkin: (c) =>
        set((s) => ({ checkins: { ...s.checkins, [c.date]: c } })),

      currentDay: () => {
        const { enrolledPlanId, checkins } = get()
        const plan = getPlan(enrolledPlanId)
        if (!plan) return 1
        // 统计该计划已打卡且按天顺序推进
        const done = Object.values(checkins)
          .filter((c) => c.planId === plan.id)
          .map((c) => c.day)
        const maxDay = done.length ? Math.max(...done) : 0
        return Math.min(maxDay + 1, plan.days.length)
      },

      completedDays: () => {
        const { enrolledPlanId, checkins } = get()
        if (!enrolledPlanId) return 0
        return Object.values(checkins).filter((c) => c.planId === enrolledPlanId).length
      },

      isTodayChecked: () => {
        return !!get().checkins[todayKey()]
      },
    }),
    { name: 'fit-home-store' }
  )
)

export { todayKey }

// 工具：计算某天训练总时长（秒）
export function calcDayDuration(planId: string, dayNumber: number): number {
  const plan = getPlan(planId)
  if (!plan) return 0
  const day = plan.days.find((d) => d.day === dayNumber) ?? plan.days[0]
  let total = 0
  for (let s = 0; s < day.sets; s++) {
    day.exerciseIds.forEach((id) => {
      const ex = getExercise(id)
      total += ex.value // duration: 秒；reps: 该组总时长（≈ reps × tempo）
      total += ex.rest
    })
    if (s < day.sets - 1) total += day.restBetweenSets
  }
  return total
}
