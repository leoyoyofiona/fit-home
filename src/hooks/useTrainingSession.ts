import { useCallback, useMemo, useRef, useState } from 'react'
import type { Exercise, Plan, PlanDay } from '../types'
import { getExercise } from '../data/exercises'
import { useCountdown } from './useCountdown'
import { useSpeech } from './useSpeech'
import { useBgm } from './useBgm'

export type Phase = 'intro' | 'ready' | 'exercise' | 'rest' | 'complete'

// 展平一天的训练序列：动作 → 休息 → 动作 → ... → 组间休息 → 动作...
interface FlatItem {
  type: 'exercise' | 'rest'
  exercise?: Exercise
  seconds: number // 该项总秒数（duration 模式 / rest 用）
  setIndex: number
  mode: 'reps' | 'duration'
  reps: number // 每组次数（reps 模式）
  tempo: number // 每次节奏秒数（reps 模式）
}

export interface SessionState {
  phase: Phase
  currentIndex: number // flat 序列索引
  currentExercise: Exercise | null
  setIndex: number
  totalItems: number
  totalExercises: number
  elapsedSec: number
  repCount: number // 当前已做几下（reps 模式）
  repTotal: number // 这一组目标次数（reps 模式；0 表示按时长）
}

export function useTrainingSession(plan: Plan, day: PlanDay) {
  const speech = useSpeech()
  const bgm = useBgm()
  const countdown = useCountdown()

  // 展平训练序列
  const flat = useMemo<FlatItem[]>(() => {
    const items: FlatItem[] = []
    for (let s = 0; s < day.sets; s++) {
      day.exerciseIds.forEach((id, i) => {
        const ex = getExercise(id)
        items.push({
          type: 'exercise',
          exercise: ex,
          seconds: ex.value,
          setIndex: s,
          mode: ex.mode,
          reps: ex.reps,
          tempo: ex.tempo,
        })
        // 动作后休息（最后一个动作除外）
        if (i < day.exerciseIds.length - 1) {
          items.push({ type: 'rest', seconds: ex.rest, setIndex: s, mode: 'duration', reps: 0, tempo: 0 })
        }
      })
      // 组间休息
      if (s < day.sets - 1) {
        items.push({ type: 'rest', seconds: day.restBetweenSets, setIndex: s, mode: 'duration', reps: 0, tempo: 0 })
      }
    }
    return items
  }, [day])

  const [phase, setPhase] = useState<Phase>('intro')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [elapsedSec, setElapsedSec] = useState(0)
  const [repCount, setRepCount] = useState(0)
  const elapsedRef = useRef(0)
  const tickRef = useRef<number | null>(null)
  const repTimerRef = useRef<number | null>(null)
  // 保存当前 onDone 回调，供 resume 使用
  const repDoneRef = useRef<(() => void) | null>(null)

  const totalExercises = useMemo(
    () => flat.filter((f) => f.type === 'exercise').length,
    [flat]
  )

  // 当前动作：exercise 阶段是当前动作，rest 阶段是上一个 exercise（用于显示动作信息）
  const currentExercise = useMemo(() => {
    const item = flat[currentIndex]
    if (item?.type === 'exercise') return item.exercise ?? null
    if (item?.type === 'rest') {
      for (let i = currentIndex - 1; i >= 0; i--) {
        if (flat[i].type === 'exercise') return flat[i].exercise ?? null
      }
    }
    return null
  }, [flat, currentIndex])

  const setIndex = flat[currentIndex]?.setIndex ?? 0
  const currentItem = flat[currentIndex]
  const repTotal =
    currentItem?.type === 'exercise' && currentItem.mode === 'reps' ? currentItem.reps : 0

  // 计时累计
  const startElapsedTicking = useCallback(() => {
    if (tickRef.current) return
    tickRef.current = window.setInterval(() => {
      elapsedRef.current += 1
      setElapsedSec(elapsedRef.current)
    }, 1000)
  }, [])

  const stopElapsedTicking = useCallback(() => {
    if (tickRef.current) {
      window.clearInterval(tickRef.current)
      tickRef.current = null
    }
  }, [])

  // 次数计数计时器（reps 模式）：按 tempo 间隔递增 repCount，到 reps 完成
  const clearRepTimer = useCallback(() => {
    if (repTimerRef.current) {
      window.clearInterval(repTimerRef.current)
      repTimerRef.current = null
    }
  }, [])

  // 途中鼓励口令（在指定次数时触发一次）
  const midExerciseCues = useCallback((rep: number, total: number, name: string) => {
    const pct = rep / total
    if (pct === 0.5) {
      speech.speak(`已经完成一半了，${name}，${rep}下了，坚持住！调整呼吸！`)
    } else if (pct >= 0.8) {
      speech.speak(`最后几下了，冲啊！${(total - rep)}下，${name}！`)
    }
  }, [speech])

  // 启动次数计时（不重置 repCount，从当前值继续，供 resume 复用）
  const startRepTimer = useCallback(
    (reps: number, tempo: number, onDone: () => void, exerciseName: string) => {
      clearRepTimer()
      repDoneRef.current = onDone
      repTimerRef.current = window.setInterval(() => {
        setRepCount((prev) => {
          if (prev >= reps) {
            clearRepTimer()
            repDoneRef.current = null
            onDone()
            return reps
          }
          const next = prev + 1
          // 途中鼓励（防抖：用 setTimeout 避免与计数语音冲突）
          if (next === Math.round(reps * 0.5) || next === Math.round(reps * 0.8)) {
            setTimeout(() => midExerciseCues(next, reps, exerciseName), 300)
          }
          return next
        })
      }, tempo * 1000)
    },
    [clearRepTimer, midExerciseCues]
  )

  // 进入序列第 index 项
  const goTo = useCallback(
    (index: number) => {
      clearRepTimer()
      if (index >= flat.length) {
        // 完成
        setPhase('complete')
        stopElapsedTicking()
        bgm.pause()
        speech.stop()
        countdown.stop()
        speech.speak('太棒了！今天的训练全部完成！汗水不会骗人，你越来越强了！记得打卡哦，我们明天见！')
        return
      }
      const item = flat[index]
      setCurrentIndex(index)
      if (item.type === 'exercise') {
        setPhase('exercise')
        // 开场口令：动作名 + 要领
        speech.speak(`${item.exercise!.name}，${item.exercise!.reps > 0 ? `我们一起做${item.exercise!.reps}下` : `坚持${item.exercise!.value}秒`}！${item.exercise!.cue}`)
        if (item.mode === 'reps' && item.reps > 0) {
          // 次数模式：从第 1 下开始，按节奏计数
          setRepCount(1)
          startRepTimer(item.reps, item.tempo, () => goTo(index + 1), item.exercise!.name)
        } else {
          // 时长模式：倒计时
          setRepCount(0)
          countdown.start(item.seconds, () => goTo(index + 1))
        }
      } else {
        setPhase('rest')
        setRepCount(0)
        const next = flat[index + 1]
        const nextName = next?.type === 'exercise' ? next.exercise!.name : ''
        const isLastExercise = !next || next.type === 'rest'
        // 休息口令：引导放松 + 预告下一个动作
        if (isLastExercise) {
          speech.speak(`休息${item.seconds}秒。这组做完了，大家甩甩手、扭扭腰、调整呼吸，大腿感受一下酸爽的感觉！坚持住，下一组会更强！`)
        } else {
          speech.speak(`休息${item.seconds}秒。来，跟着视频一起甩甩手、转转腰、抖抖腿，调整呼吸！下一个动作：${nextName}，先看一下动作要领，我们马上开始！`)
        }
        countdown.start(item.seconds, () => goTo(index + 1))
      }
    },
    [flat, countdown, speech, bgm, stopElapsedTicking, clearRepTimer, startRepTimer]
  )

  // 开始训练
  const start = useCallback(() => {
    setPhase('ready')
    setCurrentIndex(0)
    setRepCount(0)
    elapsedRef.current = 0
    setElapsedSec(0)
    startElapsedTicking()
    bgm.play()
    speech.speak('准备好了吗？我们马上开始！调整好站姿，腰间的肥油今天咔咔掉！3、2、1，出发！')
    countdown.start(3, () => goTo(0))
  }, [bgm, speech, countdown, goTo, startElapsedTicking])

  // 暂停/恢复
  const [paused, setPaused] = useState(false)
  const pause = useCallback(() => {
    setPaused(true)
    countdown.stop()
    clearRepTimer()
    stopElapsedTicking()
    bgm.pause()
  }, [countdown, stopElapsedTicking, bgm, clearRepTimer])

  const resume = useCallback(() => {
    setPaused(false)
    if (phase === 'exercise' || phase === 'rest' || phase === 'ready') {
      startElapsedTicking()
      bgm.play()
      if (phase === 'ready') {
        countdown.start(countdown.remaining || 3, () => goTo(currentIndex))
      } else if (phase === 'rest') {
        countdown.start(countdown.remaining, () => goTo(currentIndex + 1))
      } else if (phase === 'exercise') {
        const item = flat[currentIndex]
        if (item?.mode === 'reps' && item.reps > 0) {
          // 恢复次数计数（从当前 repCount 继续）
          startRepTimer(item.reps, item.tempo, () => goTo(currentIndex + 1), item.exercise!.name)
        } else {
          countdown.start(countdown.remaining, () => goTo(currentIndex + 1))
        }
      }
    }
  }, [phase, countdown, currentIndex, flat, goTo, startElapsedTicking, bgm, startRepTimer])

  const skip = useCallback(() => {
    speech.stop()
    clearRepTimer()
    goTo(currentIndex + 1)
  }, [goTo, currentIndex, speech, clearRepTimer])

  const quit = useCallback(() => {
    clearRepTimer()
    countdown.stop()
    stopElapsedTicking()
    bgm.pause()
    speech.stop()
    setPhase('intro')
    setCurrentIndex(0)
    setRepCount(0)
    elapsedRef.current = 0
    setElapsedSec(0)
  }, [countdown, stopElapsedTicking, bgm, speech, clearRepTimer])

  const state: SessionState = {
    phase,
    currentIndex,
    currentExercise,
    setIndex,
    totalItems: flat.length,
    totalExercises,
    elapsedSec,
    repCount,
    repTotal,
  }

  return {
    state,
    flat,
    countdown,
    speech,
    bgm,
    paused,
    start,
    pause,
    resume,
    skip,
    quit,
    startElapsedTicking,
  }
}
