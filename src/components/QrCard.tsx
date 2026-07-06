interface Props {
  qrSrc?: string
  title?: string
  desc?: string
}

// 打赏二维码卡
export default function QrCard({ qrSrc, title = '支持这个项目', desc = '如果这个健身应用帮到了你，可以请作者喝杯咖啡 ☕' }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center text-center">
      <h2 className="text-lg font-bold text-slate-800 mb-1">{title}</h2>
      <p className="text-sm text-slate-500 mb-4">{desc}</p>
      <div className="w-48 h-48 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center">
        {qrSrc ? (
          <img src={qrSrc} alt="打赏二维码" className="w-full h-full object-contain" />
        ) : (
          <div className="text-center text-slate-400 text-xs px-4">
            <div className="text-4xl mb-2">💳</div>
            打赏二维码占位
            <div className="mt-1 text-[10px]">放入 public/qr/tip.png</div>
          </div>
        )}
      </div>
      <p className="text-xs text-slate-400 mt-3">扫码支持 · 让无器械健身帮助更多人</p>
    </div>
  )
}
