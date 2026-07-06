import type { Goal, Plan } from '../types'

// 训练目标
export const goals: Goal[] = [
  {
    id: 'abs',
    name: '练腹肌',
    desc: '雕刻马甲线与人鱼线，核心更紧致',
    icon: '🏋️',
    planId: 'plan-abs-7',
  },
  {
    id: 'fat-loss',
    name: '瘦身减肥',
    desc: '全身燃脂，提升代谢，甩掉赘肉',
    icon: '🔥',
    planId: 'plan-fat-14',
  },
  {
    id: 'muscle',
    name: '增肌塑形',
    desc: '俯卧撑深蹲组合，练出线条',
    icon: '💪',
    planId: 'plan-muscle-7',
  },
]

// 预设计划套餐
// 每天约 5-10 分钟：5-6 个动作 × 2 组
export const plans: Plan[] = [
  {
    id: 'plan-abs-7',
    name: '7天腹肌雕塑',
    goalId: 'abs',
    desc: '7天集中训练腹部，每天约6分钟，居家无器械。',
    days: [
      buildDay(1, '激活核心', ['crunch', 'russian-twist', 'leg-raise', 'plank', 'mountain-climber'], 2, 30),
      buildDay(2, '上腹强化', ['crunch', 'leg-raise', 'plank', 'russian-twist', 'crunch'], 2, 30),
      buildDay(3, '侧腹雕刻', ['russian-twist', 'plank', 'mountain-climber', 'russian-twist', 'crunch'], 2, 30),
      buildDay(4, '下腹突击', ['leg-raise', 'crunch', 'mountain-climber', 'plank', 'leg-raise'], 2, 30),
      buildDay(5, '综合燃腹', ['mountain-climber', 'crunch', 'russian-twist', 'leg-raise', 'plank'], 2, 30),
      buildDay(6, '耐力挑战', ['plank', 'crunch', 'leg-raise', 'russian-twist', 'mountain-climber', 'crunch'], 2, 30),
      buildDay(7, '终极腹肌', ['crunch', 'russian-twist', 'leg-raise', 'plank', 'mountain-climber', 'burpee'], 2, 30),
    ],
  },
  {
    id: 'plan-fat-14',
    name: '14天燃脂减重',
    goalId: 'fat-loss',
    desc: '14天全身燃脂计划，每天约8分钟，循序渐进。',
    days: [
      buildDay(1, '燃脂启动', ['jumping-jack', 'squat', 'mountain-climber', 'plank', 'jumping-jack'], 2, 30),
      buildDay(2, '下肢燃脂', ['squat', 'lunge', 'jumping-jack', 'squat', 'mountain-climber'], 2, 30),
      buildDay(3, '上肢与核心', ['pushup', 'plank', 'crunch', 'pushup', 'mountain-climber'], 2, 30),
      buildDay(4, '全身激活', ['jumping-jack', 'squat', 'pushup', 'plank', 'burpee'], 2, 30),
      buildDay(5, '高强度间歇', ['burpee', 'mountain-climber', 'jumping-jack', 'squat', 'burpee'], 2, 30),
      buildDay(6, '核心稳固', ['plank', 'russian-twist', 'leg-raise', 'crunch', 'mountain-climber'], 2, 30),
      buildDay(7, '燃脂冲刺', ['jumping-jack', 'burpee', 'squat', 'mountain-climber', 'lunge'], 2, 30),
      buildDay(8, '腿部轰炸', ['squat', 'lunge', 'jumping-jack', 'squat', 'burpee'], 2, 30),
      buildDay(9, '胸臂强化', ['pushup', 'plank', 'mountain-climber', 'pushup', 'burpee'], 2, 30),
      buildDay(10, '燃脂循环', ['jumping-jack', 'squat', 'pushup', 'mountain-climber', 'plank'], 2, 30),
      buildDay(11, '爆发训练', ['burpee', 'jumping-jack', 'squat', 'lunge', 'mountain-climber'], 2, 30),
      buildDay(12, '核心熔炉', ['plank', 'crunch', 'russian-twist', 'leg-raise', 'mountain-climber'], 2, 30),
      buildDay(13, '终极挑战', ['burpee', 'squat', 'pushup', 'mountain-climber', 'jumping-jack'], 2, 30),
      buildDay(14, '毕业燃脂', ['jumping-jack', 'burpee', 'lunge', 'plank', 'mountain-climber', 'squat'], 2, 30),
    ],
  },
  {
    id: 'plan-muscle-7',
    name: '7天增肌入门',
    goalId: 'muscle',
    desc: '7天无器械增肌，俯卧撑深蹲为主，每天约7分钟。',
    days: [
      buildDay(1, '胸臂启动', ['pushup', 'plank', 'pushup', 'mountain-climber', 'plank'], 2, 30),
      buildDay(2, '腿部基础', ['squat', 'lunge', 'squat', 'jumping-jack', 'squat'], 2, 30),
      buildDay(3, '核心稳定', ['plank', 'crunch', 'leg-raise', 'russian-twist', 'plank'], 2, 30),
      buildDay(4, '胸腿组合', ['pushup', 'squat', 'pushup', 'lunge', 'plank'], 2, 30),
      buildDay(5, '爆发增肌', ['burpee', 'pushup', 'squat', 'mountain-climber', 'plank'], 2, 30),
      buildDay(6, '上肢强化', ['pushup', 'plank', 'pushup', 'crunch', 'mountain-climber'], 2, 30),
      buildDay(7, '全身增肌', ['squat', 'pushup', 'lunge', 'plank', 'burpee', 'mountain-climber'], 2, 30),
    ],
  },
]

function buildDay(
  day: number,
  title: string,
  exerciseIds: string[],
  sets: number,
  restBetweenSets: number
) {
  return { day, title, exerciseIds, sets, restBetweenSets }
}

export const planMap: Record<string, Plan> = Object.fromEntries(
  plans.map((p) => [p.id, p])
)

export function getPlan(id: string | null): Plan | undefined {
  if (!id) return undefined
  return planMap[id]
}

export function getGoal(id: string): Goal | undefined {
  return goals.find((g) => g.id === id)
}
