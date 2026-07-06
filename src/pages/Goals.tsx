import { useNavigate } from 'react-router-dom'
import { goals, getPlan } from '../data/plans'
import { useStore } from '../store/useStore'
import Layout from '../components/Layout'

// 选目标页
export default function Goals() {
  const navigate = useNavigate()
  const enroll = useStore((s) => s.enroll)
  const enrolledPlanId = useStore((s) => s.enrolledPlanId)

  const select = (goalId: string, planId: string) => {
    // 如果切换计划，重置打卡
    if (enrolledPlanId !== planId) {
      enroll(planId)
    }
    navigate(`/plan/${planId}`)
  }

  return (
    <Layout showNav={false}>
      <div className="pt-6">
        <h1 className="text-xl font-bold text-slate-800 mb-1">你想练什么？</h1>
        <p className="text-sm text-slate-500 mb-5">选择目标，开启你的健身计划</p>

        <div className="space-y-3">
          {goals.map((g) => {
            const plan = getPlan(g.planId)!
            const isActive = enrolledPlanId === g.planId
            return (
              <button
                key={g.id}
                onClick={() => select(g.id, g.planId)}
                className={`w-full text-left bg-white rounded-2xl border p-4 flex items-center gap-4 active:scale-[0.98] transition ${isActive ? 'border-brand-400 shadow-sm shadow-brand-500/10' : 'border-slate-100'}`}
              >
                <div className="text-4xl">{g.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800">{g.name}</h3>
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
            跟着视频和口令，像看健身节目一样
          </p>
        </div>
      </div>
    </Layout>
  )
}
