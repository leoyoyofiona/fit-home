import type { Exercise } from '../types'

// 无器械家庭动作库（10个）
// 所有动作均使用真人演示视频（来自 Mixkit/Pexels 免版权素材）
export const exercises: Exercise[] = [
  {
    id: 'jumping-jack',
    name: '开合跳',
    nameEn: 'Jumping Jacks',
    area: '全身 · 热身',
    mode: 'reps',
    reps: 30,
    value: 30,
    tempo: 1,
    rest: 15,
    cue: '开合跳，大家跟着我一起！双手双脚同时开合，保持节奏，呼吸均匀，腰间的肥油咔咔掉！加油！',
    svgType: 'jumpingJack',
    videoSrc: '/videos/v10.mp4', // ✅ 真人开合跳
  },
  {
    id: 'squat',
    name: '深蹲',
    nameEn: 'Squat',
    area: '腿部 · 臀部',
    mode: 'reps',
    reps: 15,
    value: 30,
    tempo: 2,
    rest: 15,
    cue: '深蹲，15下！下蹲到大腿与地面平行，膝盖不要内扣，脚尖微微向外，起立时收紧臀部。坚持住，调整呼吸！',
    svgType: 'squat',
    videoSrc: '/videos/v02.mp4', // ✅ 真人在家徒手深蹲（Mixkit）
  },
  {
    id: 'pushup',
    name: '俯卧撑',
    nameEn: 'Push-up',
    area: '胸部 · 手臂',
    mode: 'reps',
    reps: 12,
    value: 30,
    tempo: 2.5,
    rest: 15,
    cue: '俯卧撑，12下！身体保持一条直线，核心收紧，下落至胸部接近地面，撑起时发力要快。不要塌腰，加油！',
    svgType: 'pushup',
    videoSrc: '/videos/v01.mp4', // ✅ 真人俯卧撑
  },
  {
    id: 'crunch',
    name: '卷腹',
    nameEn: 'Crunch',
    area: '腹部',
    mode: 'reps',
    reps: 20,
    value: 30,
    tempo: 1.5,
    rest: 15,
    cue: '卷腹，20下！下背贴地，肩胛骨离地，感受腹肌收缩，慢慢下放。呼吸配合，起时呼气，下时吸气！',
    svgType: 'crunch',
    videoSrc: '/videos/v03.mp4', // ✅ 真人仰卧卷腹（ymove.app crunches）
  },
  {
    id: 'plank',
    name: '平板支撑',
    nameEn: 'Plank',
    area: '核心',
    mode: 'duration',
    reps: 0,
    value: 30,
    tempo: 0,
    rest: 15,
    cue: '平板支撑，坚持30秒！身体一条直线，收紧核心，臀部不要塌也不要翘，用力撑住，调整呼吸，你可以的！',
    svgType: 'plank',
    videoSrc: '/videos/v04.mp4', // ✅ 真人平板支撑（Mixkit）
  },
  {
    id: 'russian-twist',
    name: '俄罗斯转体',
    nameEn: 'Russian Twist',
    area: '腹斜肌',
    mode: 'reps',
    reps: 20,
    value: 30,
    tempo: 1.5,
    rest: 15,
    cue: '俄罗斯转体，20下！身体后倾，双脚离地，双手合十，左右转动上半身，感受腰侧发力。坚持住！',
    svgType: 'russianTwist',
    videoSrc: '/videos/v05.mp4', // ✅ 真人坐姿俄罗斯转体（ymove.app russian-twist-no-weight）
  },
  {
    id: 'leg-raise',
    name: '仰卧抬腿',
    nameEn: 'Leg Raise',
    area: '下腹',
    mode: 'reps',
    reps: 15,
    value: 30,
    tempo: 2,
    rest: 15,
    cue: '仰卧抬腿，15下！双腿并拢伸直，抬起至90度，慢慢下放不要触地，下腹发力，呼吸均匀！',
    svgType: 'legRaise',
    videoSrc: '/videos/v06.mp4', // ✅ 真人仰卧抬腿（ymove.app lying-leg-raises）
  },
  {
    id: 'lunge',
    name: '弓步蹲',
    nameEn: 'Lunge',
    area: '腿部 · 臀部',
    mode: 'reps',
    reps: 16,
    value: 32,
    tempo: 2,
    rest: 15,
    cue: '弓步蹲，16下！一脚前跨下蹲，前膝不超过脚尖，后膝接近地面，左右交替。大腿发力，坚持！',
    svgType: 'lunge',
    videoSrc: '/videos/v07.mp4', // ✅ 真人徒手弓步蹲（Mixkit）
  },
  {
    id: 'mountain-climber',
    name: '登山者',
    nameEn: 'Mountain Climbers',
    area: '核心 · 有氧',
    mode: 'reps',
    reps: 30,
    value: 30,
    tempo: 1,
    rest: 15,
    cue: '登山者，30下！俯撑姿势，双腿交替向胸部提膝，保持核心稳定，速度加快，心率上来，燃脂！',
    svgType: 'mountainClimber',
    videoSrc: '/videos/v08.mp4', // ✅ 真人登山者（ymove.app mountain-climbers）
  },
  {
    id: 'burpee',
    name: '波比跳',
    nameEn: 'Burpee',
    area: '全身 · 爆发',
    mode: 'reps',
    reps: 10,
    value: 30,
    tempo: 3,
    rest: 20,
    cue: '波比跳，10下！下蹲、后踢、俯撑、收腿、纵跳，一气呵成，全力以赴！这是最后一个动作，冲啊！',
    svgType: 'burpee',
    videoSrc: '/videos/v09.mp4', // ✅ 真人波比跳（ymove.app burpee）
  },
]

export const exerciseMap: Record<string, Exercise> = Object.fromEntries(
  exercises.map((e) => [e.id, e])
)

export function getExercise(id: string): Exercise {
  return exerciseMap[id] ?? exercises[0]
}
