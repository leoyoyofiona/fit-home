import { useEffect, useState } from 'react'

// 休息放松动作 — 轮播 5 种恢复动作的 SVG 动画
// 替代之前的"动作慢放"，让用户跟着做真正的放松动作

interface RestMove {
  name: string
  desc: string
  icon: string
  duration: number // 展示秒数
}

const REST_MOVES: RestMove[] = [
  { name: '抖手甩臂', desc: '放松手臂，甩甩手腕', icon: 'arm-shake', duration: 6 },
  { name: '转腰扭胯', desc: '双手叉腰，慢慢转腰', icon: 'hip-rotate', duration: 6 },
  { name: '深呼吸', desc: '吸气——呼气——', icon: 'breathe', duration: 6 },
  { name: '颈部放松', desc: '慢慢转头，放松颈部', icon: 'neck-roll', duration: 6 },
  { name: '拉伸放松', desc: '双臂上举，全身拉伸', icon: 'stretch', duration: 6 },
]

export default function RestAnimation() {
  const [moveIndex, setMoveIndex] = useState(0)

  useEffect(() => {
    const move = REST_MOVES[moveIndex]
    const timer = setTimeout(() => {
      setMoveIndex((prev) => (prev + 1) % REST_MOVES.length)
    }, move.duration * 1000)
    return () => clearTimeout(timer)
  }, [moveIndex])

  const move = REST_MOVES[moveIndex]

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-teal-900 via-slate-900 to-teal-900">
      {/* 动画人物 */}
      <div className="flex-1 flex items-center justify-center w-full">
        <RestFigure icon={move.icon} />
      </div>

      {/* 动作名称 + 描述 */}
      <div className="text-center pb-8 z-10">
        <div className="inline-block px-5 py-2 rounded-full bg-green-600/90 text-white text-base font-bold shadow-lg mb-2">
          {move.name}
        </div>
        <p className="text-green-300 text-sm">{move.desc}</p>
      </div>

      {/* 指示点 */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {REST_MOVES.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all ${i === moveIndex ? 'bg-green-400 w-4' : 'bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  )
}

// SVG 动画人物 — 根据动作类型渲染不同动画
function RestFigure({ icon }: { icon: string }) {
  return (
    <svg viewBox="0 0 200 280" className="w-48 h-64">
      <defs>
        <style>{getKeyframes()}</style>
      </defs>

      {icon === 'arm-shake' && <ArmShakeFigure />}
      {icon === 'hip-rotate' && <HipRotateFigure />}
      {icon === 'breathe' && <BreatheFigure />}
      {icon === 'neck-roll' && <NeckRollFigure />}
      {icon === 'stretch' && <StretchFigure />}
    </svg>
  )
}

function getKeyframes() {
  return `
    @keyframes armShakeL { 0%,100% { transform: rotate(-30deg); } 50% { transform: rotate(20deg); } }
    @keyframes armShakeR { 0%,100% { transform: rotate(30deg); } 50% { transform: rotate(-20deg); } }
    @keyframes hipRotate { 0%,100% { transform: translateX(-8px) rotate(-5deg); } 50% { transform: translateX(8px) rotate(5deg); } }
    @keyframes breatheChest { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(1.12); } }
    @keyframes breatheArm { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    @keyframes neckRoll { 0%,100% { transform: rotate(-15deg); } 25% { transform: rotate(0deg); } 50% { transform: rotate(15deg); } 75% { transform: rotate(0deg); } }
    @keyframes stretchUp { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-10px); } }
    @keyframes stretchArmL { 0%,100% { transform: rotate(160deg); } 50% { transform: rotate(175deg); } }
    @keyframes stretchArmR { 0%,100% { transform: rotate(20deg); } 50% { transform: rotate(5deg); } }
    @keyframes blink { 0%,90%,100% { opacity: 1; } 95% { opacity: 0.3; } }
  `
}

// 人物基础部件
function Head({ cx = 100, cy = 40, r = 22 }: { cx?: number; cy?: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#4FD1C5" />
      <circle cx={cx - 7} cy={cy - 3} r={2.5} fill="#1A202C" style={{ animation: 'blink 3s infinite' }} />
      <circle cx={cx + 7} cy={cy - 3} r={2.5} fill="#1A202C" style={{ animation: 'blink 3s infinite' }} />
      <path d={`M ${cx - 6} ${cy + 7} Q ${cx} ${cy + 11} ${cx + 6} ${cy + 7}`} stroke="#1A202C" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  )
}

function Body({ x = 100, y = 62, w = 36, h = 70 }: { x?: number; y?: number; w?: number; h?: number }) {
  return <rect x={x - w / 2} y={y} width={w} height={h} rx={14} fill="#4FD1C5" />
}

function Leg({ x1, y1, x2, y2, color = "#2D3748" }: { x1: number; y1: number; x2: number; y2: number; color?: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={12} strokeLinecap="round" />
}

// 1. 抖手甩臂
function ArmShakeFigure() {
  return (
    <g>
      <Head />
      <Body />
      {/* 左臂 */}
      <g style={{ transformOrigin: '82px 72px', animation: 'armShakeL 0.6s infinite ease-in-out' }}>
        <line x1="82" y1="72" x2="50" y2="110" stroke="#4FD1C5" strokeWidth="10" strokeLinecap="round" />
        <circle cx="48" cy="113" r="7" fill="#4FD1C5" />
      </g>
      {/* 右臂 */}
      <g style={{ transformOrigin: '118px 72px', animation: 'armShakeR 0.6s infinite ease-in-out' }}>
        <line x1="118" y1="72" x2="150" y2="110" stroke="#4FD1C5" strokeWidth="10" strokeLinecap="round" />
        <circle cx="152" cy="113" r="7" fill="#4FD1C5" />
      </g>
      <Leg x1={88} y1={130} x2={80} y2={200} />
      <Leg x1={112} y1={130} x2={120} y2={200} />
    </g>
  )
}

// 2. 转腰扭胯
function HipRotateFigure() {
  return (
    <g>
      <Head />
      {/* 上半身固定 */}
      <Body y={62} h={55} />
      {/* 手臂叉腰 */}
      <line x1="82" y1="72" x2="70" y2="105" stroke="#4FD1C5" strokeWidth="10" strokeLinecap="round" />
      <line x1="118" y1="72" x2="130" y2="105" stroke="#4FD1C5" strokeWidth="10" strokeLinecap="round" />
      {/* 腰部以下转动 */}
      <g style={{ transformOrigin: '100px 120px', animation: 'hipRotate 1s infinite ease-in-out' }}>
        <rect x="82" y="117" width="36" height="25" rx="10" fill="#38B2AC" />
        <Leg x1={88} y1={140} x2={80} y2={200} />
        <Leg x1={112} y1={140} x2={120} y2={200} />
      </g>
    </g>
  )
}

// 3. 深呼吸
function BreatheFigure() {
  return (
    <g>
      <g style={{ transformOrigin: '100px 100px', animation: 'breatheArm 3s infinite ease-in-out' }}>
        <Head />
      </g>
      <g style={{ transformOrigin: '100px 100px', animation: 'breatheChest 3s infinite ease-in-out' }}>
        <Body y={62} h={70} />
        <line x1="82" y1="72" x2="65" y2="115" stroke="#4FD1C5" strokeWidth="10" strokeLinecap="round" />
        <line x1="118" y1="72" x2="135" y2="115" stroke="#4FD1C5" strokeWidth="10" strokeLinecap="round" />
      </g>
      <Leg x1={88} y1={130} x2={80} y2={200} />
      <Leg x1={112} y1={130} x2={120} y2={200} />
      {/* 呼吸气流指示 */}
      <g style={{ animation: 'breatheChest 3s infinite ease-in-out' }}>
        <path d="M 60 35 Q 55 25 60 15" stroke="#4FD1C5" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" />
        <path d="M 140 35 Q 145 25 140 15" stroke="#4FD1C5" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" />
      </g>
    </g>
  )
}

// 4. 颈部放松
function NeckRollFigure() {
  return (
    <g>
      <g style={{ transformOrigin: '100px 62px', animation: 'neckRoll 2s infinite ease-in-out' }}>
        <Head cy={42} />
      </g>
      <rect x="94" y="62" width="12" height="12" fill="#4FD1C5" />
      <Body y={74} h={60} />
      <line x1="82" y1="84" x2="68" y2="125" stroke="#4FD1C5" strokeWidth="10" strokeLinecap="round" />
      <line x1="118" y1="84" x2="132" y2="125" stroke="#4FD1C5" strokeWidth="10" strokeLinecap="round" />
      <Leg x1={88} y1={134} x2={80} y2={200} />
      <Leg x1={112} y1={134} x2={120} y2={200} />
    </g>
  )
}

// 5. 拉伸放松
function StretchFigure() {
  return (
    <g style={{ transformOrigin: '100px 130px', animation: 'stretchUp 2.5s infinite ease-in-out' }}>
      <Head cy={36} />
      <rect x="94" y="56" width="12" height="10" fill="#4FD1C5" />
      <Body y={66} h={65} />
      {/* 双臂上举 */}
      <g style={{ transformOrigin: '100px 76px' }}>
        <g style={{ transformOrigin: '82px 76px', animation: 'stretchArmL 2.5s infinite ease-in-out' }}>
          <line x1="82" y1="76" x2="55" y2="35" stroke="#4FD1C5" strokeWidth="10" strokeLinecap="round" />
          <circle cx="53" cy="32" r="7" fill="#4FD1C5" />
        </g>
        <g style={{ transformOrigin: '118px 76px', animation: 'stretchArmR 2.5s infinite ease-in-out' }}>
          <line x1="118" y1="76" x2="145" y2="35" stroke="#4FD1C5" strokeWidth="10" strokeLinecap="round" />
          <circle cx="147" cy="32" r="7" fill="#4FD1C5" />
        </g>
      </g>
      <Leg x1={88} y1={131} x2={80} y2={195} />
      <Leg x1={112} y1={131} x2={120} y2={195} />
    </g>
  )
}
