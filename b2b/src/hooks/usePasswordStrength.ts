"use client"

import { useState, useMemo } from 'react'
import { PasswordStrength } from '@/types/user'

// Fallback password strength checker if zxcvbn is not available
const fallbackPasswordStrength = (password: string): PasswordStrength => {
  let score = 0
  const suggestions: string[] = []
  
  if (password.length >= 8) score++
  else suggestions.push('Use at least 8 characters')
  
  if (/[a-z]/.test(password)) score++
  else suggestions.push('Add lowercase letters')
  
  if (/[A-Z]/.test(password)) score++
  else suggestions.push('Add uppercase letters')
  
  if (/[0-9]/.test(password)) score++
  else suggestions.push('Add numbers')
  
  if (/[^A-Za-z0-9]/.test(password)) score++
  else suggestions.push('Add special characters')
  
  const feedback = score < 2 ? 'Weak' : score < 3 ? 'Fair' : score < 4 ? 'Good' : 'Strong'
  
  return {
    score,
    suggestions,
    feedback
  }
}

// Type for zxcvbn result
interface ZxcvbnResult {
  score: number
  feedback: {
    suggestions: string[]
    warning?: string
  }
}

export function usePasswordStrength(password: string): PasswordStrength {
  const [zxcvbnLoaded, setZxcvbnLoaded] = useState(false)
  
  const strength = useMemo(() => {
    if (password.length === 0) {
      return {
        score: 0,
        suggestions: [],
        feedback: 'Enter a password'
      }
    }
    
    // Try to use zxcvbn if available
    if (typeof window !== 'undefined' && (window as any).zxcvbn) {
      try {
        const result = (window as any).zxcvbn(password) as ZxcvbnResult
        return {
          score: result.score,
          suggestions: result.feedback.suggestions || [],
          feedback: result.feedback.warning || getScoreLabel(result.score)
        }
      } catch (error) {
        console.warn('zxcvbn error, falling back to basic checker:', error)
        return fallbackPasswordStrength(password)
      }
    }
    
    // Fallback to basic checker
    return fallbackPasswordStrength(password)
  }, [password])
  
  // Load zxcvbn dynamically
  useState(() => {
    if (typeof window !== 'undefined' && !(window as any).zxcvbn) {
      import('zxcvbn').then((zxcvbn) => {
        (window as any).zxcvbn = zxcvbn.default
        setZxcvbnLoaded(true)
      }).catch(() => {
        console.warn('Failed to load zxcvbn, using fallback')
      })
    }
  })
  
  return strength
}

function getScoreLabel(score: number): string {
  switch (score) {
    case 0:
    case 1:
      return 'Weak'
    case 2:
      return 'Fair'
    case 3:
      return 'Good'
    case 4:
      return 'Strong'
    default:
      return 'Unknown'
  }
}
