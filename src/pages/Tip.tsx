import QrCard from '../components/QrCard'
import Layout from '../components/Layout'

// 打赏页
export default function Tip() {
  return (
    <Layout>
      <div className="pt-6 space-y-4">
        <div className="text-center mb-2">
          <div className="text-5xl mb-3">☕</div>
          <h1 className="text-xl font-bold text-slate-800">支持这个项目</h1>
          <p className="text-sm text-slate-500 mt-1">无器械健身，让每个人都能随时随地开练</p>
        </div>

        {/* 收款码图片放入 public/qr/tip.png 后，把下方 qrSrc 改为 "/qr/tip.png" */}
        <QrCard qrSrc={undefined} />

        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-700 mb-2">关于这个项目</h3>
          <ul className="text-sm text-slate-500 space-y-1.5 leading-relaxed">
            <li>🏠 无器械家庭健身，不需要任何器械，随时随地</li>
            <li>⏱ 每天只需 5-10 分钟，循序渐进</li>
            <li>🎬 跟着视频和中文口令，像看健身节目一样</li>
            <li>📅 多日训练计划，每日打卡，达成目标</li>
            <li>📱 手机电脑都能用，数据本地保存</li>
          </ul>
        </div>

        <div className="bg-brand-50 rounded-2xl p-5 text-center">
          <p className="text-sm text-brand-700 leading-relaxed">
            如果这个应用帮到了你<br />欢迎扫码请作者喝杯咖啡 ☕<br />
            你的支持让我持续优化这个项目
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 pb-4">
          🌏 居家健身 · 每天进步一点点
        </p>
      </div>
    </Layout>
  )
}
