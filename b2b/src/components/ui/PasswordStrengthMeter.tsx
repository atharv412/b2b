"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { PasswordStrength } from '@/types/user'
import { cn } from '@/lib/utils'

interface PasswordStrengthMeterProps {
  strength: PasswordStrength
  className?: string
}

const strengthColors = {
  0: 'bg-red-500',
  1: 'bg-orange-500', 
  2: 'bg-yellow-500',
  3: 'bg-blue-500',
  4: 'bg-green-500'
}

const strengthLabels = {
  0: 'Very Weak',
  1: 'Weak',
  2: 'Fair', 
  3: 'Good',
  4: 'Strong'
}

export function PasswordStrengthMeter({ strength, className }: PasswordStrengthMeterProps) {
  const { score, suggestions, feedback } = strength
  const progressValue = (score / 4) * 100
  const colorClass = strengthColors[score as keyof typeof strengthColors] || 'bg-gray-300'
  const label = strengthLabels[score as keyof typeof strengthLabels] || 'Unknown'

  return (
    <div className={cn("space-y-2", className)}>
      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Password strength</span>
          <motion.div
            key={score}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Badge 
              variant={score < 2 ? "destructive" : score < 3 ? "secondary" : "default"}
              className="text-xs"
            >
              {label}
            </Badge>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressValue}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "h-2 rounded-full transition-colors duration-300",
            colorClass
          )}
        />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-1"
        >
          <p className="text-xs text-muted-foreground">Suggestions:</p>
          <ul className="space-y-1">
            {suggestions.map((suggestion, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                {suggestion}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Feedback */}
      {feedback && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-muted-foreground"
        >
          {feedback}
        </motion.p>
      )}
    </div>
  )
}
