import { useCallback, useEffect, useRef, useState } from 'react'
import { useStore } from '../store/useStore'

// 预录真人语音播放（edge-tts 生成）
// 异性口播：男性用户听女声，女性用户听男声
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

  // 读取用户性别，异性口播：男→女声，女→男声
  const gender = useStore((s) => s.profile?.gender)
  const voiceGender = gender === 'female' ? 'male' : 'female'

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setTtsSupported(true)
    }
  }, [])

  // 播放预录音频
  const play = useCallback(
    (key: VoiceClipKey) => {
      // 停止当前播放
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }

      const audio = new Audio(`${VOICE_BASE}${voiceGender}/${key}.mp3`)
      audioRef.current = audio
      audio.play().catch(() => {
        // 自动播放被阻止，忽略
      })
    },
    [voiceGender]
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

  return { play, stop, supported, ttsSupported, voiceGender }
}
