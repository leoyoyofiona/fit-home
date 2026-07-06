import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPlan } from '../data/plans'
import { getExercise } from '../data/exercises'
import { useStore, calcDayDuration } from '../store/useStore'
import Layout from '../components/Layout'

// 计划详情页
export default function PlanDetail() {
  const { planId } = useParams()
  const navigate = useNavigate()
  const plan = getPlan(planId ?? null)
  const currentDay = useStore((s) => s.currentDay())
  const completedDays = useStore((s) => s.completedDays())
  const isTodayChecked = useStore((s) => s.isTodayChecked())
  const checkins = useStore((s) => s.checkins)

  // 已打卡的天号集合
  const checkedDaySet = useMemo(() => {
    const set = new Set<number>()
    Object.values(checkins).forEach((c) => {
      if (c.planId === planId) set.add(c.day)
    })
    return set
  }, [checkins, planId])

  if (!plan) {
    return (
      <Layout>
        <div className="pt-10 text-center text-slate-400">计划不存在</div>
      </Layout>
    )
  }

  const todayPlanDay = plan.days.find((d) => d.day === currentDay) ?? plan.days[0]
  const todayDuration = calcDayDuration(plan.id, currentDay)

  return (
    <Layout showNav={false}>
      <div className="pt-5">
        <button onClick={() => navigate('/goals')} className="text-sm text-slate-400 mb-3">‹ 返回目标</button>

        <div className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl p-5 text-white shadow-lg shadow-brand-500/20">
          <h1 className="text-xl font-bold">{plan.name}</h1>
          <p className="text-sm text-white/80 mt-1">{plan.desc}</p>
          <div className="flex gap-4 mt-4 text-center">
            <Stat label="总天数" value={`${plan.days.length}天`} />
            <Stat label="已完成" value={`${completedDays}天`} />
            <Stat label="完成度" value={`${Math.round((completedDays / plan.days.length) * 100)}%`} />
          </div>
        </div>

        {/* 今日训练卡 */}
        <div className="mt-5 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-brand-500 font-medium">今日训练 · 第 {currentDay} 天</p>
              <h2 className="text-lg font-bold text-slate-800">{todayPlanDay.title}</h2>
            </div>
            {isTodayChecked && (
              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">✓ 已打卡</span>
            )}
          </div>

          <div className="flex gap-4 text-sm text-slate-500 mb-4">
            <span>⏱ {Math.round(todayDuration / 60)}分钟</span>
            <span>📋 {todayPlanDay.exerciseIds.length}个动作</span>
            <span>🔁 {todayPlanDay.sets}组</span>
          </div>

          {/* 今日动作列表 */}
          <div className="space-y-2 mb-4">
            {todayPlanDay.exerciseIds.map((id, i) => {
              const ex = getExercise(id)
              return (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-xs flex items-center justify-center">{i + 1}</span>
                  <span className="font-medium text-slate-700">{ex.name}</span>
                  <span className="text-slate-400 text-xs">{ex.mode === 'duration' ? `${ex.value}秒` : `${ex.value}次`}</span>
                </div>
              )
            })}
          </div>

          <button
            onClick={() => navigate(`/train/${plan.id}/${currentDay}`)}
            disabled={isTodayChecked}
            className={`w-full h-12 rounded-xl font-semibold text-base transition active:scale-[0.98] ${isTodayChecked ? 'bg-slate-100 text-slate-400' : 'bg-brand-500 text-white shadow-sm shadow-brand-500/30'}`}
          >
            {isTodayChecked ? '今日已完成，明天继续 💪' : '开始健身 ▶'}
          </button>
        </div>

        {/* 全部天数 */}
        <h3 className="text-sm font-semibold text-slate-600 mt-6 mb-2">训练日程</h3>
        <div className="grid grid-cols-7 gap-1.5">
          {plan.days.map((d) => {
            const checked = checkedDaySet.has(d.day)
            const isCurrent = d.day === currentDay
            return (
              <div
                key={d.day}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs ${checked ? 'bg-green-100 text-green-600' : isCurrent ? 'bg-brand-500 text-white' : 'bg-white border border-slate-100 text-slate-400'}`}
                title={d.title}
              >
                <span className="font-bold">{d.day}</span>
              </div>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs text-white/70">{label}</div>
    </div>
  )
}
