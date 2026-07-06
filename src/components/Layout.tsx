import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  showNav?: boolean
}

// 顶部导航 + 底部 Tab 布局
export default function Layout({ children, showNav = true }: Props) {
  const loc = useLocation()
  const hideNav = ['/train'].some((p) => loc.pathname.startsWith(p))

  if (hideNav) {
    // 训练页全屏，不显示导航
    return <div className="min-h-screen bg-slate-50">{children}</div>
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5">
            <span className="text-xl">🏃</span>
            <span className="font-bold text-slate-800">居家健身</span>
          </Link>
          <Link to="/tip" className="text-xs text-slate-400 active:text-brand-500">
            ☕ 支持项目
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-4 pb-20">{children}</main>

      {showNav && (
        <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-100">
          <div className="max-w-md mx-auto grid grid-cols-4 h-16">
            <TabItem to="/" label="训练" icon="🏠" active={loc.pathname === '/'} />
            <TabItem to="/progress" label="进度" icon="📊" active={loc.pathname === '/progress'} />
            <TabItem to="/leaderboard" label="排行" icon="🏆" active={loc.pathname === '/leaderboard'} />
            <TabItem to="/tip" label="打赏" icon="☕" active={loc.pathname === '/tip'} />
          </div>
        </nav>
      )}
    </div>
  )
}

function TabItem({ to, label, icon, active }: { to: string; label: string; icon: string; active: boolean }) {
  return (
    <Link to={to} className={`flex flex-col items-center justify-center gap-0.5 text-xs ${active ? 'text-brand-500' : 'text-slate-400'}`}>
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </Link>
  )
}
