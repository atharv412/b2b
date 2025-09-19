"use client"

import { useState, useEffect, useCallback } from 'react'

interface UseResendCooldownReturn {
  isCooldown: boolean
  remainingSeconds: number
  startCooldown: () => void
  resetCooldown: () => void
}

export function useResendCooldown(duration: number = 60): UseResendCooldownReturn {
  const [isCooldown, setIsCooldown] = useState(false)
  const [remainingSeconds, setRemainingSeconds] = useState(0)

  const startCooldown = useCallback(() => {
    setIsCooldown(true)
    setRemainingSeconds(duration)
  }, [duration])

  const resetCooldown = useCallback(() => {
    setIsCooldown(false)
    setRemainingSeconds(0)
  }, [])

  useEffect(() => {
    if (!isCooldown || remainingSeconds <= 0) {
      return
    }

    const timer = setTimeout(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          setIsCooldown(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [isCooldown, remainingSeconds])

  return {
    isCooldown,
    remainingSeconds,
    startCooldown,
    resetCooldown
  }
}
