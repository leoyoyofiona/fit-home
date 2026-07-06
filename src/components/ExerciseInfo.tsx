import type { Exercise } from '../types'

interface Props {
  exercise: Exercise | null
  setIndex: number
  totalSets: number
  exerciseIndex: number
  totalExercises: number
}

// 当前动作信息卡
export default function ExerciseInfo({ exercise, setIndex, totalSets, exerciseIndex, totalExercises }: Props) {
  if (!exercise) {
    return (
      <div className="text-center">
        <p className="text-lg font-semibold text-slate-600">休息一下</p>
        <p className="text-sm text-slate-400">调整呼吸，准备下一个动作</p>
      </div>
    )
  }
  return (
    <div className="text-center space-y-1">
      <p className="text-xs text-brand-500 font-medium tracking-wide">
        第 {setIndex + 1}/{totalSets} 组 · 动作 {exerciseIndex + 1}/{totalExercises}
      </p>
      <h2 className="text-2xl font-bold text-slate-800">{exercise.name}</h2>
      <p className="text-sm text-slate-400">{exercise.nameEn} · {exercise.area}</p>
      <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">{exercise.cue}</p>
    </div>
  )
}
