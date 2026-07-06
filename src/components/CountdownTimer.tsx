interface Props {
  remaining?: number // duration 模式：剩余秒数
  total?: number // duration 模式：总秒数
  label?: string
  size?: 'sm' | 'lg'
  // reps 模式
  mode?: 'duration' | 'reps'
  repCount?: number // 当前已做几下
  repTotal?: number // 目标次数
}

// 计时/计数圆环显示
// duration 模式：倒计时秒数（用于平板支撑等静态动作 / 休息）
// reps 模式：次数计数（第 X / N 下，进度环按次数填充）
export default function CountdownTimer({
  remaining = 0,
  total = 30,
  label,
  size = 'lg',
  mode = 'duration',
  repCount = 0,
  repTotal = 0,
}: Props) {
  const dim = size === 'lg' ? 200 : 120
  const stroke = size === 'lg' ? 12 : 8
  const r = (dim - stroke) / 2
  const c = 2 * Math.PI * r

  // 进度计算
  const progress =
    mode === 'reps'
      ? repTotal > 0
        ? repCount / repTotal
        : 0
      : total > 0
      ? remaining / total
      : 0
  const offset = c * (1 - progress)

  // 紧急/完成状态
  const done = mode === 'reps' ? repTotal > 0 && repCount >= repTotal : false
  const urgent = mode === 'duration' ? remaining <= 5 && remaining > 0 : false

  // 显示数字
  const displayNum = mode === 'reps' ? repCount : remaining
  // 显示标签
  const displayLabel = mode === 'reps' ? `/ ${repTotal} ${label || '下'}` : label

  const ringColor = done ? '#22c55e' : urgent ? '#ef4444' : '#f97316'
  const numColor = done ? 'text-green-400' : urgent ? 'text-red-400' : 'text-white'

  return (
    <div className="relative flex items-center justify-center" style={{ width: dim, height: dim }}>
      <svg width={dim} height={dim} className="-rotate-90">
        <circle cx={dim / 2} cy={dim / 2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} />
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={r}
          fill="none"
          stroke={ringColor}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: mode === 'reps' ? 'stroke-dashoffset 0.3s ease' : 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`font-bold tabular-nums ${size === 'lg' ? 'text-6xl' : 'text-2xl'} ${numColor}`}>
          {displayNum}
        </span>
        {displayLabel && <span className="text-xs text-white/50 mt-1">{displayLabel}</span>}
      </div>
    </div>
  )
}
