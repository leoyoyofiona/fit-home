import type { Goal, Plan } from '../types'

// 训练目标（按性别分类）
export const goals: Goal[] = [
  // === 女性 ===
  {
    id: 'female-booty',
    name: '翘臀美腿',
    desc: '专注臀腿线条，练出蜜桃臀',
    icon: '🍑',
    planId: 'plan-booty-7',
    gender: 'female',
    tag: '女性首选',
  },
  {
    id: 'female-slim',
    name: '纤体瘦身',
    desc: '全身温和燃脂，循序渐进减重',
    icon: '🦋',
    planId: 'plan-slim-14',
    gender: 'female',
    tag: '14天',
  },
  {
    id: 'female-abs',
    name: '马甲线',
    desc: '雕刻腹部线条，练出马甲线',
    icon: '✨',
    planId: 'plan-female-abs-7',
    gender: 'female',
    tag: '7天',
  },
  // === 男性 ===
  {
    id: 'male-chest',
    name: '胸肌臂力',
    desc: '俯卧撑+波比跳，练出宽厚胸肌',
    icon: '💪',
    planId: 'plan-chest-7',
    gender: 'male',
    tag: '男性首选',
  },
  {
    id: 'muscle',
    name: '增肌塑形',
    desc: '全身增肌，俯卧撑深蹲组合',
    icon: '🏋️',
    planId: 'plan-muscle-7',
    gender: 'male',
    tag: '7天',
  },
  // === 通用 ===
  {
    id: 'abs',
    name: '腹肌雕刻',
    desc: '核心集中训练，腹肌人鱼线',
    icon: '🔥',
    planId: 'plan-abs-7',
    gender: 'all',
    tag: '通用',
  },
  {
    id: 'fat-loss',
    name: '燃脂减重',
    desc: 'HIIT高强度间歇，快速甩脂',
    icon: '⚡',
    planId: 'plan-fat-14',
    gender: 'all',
    tag: '14天',
  },
]

// 预设计划套餐
// 每天约 5-10 分钟：5 个不同动作 × 2 组（同一天内无重复动作）
export const plans: Plan[] = [
  // === 翘臀美腿 7天（女性） ===
  {
    id: 'plan-booty-7',
    name: '7天翘臀美腿',
    goalId: 'female-booty',
    desc: '7天专注臀腿，每天约6分钟，居家无器械。',
    days: [
      buildDay(1, '臀腿激活', ['squat', 'lunge', 'jumping-jack', 'mountain-climber', 'plank'], 2, 30),
      buildDay(2, '深蹲强化', ['lunge', 'squat', 'jumping-jack', 'russian-twist', 'mountain-climber'], 2, 30),
      buildDay(3, '弓步进阶', ['squat', 'lunge', 'mountain-climber', 'crunch', 'plank'], 2, 30),
      buildDay(4, '臀腿燃脂', ['jumping-jack', 'squat', 'lunge', 'leg-raise', 'plank'], 2, 30),
      buildDay(5, '综合塑形', ['lunge', 'squat', 'mountain-climber', 'plank', 'russian-twist'], 2, 30),
      buildDay(6, '臀腿冲刺', ['squat', 'jumping-jack', 'lunge', 'crunch', 'mountain-climber'], 2, 30),
      buildDay(7, '终极美腿', ['lunge', 'squat', 'jumping-jack', 'plank', 'burpee'], 2, 30),
    ],
  },
  // === 纤体瘦身 14天（女性） ===
  {
    id: 'plan-slim-14',
    name: '14天纤体瘦身',
    goalId: 'female-slim',
    desc: '14天温和燃脂，每天约7分钟，循序渐进。',
    days: [
      buildDay(1, '温和启动', ['jumping-jack', 'squat', 'crunch', 'plank', 'lunge'], 2, 30),
      buildDay(2, '全身激活', ['squat', 'lunge', 'russian-twist', 'mountain-climber', 'jumping-jack'], 2, 30),
      buildDay(3, '核心唤醒', ['crunch', 'leg-raise', 'plank', 'jumping-jack', 'mountain-climber'], 2, 30),
      buildDay(4, '臀腿温和', ['jumping-jack', 'squat', 'lunge', 'plank', 'russian-twist'], 2, 30),
      buildDay(5, '燃脂加速', ['mountain-climber', 'crunch', 'squat', 'lunge', 'jumping-jack'], 2, 30),
      buildDay(6, '腹部塑形', ['plank', 'leg-raise', 'crunch', 'jumping-jack', 'squat'], 2, 30),
      buildDay(7, '全身循环', ['jumping-jack', 'lunge', 'squat', 'mountain-climber', 'crunch'], 2, 30),
      buildDay(8, '腰腹紧致', ['squat', 'russian-twist', 'lunge', 'plank', 'jumping-jack'], 2, 30),
      buildDay(9, '核心强化', ['crunch', 'mountain-climber', 'leg-raise', 'squat', 'jumping-jack'], 2, 30),
      buildDay(10, '臀腿塑形', ['jumping-jack', 'squat', 'plank', 'lunge', 'russian-twist'], 2, 30),
      buildDay(11, '燃脂冲刺', ['lunge', 'mountain-climber', 'crunch', 'jumping-jack', 'plank'], 2, 30),
      buildDay(12, '腹部雕刻', ['squat', 'crunch', 'leg-raise', 'jumping-jack', 'mountain-climber'], 2, 30),
      buildDay(13, '全身激活', ['jumping-jack', 'lunge', 'plank', 'squat', 'russian-twist'], 2, 30),
      buildDay(14, '毕业瘦身', ['mountain-climber', 'squat', 'crunch', 'lunge', 'jumping-jack'], 2, 30),
    ],
  },
  // === 马甲线 7天（女性） ===
  {
    id: 'plan-female-abs-7',
    name: '7天马甲线',
    goalId: 'female-abs',
    desc: '7天腹部雕刻，每天约6分钟，练出马甲线。',
    days: [
      buildDay(1, '腹部激活', ['crunch', 'russian-twist', 'leg-raise', 'plank', 'mountain-climber'], 2, 30),
      buildDay(2, '下腹强化', ['leg-raise', 'crunch', 'russian-twist', 'plank', 'jumping-jack'], 2, 30),
      buildDay(3, '侧腹雕刻', ['russian-twist', 'leg-raise', 'crunch', 'mountain-climber', 'plank'], 2, 30),
      buildDay(4, '核心稳固', ['crunch', 'plank', 'leg-raise', 'russian-twist', 'jumping-jack'], 2, 30),
      buildDay(5, '综合燃腹', ['plank', 'crunch', 'mountain-climber', 'leg-raise', 'russian-twist'], 2, 30),
      buildDay(6, '耐力挑战', ['leg-raise', 'russian-twist', 'crunch', 'jumping-jack', 'plank'], 2, 30),
      buildDay(7, '马甲线成形', ['crunch', 'leg-raise', 'russian-twist', 'plank', 'mountain-climber'], 2, 30),
    ],
  },
  // === 胸肌臂力 7天（男性） ===
  {
    id: 'plan-chest-7',
    name: '7天胸肌臂力',
    goalId: 'male-chest',
    desc: '7天上肢轰炸，每天约7分钟，练出宽厚胸肌。',
    days: [
      buildDay(1, '胸臂启动', ['pushup', 'plank', 'mountain-climber', 'burpee', 'crunch'], 2, 30),
      buildDay(2, '俯卧撑强化', ['pushup', 'burpee', 'plank', 'mountain-climber', 'leg-raise'], 2, 30),
      buildDay(3, '核心支撑', ['plank', 'pushup', 'crunch', 'mountain-climber', 'burpee'], 2, 30),
      buildDay(4, '爆发训练', ['burpee', 'pushup', 'plank', 'russian-twist', 'mountain-climber'], 2, 30),
      buildDay(5, '胸肌轰炸', ['pushup', 'mountain-climber', 'burpee', 'plank', 'leg-raise'], 2, 30),
      buildDay(6, '力量耐力', ['plank', 'pushup', 'burpee', 'crunch', 'mountain-climber'], 2, 30),
      buildDay(7, '终极胸臂', ['pushup', 'burpee', 'mountain-climber', 'plank', 'russian-twist'], 2, 30),
    ],
  },
  // === 增肌塑形 7天（男性） ===
  {
    id: 'plan-muscle-7',
    name: '7天增肌塑形',
    goalId: 'muscle',
    desc: '7天全身增肌，俯卧撑深蹲为主，每天约7分钟。',
    days: [
      buildDay(1, '胸臂启动', ['pushup', 'plank', 'burpee', 'mountain-climber', 'squat'], 2, 30),
      buildDay(2, '腿部基础', ['squat', 'lunge', 'jumping-jack', 'plank', 'pushup'], 2, 30),
      buildDay(3, '核心稳定', ['plank', 'crunch', 'leg-raise', 'russian-twist', 'pushup'], 2, 30),
      buildDay(4, '胸腿组合', ['pushup', 'squat', 'lunge', 'plank', 'burpee'], 2, 30),
      buildDay(5, '爆发增肌', ['burpee', 'pushup', 'squat', 'mountain-climber', 'plank'], 2, 30),
      buildDay(6, '上肢强化', ['pushup', 'plank', 'crunch', 'mountain-climber', 'lunge'], 2, 30),
      buildDay(7, '全身增肌', ['squat', 'pushup', 'lunge', 'plank', 'burpee'], 2, 30),
    ],
  },
  // === 腹肌雕刻 7天（通用） ===
  {
    id: 'plan-abs-7',
    name: '7天腹肌雕刻',
    goalId: 'abs',
    desc: '7天集中训练腹部，每天约6分钟，居家无器械。',
    days: [
      buildDay(1, '激活核心', ['crunch', 'russian-twist', 'leg-raise', 'plank', 'mountain-climber'], 2, 30),
      buildDay(2, '上腹强化', ['crunch', 'leg-raise', 'russian-twist', 'mountain-climber', 'plank'], 2, 30),
      buildDay(3, '侧腹雕刻', ['russian-twist', 'mountain-climber', 'crunch', 'plank', 'leg-raise'], 2, 30),
      buildDay(4, '下腹突击', ['leg-raise', 'crunch', 'mountain-climber', 'russian-twist', 'plank'], 2, 30),
      buildDay(5, '综合燃腹', ['mountain-climber', 'crunch', 'russian-twist', 'leg-raise', 'plank'], 2, 30),
      buildDay(6, '耐力挑战', ['plank', 'crunch', 'leg-raise', 'russian-twist', 'mountain-climber'], 2, 30),
      buildDay(7, '终极腹肌', ['crunch', 'russian-twist', 'leg-raise', 'plank', 'burpee'], 2, 30),
    ],
  },
  // === 燃脂减重 14天（通用） ===
  {
    id: 'plan-fat-14',
    name: '14天燃脂减重',
    goalId: 'fat-loss',
    desc: '14天全身燃脂计划，每天约8分钟，循序渐进。',
    days: [
      buildDay(1, '燃脂启动', ['jumping-jack', 'squat', 'mountain-climber', 'plank', 'lunge'], 2, 30),
      buildDay(2, '下肢燃脂', ['squat', 'lunge', 'jumping-jack', 'mountain-climber', 'crunch'], 2, 30),
      buildDay(3, '上肢与核心', ['pushup', 'plank', 'crunch', 'mountain-climber', 'jumping-jack'], 2, 30),
      buildDay(4, '全身激活', ['jumping-jack', 'squat', 'pushup', 'plank', 'burpee'], 2, 30),
      buildDay(5, '高强度间歇', ['burpee', 'mountain-climber', 'jumping-jack', 'squat', 'lunge'], 2, 30),
      buildDay(6, '核心稳固', ['plank', 'russian-twist', 'leg-raise', 'crunch', 'mountain-climber'], 2, 30),
      buildDay(7, '燃脂冲刺', ['jumping-jack', 'burpee', 'squat', 'mountain-climber', 'lunge'], 2, 30),
      buildDay(8, '腿部轰炸', ['squat', 'lunge', 'jumping-jack', 'burpee', 'crunch'], 2, 30),
      buildDay(9, '胸臂强化', ['pushup', 'plank', 'mountain-climber', 'burpee', 'jumping-jack'], 2, 30),
      buildDay(10, '燃脂循环', ['jumping-jack', 'squat', 'pushup', 'mountain-climber', 'plank'], 2, 30),
      buildDay(11, '爆发训练', ['burpee', 'jumping-jack', 'squat', 'lunge', 'mountain-climber'], 2, 30),
      buildDay(12, '核心熔炉', ['plank', 'crunch', 'russian-twist', 'leg-raise', 'mountain-climber'], 2, 30),
      buildDay(13, '终极挑战', ['burpee', 'squat', 'pushup', 'mountain-climber', 'jumping-jack'], 2, 30),
      buildDay(14, '毕业燃脂', ['jumping-jack', 'burpee', 'lunge', 'plank', 'squat'], 2, 30),
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
