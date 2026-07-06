import { Navigate } from 'react-router-dom'
import { useStore } from './store/useStore'
import Onboarding from './pages/Onboarding'
import Goals from './pages/Goals'
import PlanDetail from './pages/PlanDetail'
import Train from './pages/Train'
import Progress from './pages/Progress'
import Leaderboard from './pages/Leaderboard'
import Tip from './pages/Tip'

// 根据是否已填资料重定向首页
function Home() {
  const profile = useStore((s) => s.profile)
  const enrolledPlanId = useStore((s) => s.enrolledPlanId)
  if (!profile) return <Onboarding />
  if (enrolledPlanId) return <Navigate to={`/plan/${enrolledPlanId}`} replace />
  return <Goals />
}

export const routes = [
  { path: '/', element: <Home /> },
  { path: '/onboarding', element: <Onboarding /> },
  { path: '/goals', element: <Goals /> },
  { path: '/plan/:planId', element: <PlanDetail /> },
  { path: '/train/:planId/:day', element: <Train /> },
  { path: '/progress', element: <Progress /> },
  { path: '/leaderboard', element: <Leaderboard /> },
  { path: '/tip', element: <Tip /> },
  { path: '*', element: <Navigate to="/" replace /> },
]
