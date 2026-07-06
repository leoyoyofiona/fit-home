import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPlan } from '../data/plans'
import { useStore, estimateCalories, todayKey, calcDayDuration } from '../store/useStore'
import { useTrainingSession } from '../hooks/useTrainingSession'
import VideoPlayer from '../components/VideoPlayer'
import CountdownTimer from '../components/CountdownTimer'
import ExerciseInfo from '../components/ExerciseInfo'
import MusicToggle from '../components/MusicToggle'
import type { Plan, PlanDay } from '../types'

// 训练进行中页（核心）
// 外层：路由参数解析 + 校验；内层 TrainInner 接收确定 props 再调用 hook
export default function Train() {
  const { planId, day } = useParams()
  const plan = getPlan(planId ?? null)
  const dayNum = Number(day) || 1
  const planDay = plan?.days.find((d) => d.day === dayNum) ?? plan?.days[0]

  if (!plan || !planDay) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">训练计划不存在</p>
          <button
            onClick={() => window.history.back()}
            className="text-brand-400 text-sm"
          >
            返回
          </button>
        </div>
      </div>
    )
  }

  return <TrainInner plan={plan} planDay={planDay} dayNum={dayNum} />
}

function TrainInner({ plan, planDay, dayNum }: { plan: Plan; planDay: PlanDay; dayNum: number }) {
  const navigate = useNavigate()
  const profile = useStore((s) => s.profile)
  const checkin = useStore((s) => s.checkin)
  const isTodayChecked = useStore((s) => s.isTodayChecked())

  const session = useTrainingSession(plan, planDay)
  const { state, countdown, bgm, voice, start, pause, resume, skip, quit, paused } = session
  const { phase, currentExercise, setIndex, totalExercises, elapsedSec, repCount, repTotal } = state

  // 视频源：休息阶段也播放刚做完的动作视频（与动作相关 + 每个动作各不相同）
  // 休息时通过 VideoPlayer 慢放 + 降低亮度 + 绿色遮罩来区分
  const videoSrc: string | undefined = currentExercise?.videoSrc

  // 打卡
  const doCheckin = () => {
    const duration = elapsedSec || calcDayDuration(plan.id, dayNum)
    checkin({
      date: todayKey(),
      planId: plan.id,
      day: dayNum,
      exerciseCount: totalExercises,
      durationSec: duration,
      calories: estimateCalories(profile?.weight ?? 60, duration),
      at: Date.now(),
    })
    navigate(`/plan/${plan.id}`)
  }

  // 训练结束自动滚动顶部
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [session.state.phase])

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between px-4 h-12">
        <button onClick={quit} className="text-sm text-white/60">✕ 退出</button>
        <span className="text-xs text-white/50">第 {dayNum} 天 · {planDay.title}</span>
        <MusicToggle enabled={bgm.enabled} usingFallback={bgm.usingFallback} onToggle={bgm.toggle} />
      </div>

      {/* 主体 */}
      <div className="flex-1 flex flex-col px-4 pb-6 max-w-md mx-auto w-full">
        {/* intro */}
        {phase === 'intro' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="text-6xl mb-4">🏋️</div>
            <h1 className="text-2xl font-bold mb-2">今日训练</h1>
            <p className="text-white/60 mb-1">{planDay.title}</p>
            <div className="flex gap-5 text-sm text-white/70 my-5">
              <span>📋 {planDay.exerciseIds.length} 个动作</span>
              <span>🔁 {planDay.sets} 组</span>
              <span>⏱ 约 {Math.max(5, Math.round(calcDayDuration(plan.id, dayNum) / 60))} 分钟</span>
            </div>
            {!voice.supported && (
              <p className="text-xs text-amber-400/80 mb-3">⚠ 当前设备不支持语音口令，将显示文字提示</p>
            )}
            <p className="text-xs text-white/40 mb-6 max-w-xs">
              跟着真人视频和语音口令一起练！每个动作按次数计数，完成后进入休息放松。
            </p>
            <button
              onClick={start}
              className="w-56 h-14 rounded-2xl bg-brand-500 text-white font-bold text-lg active:scale-95 transition shadow-lg shadow-brand-500/40"
            >
              开始健身 ▶
            </button>
          </div>
        )}

        {/* ready 3-2-1 */}
        {phase === 'ready' && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-white/60 mb-4">准备开始</p>
            <div className="text-8xl font-bold text-brand-400 animate-pulse-soft">{countdown.remaining || 'GO'}</div>
          </div>
        )}

        {/* exercise / rest */}
        {(phase === 'exercise' || phase === 'rest') && (
          <div className="flex-1 flex flex-col">
            {/* 视频区 */}
            <div className="aspect-[3/4] max-h-[55vh] w-full mb-4 mt-2">
              <VideoPlayer
                videoSrc={videoSrc}
                playing={!paused}
                label={phase === 'rest' ? '休息放松' : currentExercise?.name}
                phase={phase}
                exerciseName={phase === 'exercise' ? currentExercise?.name : undefined}
                exerciseNameEn={phase === 'exercise' ? currentExercise?.nameEn : undefined}
                repCount={repCount}
                repTotal={repTotal}
                countdownRemaining={countdown.remaining}
                countdownTotal={phase === 'rest' ? planDay.restBetweenSets : (currentExercise?.value ?? 30)}
              />
            </div>

            {/* 动作信息 */}
            <div className="text-center mb-3">
              <ExerciseInfo
                exercise={phase === 'exercise' ? currentExercise : null}
                setIndex={setIndex}
                totalSets={planDay.sets}
                exerciseIndex={Math.min(state.currentIndex, totalExercises - 1)}
                totalExercises={totalExercises}
              />
            </div>

            {/* 计时/计数 */}
            <div className="flex flex-col items-center mb-4">
              {phase === 'exercise' ? (
                repTotal > 0 ? (
                  <CountdownTimer mode="reps" repCount={repCount} repTotal={repTotal} label="下" />
                ) : (
                  <CountdownTimer remaining={countdown.remaining} total={currentExercise?.value ?? 30} label="秒" />
                )
              ) : (
                <CountdownTimer remaining={countdown.remaining} total={planDay.restBetweenSets} label="休息" />
              )}
              <p className="text-xs text-white/40 mt-2">已用时 {Math.floor(elapsedSec / 60)}:{String(elapsedSec % 60).padStart(2, '0')}</p>
            </div>

            {/* 控制按钮 */}
            <div className="flex items-center justify-center gap-3">
              {!paused ? (
                <button onClick={pause} className="px-5 h-11 rounded-xl bg-white/10 text-white text-sm font-medium active:scale-95">⏸ 暂停</button>
              ) : (
                <button onClick={resume} className="px-5 h-11 rounded-xl bg-brand-500 text-white text-sm font-medium active:scale-95">▶ 继续</button>
              )}
              <button onClick={skip} className="px-5 h-11 rounded-xl bg-white/10 text-white text-sm font-medium active:scale-95">⏭ 下一个</button>
            </div>
          </div>
        )}

        {/* complete */}
        {phase === 'complete' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold mb-2">完成今日训练！</h1>
            <p className="text-white/60 mb-5">{planDay.title}</p>
            <div className="flex gap-6 bg-white/5 rounded-2xl px-8 py-5 mb-6">
              <Stat label="动作" value={`${totalExercises}`} />
              <Stat label="时长" value={`${Math.floor(elapsedSec / 60)}:${String(elapsedSec % 60).padStart(2, '0')}`} />
              <Stat label="消耗" value={`${estimateCalories(profile?.weight ?? 60, elapsedSec)}kcal`} />
            </div>
            {!isTodayChecked ? (
              <button
                onClick={doCheckin}
                className="w-56 h-13 py-3.5 rounded-2xl bg-green-500 text-white font-bold text-base active:scale-95 transition shadow-lg shadow-green-500/30"
              >
                ✓ 打卡完成
              </button>
            ) : (
              <p className="text-sm text-green-400">今日已打卡 ✅</p>
            )}
            <button onClick={() => navigate(`/plan/${plan.id}`)} className="text-sm text-white/50 mt-4">
              返回计划
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-white/50">{label}</div>
    </div>
  )
}
