import { useCallback, useEffect, useState } from 'react'

// 中文口令 TTS（Web Speech API）
// 作为"真人视频中文讲解/口令"的占位：真实视频上线后可关闭
export function useSpeech() {
  const [supported, setSupported] = useState(false)
  const [zhVoiceReady, setZhVoiceReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    setSupported(true)

    const check = () => {
      const voices = window.speechSynthesis.getVoices()
      const zh = voices.find(
        (v) => v.lang === 'zh-CN' || v.lang === 'zh_CN' || v.lang.startsWith('zh')
      )
      setZhVoiceReady(!!zh)
    }
    check()
    window.speechSynthesis.onvoiceschanged = check
    return () => {
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [])

  const speak = useCallback(
    (text: string, opts?: { rate?: number }) => {
      if (!supported || !text) return
      try {
        window.speechSynthesis.cancel()
        const u = new SpeechSynthesisUtterance(text)
        u.lang = 'zh-CN'
        const voices = window.speechSynthesis.getVoices()
        const zh = voices.find(
          (v) => v.lang === 'zh-CN' || v.lang === 'zh_CN' || v.lang.startsWith('zh')
        )
        if (zh) u.voice = zh
        u.rate = opts?.rate ?? 1
        u.pitch = 1
        window.speechSynthesis.speak(u)
      } catch {
        /* ignore */
      }
    },
    [supported]
  )

  const stop = useCallback(() => {
    if (supported) window.speechSynthesis.cancel()
  }, [supported])

  return { speak, stop, supported, zhVoiceReady }
}
