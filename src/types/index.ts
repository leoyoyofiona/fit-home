// 核心类型定义

export type Gender = 'male' | 'female'

export interface Profile {
  name: string // 昵称（排行榜显示用）
  height: number // cm
  weight: number // kg
  gender: Gender
  age: number
}

// 动作模式：按时长(秒) 或 按次数
export type ExerciseMode = 'duration' | 'reps'

export interface Exercise {
  id: string
  name: string // 中文名
  nameEn: string
  area: string // 目标部位
  mode: ExerciseMode
  reps: number // 每组次数（reps 模式；duration 模式为 0）
  value: number // duration: 该组总秒数；reps: 该组总时长秒数（≈ reps × tempo）
  tempo: number // 每次动作节奏秒数（reps 模式：reps × tempo ≈ value）
  rest: number // 动作后休息秒数
  cue: string // 中文口令文本（TTS 朗读）
  videoSrc?: string // 真实视频路径（占位阶段为空）
  svgType?: SvgFigureType // 占位动画人形类型
}

export type SvgFigureType =
  | 'jumpingJack'
  | 'squat'
  | 'pushup'
  | 'crunch'
  | 'plank'
  | 'russianTwist'
  | 'legRaise'
  | 'lunge'
  | 'mountainClimber'
  | 'burpee'

// 训练目标
export type GoalGender = 'male' | 'female' | 'all'

export interface Goal {
  id: string
  name: string
  desc: string
  icon: string
  planId: string
  gender: GoalGender // 适合性别
  tag: string // 简短标签，如"女性首选"
}

// 计划中"一天"的训练编排
export interface PlanDay {
  day: number
  title: string
  exerciseIds: string[] // 动作顺序
  sets: number // 组数
  restBetweenSets: number // 组间休息秒数
}

export interface Plan {
  id: string
  name: string
  goalId: string
  desc: string
  days: PlanDay[]
}

// 打卡记录
export interface Checkin {
  date: string // YYYY-MM-DD
  planId: string
  day: number
  exerciseCount: number
  durationSec: number
  calories: number // 估算消耗
  at: number // 时间戳
}

export interface AppState {
  profile: Profile | null
  enrolledPlanId: string | null
  checkins: Record<string, Checkin> // key: date
}
