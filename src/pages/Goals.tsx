import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { goals, getPlan } from '../data/plans'
import { useStore } from '../store/useStore'
import Layout from '../components/Layout'
import type { GoalGender } from '../types'

type TabKey = 'all' | 'female' | 'male'

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'all', label: '全部', icon: '🌟' },
  { key: 'female', label: '女性', icon: '👩' },
  { key: 'male', label: '男性', icon: '👨' },
]

// 选目标页
export default function Goals() {
  const navigate = useNavigate()
  const enroll = useStore((s) => s.enroll)
  const enrolledPlanId = useStore((s) => s.enrolledPlanId)
  const profile = useStore((s) => s.profile)
  const [tab, setTab] = useState<TabKey>('all')

  // 根据性别自动推荐默认 tab
  const defaultTab: TabKey = profile?.gender === 'female' ? 'female' : profile?.gender === 'male' ? 'male' : 'all'

  const select = (goalId: string, planId: string) => {
    if (enrolledPlanId !== planId) {
      enroll(planId)
    }
    navigate(`/plan/${planId}`)
  }

  const filtered = tab === 'all' ? goals : goals.filter((g) => g.gender === tab || g.gender === 'all')

  return (
    <Layout showNav={false}>
      <div className="pt-6">
        <h1 className="text-xl font-bold text-slate-800 mb-1">你想练什么？</h1>
        <p className="text-sm text-slate-500 mb-4">选择目标，开启你的健身计划</p>

        {/* 性别 Tab */}
        <div className="flex gap-2 mb-4">
          {TABS.map((t) => {
            const active = (tab === 'all' ? defaultTab : tab) === t.key
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
                  tab === t.key
                    ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/20'
                    : 'bg-white text-slate-500 border border-slate-100'
                }`}
              >
                {t.icon} {t.label}
              </button>
            )
          })}
        </div>

        {/* 目标列表 */}
        <div className="space-y-3">
          {filtered.map((g) => {
            const plan = getPlan(g.planId)!
            const isActive = enrolledPlanId === g.planId
            return (
              <button
                key={g.id}
                onClick={() => select(g.id, g.planId)}
                className={`w-full text-left bg-white rounded-2xl border p-4 flex items-center gap-4 active:scale-[0.98] transition ${
                  isActive ? 'border-brand-400 shadow-sm shadow-brand-500/10' : 'border-slate-100'
                }`}
              >
                <div className="text-4xl">{g.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800">{g.name}</h3>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      g.gender === 'female' ? 'bg-pink-100 text-pink-600' :
                      g.gender === 'male' ? 'bg-blue-100 text-blue-600' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {g.tag}
                    </span>
                    {isActive && <span className="text-[10px] bg-brand-100 text-brand-600 px-1.5 py-0.5 rounded">进行中</span>}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{g.desc}</p>
                  <p className="text-xs text-slate-400 mt-1">{plan.days.length}天计划 · 每天约5-10分钟 · 无器械</p>
                </div>
                <div className="text-slate-300">›</div>
              </button>
            )
          })}
        </div>

        <div className="mt-6 bg-brand-50 rounded-xl p-4 text-center">
          <p className="text-xs text-brand-700 leading-relaxed">
            🏠 无器械健身，随时随地都能练<br />
            跟着真人视频和语音口令，在家就能练
          </p>
        </div>
      </div>
    </Layout>
  )
}
