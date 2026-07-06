interface MusicToggleProps {
  enabled: boolean
  onToggle: () => void
}

// 背景音乐开关按钮（训练页顶部栏）
export default function MusicToggle({ enabled, onToggle }: MusicToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1 text-xs text-white/60 px-2.5 h-7 rounded-lg bg-white/5 active:scale-95 transition"
      title={enabled ? '关闭背景音乐' : '开启背景音乐'}
    >
      <span className="text-sm">{enabled ? '🎵' : '🔇'}</span>
      <span>{enabled ? '音乐' : '静音'}</span>
    </button>
  )
}
