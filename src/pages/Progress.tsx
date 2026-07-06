import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { getPlan, getGoal } from '../data/plans'
import Layout from '../components/Layout'

// 进度/成就/打卡记录页
export default function Progress() {
  const navigate = useNavigate()
  const enrolledPlanId = useStore((s) => s.enrolledPlanId)
  const profile = useStore((s) => s.profile)
  const checkins = useStore((s) => s.checkins)
  const currentDay = useStore((s) => s.currentDay())
  const completedDays = useStore((s) => s.completedDays())

  const plan = getPlan(enrolledPlanId)

  if (!profile) {
    return (
      <Layout>
        <div className="pt-10 text-center">
          <p className="text-slate-400 mb-4">还没填写身体数据</p>
          <button onClick={() => navigate('/onboarding')} className="text-brand-500 text-sm">去填写 ›</button>
        </div>
      </Layout>
    )
  }

  const checkinList = Object.values(checkins)
    .filter((c) => c.planId === enrolledPlanId)
    .sort((a, b) => b.at - a.at)

  const totalMinutes = Math.round(checkinList.reduce((sum, c) => sum + c.durationSec, 0) / 60)
  const totalCalories = Math.round(checkinList.reduce((sum, c) => sum + c.calories, 0))

  return (
    <Layout>
      <div className="pt-5">
        <h1 className="text-xl font-bold text-slate-800 mb-4">我的进度</h1>

        {/* 身体数据卡 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-4">
          <div className="grid grid-cols-4 gap-2 text-center">
            <BodyStat label="身高" value={`${profile.height}`} unit="cm" />
            <BodyStat label="体重" value={`${profile.weight}`} unit="kg" />
            <BodyStat label="性别" value={profile.gender === 'male' ? '男' : '女'} unit="" />
            <BodyStat label="年龄" value={`${profile.age}`} unit="岁" />
          </div>
        </div>

        {plan ? (
          <>
            {/* 当前计划进度 */}
            <div className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl p-5 text-white mb-4 shadow-lg shadow-brand-500/20">
              <p className="text-xs text-white/70">当前计划</p>
              <h2 className="text-lg font-bold mt-0.5">{plan.name}</h2>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-white/80 mb-1">
                  <span>第 {currentDay} 天</span>
                  <span>{completedDays}/{plan.days.length} 天</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${(completedDays / plan.days.length) * 100}%` }}
                  />
                </div>
              </div>
              <button
                onClick={() => navigate(`/plan/${plan.id}`)}
                className="w-full mt-4 h-10 rounded-xl bg-white/20 text-white text-sm font-medium active:scale-95"
              >
                继续训练 ›
              </button>
            </div>

            {/* 累计数据 */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <MetricCard icon="📅" value={`${checkinList.length}`} label="打卡天数" />
              <MetricCard icon="⏱" value={`${totalMinutes}`} label="累计分钟" />
              <MetricCard icon="🔥" value={`${totalCalories}`} label="消耗千卡" />
            </div>

            {/* 打卡记录 */}
            <h3 className="text-sm font-semibold text-slate-600 mb-2">打卡记录</h3>
            {checkinList.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center text-sm text-slate-400">
                还没有打卡记录<br />完成第一次训练来打卡吧 💪
              </div>
            ) : (
              <div className="space-y-2">
                {checkinList.map((c, i) => {
                  const dayInfo = plan.days.find((d) => d.day === c.day)
                  return (
                    <div key={i} className="bg-white rounded-xl border border-slate-100 p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">✓</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-700">第 {c.day} 天 · {dayInfo?.title ?? '训练'}</p>
                        <p className="text-xs text-slate-400">{c.date} · {c.exerciseCount}个动作 · {Math.round(c.durationSec / 60)}分钟 · {c.calories}kcal</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {completedDays >= plan.days.length && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-center">
                <div className="text-4xl mb-2">🏆</div>
                <p className="font-bold text-yellow-700">恭喜达成健身目标！</p>
                <p className="text-xs text-yellow-600 mt-1">你已完成「{plan.name}」全部 {plan.days.length} 天训练</p>
                <button onClick={() => navigate('/goals')} className="text-sm text-brand-500 mt-3">挑战新计划 ›</button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center">
            <p className="text-sm text-slate-400 mb-3">还没有选择训练计划</p>
            <button onClick={() => navigate('/goals')} className="text-brand-500 text-sm">选择目标 ›</button>
          </div>
        )}
      </div>
    </Layout>
  )
}

function BodyStat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div>
      <div className="text-xs text-slate-400">{label}</div>
      <div className="font-bold text-slate-800 text-sm">{value}<span className="text-xs font-normal text-slate-400 ml-0.5">{unit}</span></div>
    </div>
  )
}

function MetricCard({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-3 text-center">
      <div className="text-xl mb-0.5">{icon}</div>
      <div className="font-bold text-slate-800">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  )
}
