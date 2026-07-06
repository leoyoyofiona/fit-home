import { useCallback, useEffect, useRef, useState } from 'react'

// 预录真人语音播放（edge-tts 生成，男声教练）
// 优先播放 mp3 音频文件；无匹配文件时降级为 Web Speech API
const VOICE_BASE = '/audio/voice/'

// 预录音频 key → 文件名映射
const CLIP_KEYS = [
  'start',
  'jumping-jack', 'squat', 'pushup', 'crunch', 'plank',
  'russian-twist', 'leg-raise', 'lunge', 'mountain-climber', 'burpee',
  'mid-half', 'mid-final',
  'rest', 'rest-next',
  'complete',
] as const

export type VoiceClipKey = (typeof CLIP_KEYS)[number]

export function useVoice() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [supported] = useState(true)
  const [ttsSupported, setTtsSupported] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setTtsSupported(true)
    }
  }, [])

  // 播放预录音频
  const play = useCallback((key: VoiceClipKey) => {
    // 停止当前播放
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }

    const audio = new Audio(`${VOICE_BASE}${key}.mp3`)
    audioRef.current = audio
    audio.play().catch(() => {
      // 自动播放被阻止，忽略
    })
  }, [])

  // TTS 降级播放（仅用于无法预录的动态文本）
  const speak = useCallback(
    (text: string) => {
      if (!text) return
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel()
          const u = new SpeechSynthesisUtterance(text)
          u.lang = 'zh-CN'
          const voices = window.speechSynthesis.getVoices()
          const zh = voices.find(
            (v) => v.lang === 'zh-CN' || v.lang === 'zh_CN' || v.lang.startsWith('zh')
          )
          if (zh) u.voice = zh
          u.rate = 1.1
          u.pitch = 1
          window.speechSynthesis.speak(u)
        } catch {
          /* ignore */
        }
      }
    },
    []
  )

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }, [])

  return { play, speak, stop, supported, ttsSupported }
}
