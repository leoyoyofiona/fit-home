// Web Audio 兜底背景音乐：无音频文件时合成轻柔循环环境音
// 有 public/audio/bgm.mp3 时优先用真实音乐（由 useBgm 控制）

let ctx: AudioContext | null = null
let master: GainNode | null = null
let nodes: OscillatorNode[] = []
let lfo: OscillatorNode | null = null

function ensureCtx(): AudioContext {
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.06
    master.connect(ctx.destination)
  }
  return ctx
}

// 启动合成环境音（柔和的五度音垫）
export function startAmbient() {
  const c = ensureCtx()
  if (c.state === 'suspended') c.resume()
  stopAmbient()

  const freqs = [196.0, 293.66, 392.0] // G3 D4 G4 五度堆叠
  nodes = freqs.map((f, i) => {
    const osc = c.createOscillator()
    osc.type = i === 0 ? 'sine' : 'triangle'
    osc.frequency.value = f
    const g = c.createGain()
    g.gain.value = i === 0 ? 0.5 : 0.25
    osc.connect(g)
    g.connect(master!)
    osc.start()
    return osc
  })

  // 缓慢音量起伏，模拟呼吸感
  lfo = c.createOscillator()
  lfo.frequency.value = 0.12
  const lfoGain = c.createGain()
  lfoGain.gain.value = 0.03
  lfo.connect(lfoGain)
  lfoGain.connect(master!.gain)
  lfo.start()
}

export function stopAmbient() {
  nodes.forEach((n) => {
    try {
      n.stop()
    } catch {
      /* ignore */
    }
  })
  nodes = []
  if (lfo) {
    try {
      lfo.stop()
    } catch {
      /* ignore */
    }
    lfo = null
  }
}

export function setAmbientVolume(v: number) {
  if (master) master.gain.value = v
}
