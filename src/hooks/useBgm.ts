import { useCallback, useEffect, useRef, useState } from 'react'
import { startAmbient, stopAmbient } from '../lib/audio'

// 背景音乐 hook
// 优先用 public/audio/bgm.mp3 真实音乐；文件不存在时用 Web Audio 合成环境音兜底
const BGM_SRC = '/audio/bgm.mp3'

export function useBgm() {
  const [enabled, setEnabled] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fallbackOn = useRef(false)

  useEffect(() => {
    const audio = new Audio(BGM_SRC)
    audio.loop = true
    audio.volume = 0.4
    audio.preload = 'none'
    audioRef.current = audio
    return () => {
      audio.pause()
      stopAmbient()
    }
  }, [])

  const play = useCallback(async () => {
    if (!enabled) return
    const audio = audioRef.current
    if (!audio) return
    try {
      audio.currentTime = 0
      await audio.play()
      setUsingFallback(false)
      if (fallbackOn.current) {
        stopAmbient()
        fallbackOn.current = false
      }
    } catch {
      // 文件不存在或被拦截 → 兜底合成音
      if (!fallbackOn.current) {
        startAmbient()
        fallbackOn.current = true
        setUsingFallback(true)
      }
    }
  }, [enabled])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    if (fallbackOn.current) {
      stopAmbient()
      fallbackOn.current = false
    }
  }, [])

  const toggle = useCallback(() => {
    setEnabled((e) => {
      const next = !e
      if (!next) {
        audioRef.current?.pause()
        if (fallbackOn.current) {
          stopAmbient()
          fallbackOn.current = false
        }
      }
      return next
    })
  }, [])

  return { enabled, usingFallback, play, pause, toggle }
}
