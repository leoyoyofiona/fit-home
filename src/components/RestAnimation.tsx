// 休息放松动作 — 播放真人放松/拉伸视频
// 5 个不同的真人放松动作视频循环播放，让用户跟着做真正的放松

const REST_VIDEOS: { src: string; name: string; desc: string }[] = [
  {
    src: '/videos/rest/arm_swing_female.mp4',
    name: '手臂摆动',
    desc: '甩甩手臂，放松肩部',
  },
  {
    src: '/videos/rest/shoulder_roll_male.mp4',
    name: '肩部转动',
    desc: '双肩前后转圈放松',
  },
  {
    src: '/videos/rest/neck_relax_female.mp4',
    name: '颈部放松',
    desc: '慢慢转动头部，舒展颈椎',
  },
  {
    src: '/videos/rest/seated_back_male.mp4',
    name: '背部拉伸',
    desc: '坐姿伸展，舒展脊柱',
  },
  {
    src: '/videos/rest/seated_relax_female.mp4',
    name: '静坐调整',
    desc: '闭眼深呼吸，调整呼吸',
  },
]

// 随机选一个视频（每次进入休息时随机）
function pickRandom(): { src: string; name: string; desc: string } {
  return REST_VIDEOS[Math.floor(Math.random() * REST_VIDEOS.length)]
}

interface Props {
  // 传入 key 让父组件可以在新一次休息时重新选择视频
  seed?: number
}

export default function RestAnimation({ seed = 0 }: Props) {
  // 每次 seed 变化时重新随机选一个
  const idx = Math.abs(seed) % REST_VIDEOS.length
  const video = REST_VIDEOS[idx]

  return (
    <div className="absolute inset-0 flex flex-col bg-slate-950">
      {/* 真人放松视频 */}
      <video
        key={video.src}
        src={video.src}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* 顶部渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none" />

      {/* 休息阶段绿色色调遮罩 */}
      <div className="absolute inset-0 bg-green-900/20 pointer-events-none" />

      {/* 顶部动作名 + 描述（避开 VideoPlayer 的顶部 label 和底部进度条） */}
      <div className="absolute top-12 left-0 right-0 z-10 text-center px-4">
        <div className="inline-block px-5 py-2 rounded-full bg-green-600/90 text-white text-base font-bold shadow-lg mb-2">
          {video.name}
        </div>
        <p className="text-green-200 text-sm drop-shadow">{video.desc}</p>
      </div>
    </div>
  )
}

// 导出 REST_VIDEOS 供其他组件使用
export { REST_VIDEOS, pickRandom }
