import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import Layout from '../components/Layout'
import {
  DEMO_PLAYERS,
  calcStreak,
  scoreOf,
  getValue,
  SORT_OPTIONS,
  type PlayerStats,
  type SortKey,
} from '../lib/leaderboard'

// 健身排行榜页
export default function Leaderboard() {
  const navigate = useNavigate()
  const profile = useStore((s) => s.profile)
  const checkins = useStore((s) => s.checkins)
  const setName = useStore((s) => s.setName)

  const [sortKey, setSortKey] = useState<SortKey>('score')
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(profile?.name ?? '')

  // 从真实打卡记录计算我的统计
  const myStats: PlayerStats = useMemo(() => {
    const list = Object.values(checkins)
    const totalMinutes = Math.round(list.reduce((s, c) => s + c.durationSec, 0) / 60)
    const totalActions = list.reduce((s, c) => s + c.exerciseCount, 0)
    const streak = calcStreak(checkins)
    return {
      name: profile?.name ?? '我',
      totalMinutes,
      totalActions,
      streak,
      isMe: true,
    }
  }, [checkins, profile?.name])

  // 合并示范选手 + 我，排序
  const ranked = useMemo(() => {
    const all = [myStats, ...DEMO_PLAYERS]
    all.sort((a, b) => getValue(b, sortKey) - getValue(a, sortKey))
    return all
  }, [myStats, sortKey])

  const myRank = ranked.findIndex((p) => p.isMe) + 1
  const myScore = scoreOf(myStats)

  const saveName = () => {
    const trimmed = nameInput.trim()
    if (trimmed) setName(trimmed)
    setEditingName(false)
  }

  if (!profile) {
    return (
      <Layout>
        <div className="pt-10 text-center">
          <p className="text-slate-400 mb-4">先填写身体数据才能上榜</p>
          <button onClick={() => navigate('/onboarding')} className="text-brand-500 text-sm">去填写 ›</button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="pt-5">
        <h1 className="text-xl font-bold text-slate-800 mb-4">健身排行榜 🏆</h1>

        {/* 我的排名卡 */}
        <div className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl p-5 text-white mb-4 shadow-lg shadow-brand-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tabular-nums">#{myRank}</span>
              <span className="text-xs text-white/70">我的排名</span>
            </div>
            {!editingName ? (
              <button
                onClick={() => {
                  setNameInput(profile.name ?? '')
                  setEditingName(true)
                }}
                className="flex items-center gap-1 text-xs text-white/80 active:text-white bg-white/15 px-2.5 py-1 rounded-full"
              >
                <span className="font-medium max-w-[8rem] truncate">{myStats.name}</span>
                <span>✏️</span>
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <input
                  autoFocus
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  maxLength={12}
                  onKeyDown={(e) => e.key === 'Enter' && saveName()}
                  className="w-28 h-7 px-2 rounded-lg bg-white/20 text-white text-xs placeholder-white/50 focus:outline-none focus:bg-white/30"
                  placeholder="昵称"
                />
                <button onClick={saveName} className="text-xs bg-white/25 px-2 py-1 rounded-lg">✓</button>
                <button onClick={() => setEditingName(false)} className="text-xs bg-white/15 px-2 py-1 rounded-lg">✕</button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            <MyStat value={`${myScore}`} label="综合分" />
            <MyStat value={`${myStats.totalMinutes}`} label="训练分钟" />
            <MyStat value={`${myStats.totalActions}`} label="完成动作" />
            <MyStat
              value={myStats.streak > 0 ? `${myStats.streak}` : '0'}
              label={myStats.streak > 0 ? '连续天数' : '已中断'}
              danger={myStats.streak === 0}
            />
          </div>
        </div>

        {/* 排序切换 */}
        <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSortKey(opt.key)}
              className={`px-3.5 h-8 rounded-full text-xs font-medium whitespace-nowrap transition ${
                sortKey === opt.key
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-slate-500 border border-slate-200'
              }`}
            >
              {opt.label}排行
            </button>
          ))}
        </div>

        {/* 排行榜列表 */}
        <div className="space-y-2">
          {ranked.map((p, i) => {
            const rank = i + 1
            const val = getValue(p, sortKey)
            const unit = sortKey === 'minutes' ? '分钟' : sortKey === 'actions' ? '个' : sortKey === 'streak' ? '天' : '分'
            return (
              <div
                key={i}
                className={`rounded-2xl border p-3 flex items-center gap-3 transition ${
                  p.isMe
                    ? 'bg-brand-50 border-brand-300 ring-1 ring-brand-200'
                    : 'bg-white border-slate-100'
                }`}
              >
                {/* 排名 */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${rankMedal(rank)}`}>
                  {rank <= 3 ? medalEmoji(rank) : rank}
                </div>

                {/* 头像 + 名字 */}
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-lg shrink-0">
                  {p.isMe ? '👤' : avatarFor(p.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-slate-800 truncate">{p.name}</span>
                    {p.isMe && <span className="text-[10px] bg-brand-500 text-white px-1.5 py-0.5 rounded-full shrink-0">我</span>}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span>⏱ {p.totalMinutes}分</span>
                    <span>·</span>
                    <span>💪 {p.totalActions}个</span>
                    <span>·</span>
                    {p.streak > 0 ? (
                      <span className="text-orange-500">🔥 连续{p.streak}天</span>
                    ) : (
                      <span className="text-slate-400">已中断</span>
                    )}
                  </div>
                </div>

                {/* 当前排序指标值 */}
                <div className="text-right shrink-0">
                  <div className="text-base font-bold text-slate-800 tabular-nums">{val}</div>
                  <div className="text-[10px] text-slate-400">{unit}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 说明 */}
        <p className="text-center text-[11px] text-slate-400 mt-5 px-4 leading-relaxed">
          排行榜含示范选手用于参照对比，你的数据为本机真实打卡记录。<br />
          综合分 = 训练分钟 + 完成动作×2 + 连续打卡×8，坚持不中断得分更高。
        </p>
      </div>
    </Layout>
  )
}

function MyStat({ value, label, danger }: { value: string; label: string; danger?: boolean }) {
  return (
    <div>
      <div className={`text-lg font-bold tabular-nums ${danger ? 'text-red-200' : ''}`}>{value}</div>
      <div className="text-[10px] text-white/60">{label}</div>
    </div>
  )
}

function rankMedal(rank: number): string {
  if (rank === 1) return 'bg-yellow-100 text-yellow-600'
  if (rank === 2) return 'bg-slate-200 text-slate-500'
  if (rank === 3) return 'bg-orange-100 text-orange-600'
  return 'bg-slate-100 text-slate-400'
}

function medalEmoji(rank: number): string {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return ''
}

function avatarFor(name: string): string {
  const emojis = ['🏃', '💪', '🤸', '🧘', '⚡', '🌟', '🔥', '⛹️', '🏋️', '🚴']
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i)) % emojis.length
  return emojis[h]
}
