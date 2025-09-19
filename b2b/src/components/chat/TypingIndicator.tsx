"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface TypingUser {
  id: string
  name: string
  avatar?: string
}

interface TypingIndicatorProps {
  users: TypingUser[]
  className?: string
}

export function TypingIndicator({ users, className }: TypingIndicatorProps) {
  if (users.length === 0) return null

  const getTypingText = () => {
    if (users.length === 1) {
      return `${users[0].name} is typing...`
    } else if (users.length === 2) {
      return `${users[0].name} and ${users[1].name} are typing...`
    } else {
      return `${users.length} people are typing...`
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={cn(
        "flex items-center gap-3 p-3 bg-muted/50 rounded-lg",
        className
      )}
    >
      {/* Avatars */}
      <div className="flex -space-x-2">
        {users.slice(0, 3).map((user, index) => (
          <Avatar key={user.id} className="h-6 w-6 border-2 border-background">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-xs">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        ))}
        {users.length > 3 && (
          <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
            <span className="text-xs font-medium">+{users.length - 3}</span>
          </div>
        )}
      </div>

      {/* Typing Text */}
      <div className="flex items-center gap-1">
        <span className="text-sm text-muted-foreground">
          {getTypingText()}
        </span>
        
        {/* Animated Dots */}
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-1 h-1 bg-muted-foreground rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
