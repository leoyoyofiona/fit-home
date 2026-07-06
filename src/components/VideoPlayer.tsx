import { useEffect, useRef } from 'react'
import RestAnimation from './RestAnimation'

interface Props {
  videoSrc?: string
  playing?: boolean
  label?: string
  // 文字叠加数据
  phase?: 'exercise' | 'rest' | 'ready' | 'intro'
  exerciseName?: string
  exerciseNameEn?: string
  repCount?: number
  repTotal?: number
  countdownRemaining?: number
  countdownTotal?: number
  currentIndex?: number
}

// 视频播放组件（新版：真人视频为主角，文字叠加为辅助）
// - 真人视频全尺寸清晰播放（不再模糊、不再做背景）
// - 顶部动作名称 + 中央计数/倒计时 + 底部进度条
export default function VideoPlayer({
  videoSrc,
  playing,
  label,
  phase,
  exerciseName,
  exerciseNameEn,
  repCount,
  repTotal,
  countdownRemaining,
  countdownTotal,
  currentIndex,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // 播放控制（仅训练阶段）
  useEffect(() => {
    const v = videoRef.current
    if (!v || !videoSrc || phase === 'rest') return
    let cancelled = false
    const onCanPlay = () => {
      if (cancelled) return
      if (playing) {
        v.play().catch(() => {})
      }
    }
    v.addEventListener('canplay', onCanPlay)
    if (playing) {
      v.play().catch(() => {})
    } else {
      v.pause()
    }
    return () => {
      cancelled = true
      v.removeEventListener('canplay', onCanPlay)
    }
  }, [videoSrc, playing, phase])

  // 视频源变化时重新加载（仅训练阶段）
  useEffect(() => {
    const v = videoRef.current
    if (!v || !videoSrc || phase === 'rest') return
    v.load()
  }, [videoSrc, phase])

  // 休息阶段不再播放视频，改用 RestAnimation 组件

  // 是否显示倒计时模式
  const showCountdown =
    phase === 'rest' ||
    (phase === 'exercise' && repTotal === 0)

  // 是否显示计数模式
  const showReps =
    phase === 'exercise' && repTotal !== undefined && repTotal > 0

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950">
      {/* 休息阶段：放松动作视频（每次新休息用 currentIndex 作为 seed 切换视频） */}
      {phase === 'rest' ? (
        <RestAnimation seed={currentIndex ?? 0} />
      ) : videoSrc ? (
        <video
          ref={videoRef}
          src={videoSrc}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          loop
          playsInline
        />
      ) : (
        // 无视频时显示深色占位 + 动作名称
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
          <span className="text-5xl opacity-20">🏋️</span>
        </div>
      )}

      {/* 顶部渐变遮罩 —— 让白字可读（仅训练阶段） */}
      {phase !== 'rest' && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none" />
      )}

      {/* 顶部：动作名称标签 */}
      {(exerciseName || label) && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
          <div className={`px-4 py-1.5 rounded-full ${phase === 'rest' ? 'bg-green-600/90' : 'bg-orange-500/90'} text-white text-sm font-bold shadow-lg backdrop-blur-sm`}>
            {exerciseNameEn && (
              <span className="text-[10px] font-normal opacity-80 mr-1">
                {exerciseNameEn}
              </span>
            )}
            {exerciseName ?? label ?? ''}
          </div>
        </div>
      )}

      {/* 中央：计数 / 倒计时（超大号数字） */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        {showReps && repCount !== undefined && repTotal !== undefined && (
          <div className="text-center">
            <div className="text-[100px] leading-none font-black text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]">
              {repCount}
            </div>
            <div className="text-2xl text-white/80 font-medium mt-1 drop-shadow">
              / {repTotal} 下
            </div>
          </div>
        )}
        {showCountdown && countdownRemaining !== undefined && (
          <div className="text-center">
            <div className="text-[100px] leading-none font-black text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]">
              {countdownRemaining}
            </div>
            <div className="text-2xl text-white/80 font-medium mt-1 drop-shadow">
              {phase === 'rest' ? '秒休息' : '秒'}
            </div>
          </div>
        )}
      </div>

      {/* 底部：进度条 + 阶段提示 */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-3 pb-3">
        {/* 阶段提示文字 */}
        {label && phase === 'rest' && (
          <div className="text-center mb-2">
            <span className="text-sm text-green-300 font-medium drop-shadow">
              ♻ 跟着视频一起放松
            </span>
          </div>
        )}

        {/* 进度条 */}
        {showReps && repTotal !== undefined && repCount !== undefined && (
          <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-orange-500 transition-all duration-300 ease-linear"
              style={{ width: `${Math.min(100, (repCount / repTotal) * 100)}%` }}
            />
          </div>
        )}
        {showCountdown && countdownTotal !== undefined && countdownRemaining !== undefined && (
          <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-1000 ease-linear"
              style={{
                width: `${Math.min(100, ((countdownTotal - countdownRemaining) / countdownTotal) * 100)}%`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
