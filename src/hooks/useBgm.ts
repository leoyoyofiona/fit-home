import { useCallback, useEffect, useRef, useState } from 'react'

// 背景动感音乐播放（循环、低音量，不盖过语音口令）
const BGM_SRC = '/audio/bgm.mp3'
const BGM_VOLUME = 0.22 // 背景音乐音量，低于语音口令

export function useBgm() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [enabled, setEnabled] = useState(true)
  const [playing, setPlaying] = useState(false)

  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(BGM_SRC)
      audio.loop = true
      audio.volume = BGM_VOLUME
      audioRef.current = audio
    }
    return audioRef.current
  }, [])

  const play = useCallback(() => {
    if (!enabled) return
    const audio = ensureAudio()
    audio.volume = BGM_VOLUME
    audio.play().catch(() => {
      // 自动播放被阻止，忽略
    })
    setPlaying(true)
  }, [enabled, ensureAudio])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    setPlaying(false)
  }, [])

  const resume = useCallback(() => {
    if (!enabled) return
    audioRef.current?.play().catch(() => {})
    setPlaying(true)
  }, [enabled])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setPlaying(false)
  }, [])

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev
      if (next) {
        const audio = audioRef.current || ensureAudio()
        audio.volume = BGM_VOLUME
        audio.play().catch(() => {})
        setPlaying(true)
      } else {
        audioRef.current?.pause()
        setPlaying(false)
      }
      return next
    })
  }, [ensureAudio])

  // 卸载时清理
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  return { enabled, playing, play, pause, resume, stop, toggle }
}
