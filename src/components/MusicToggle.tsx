interface Props {
  enabled: boolean
  usingFallback: boolean
  onToggle: () => void
}

// 背景音乐开关
export default function MusicToggle({ enabled, usingFallback, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-slate-200 text-xs font-medium text-slate-600 active:scale-95 transition"
    >
      <span className={enabled ? 'animate-pulse-soft' : ''}>{enabled ? '🎵' : '🔇'}</span>
      <span>{enabled ? '音乐开' : '音乐关'}</span>
      {usingFallback && enabled && <span className="text-[10px] text-slate-400">(环境音)</span>}
    </button>
  )
}
