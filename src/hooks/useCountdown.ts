import { useEffect, useRef, useState, useCallback } from 'react'

// 倒计时 hook
export function useCountdown() {
  const [remaining, setRemaining] = useState(0)
  const [running, setRunning] = useState(false)
  const timerRef = useRef<number | null>(null)
  const onEndRef = useRef<(() => void) | null>(null)

  const clear = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const start = useCallback(
    (seconds: number, onEnd?: () => void) => {
      clear()
      setRemaining(Math.max(0, Math.ceil(seconds)))
      onEndRef.current = onEnd ?? null
      setRunning(true)
      timerRef.current = window.setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clear()
            setRunning(false)
            if (onEndRef.current) onEndRef.current()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    },
    [clear]
  )

  const stop = useCallback(() => {
    clear()
    setRunning(false)
  }, [clear])

  useEffect(() => {
    return clear
  }, [clear])

  return { remaining, running, start, stop }
}
