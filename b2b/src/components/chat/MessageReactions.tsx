"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { ReactionType } from '@/types/chat'
import { cn } from '@/lib/utils'

interface MessageReactionsProps {
  onReaction: (reactionType: ReactionType) => void
  onClose: () => void
  className?: string
}

const reactions: { type: ReactionType; emoji: string; label: string }[] = [
  { type: 'like', emoji: '👍', label: 'Like' },
  { type: 'love', emoji: '❤️', label: 'Love' },
  { type: 'laugh', emoji: '😂', label: 'Laugh' },
  { type: 'wow', emoji: '😮', label: 'Wow' },
  { type: 'sad', emoji: '😢', label: 'Sad' },
  { type: 'angry', emoji: '😠', label: 'Angry' },
  { type: 'thumbs_up', emoji: '👍', label: 'Thumbs Up' },
  { type: 'thumbs_down', emoji: '👎', label: 'Thumbs Down' }
]

export function MessageReactions({ onReaction, onClose, className }: MessageReactionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={cn(
        "bg-background border rounded-lg shadow-lg p-2 flex items-center gap-1",
        className
      )}
    >
      {reactions.map((reaction, index) => (
        <motion.div
          key={reaction.type}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onReaction(reaction.type)
              onClose()
            }}
            className="h-8 w-8 p-0 hover:bg-muted"
            title={reaction.label}
          >
            <span className="text-lg">{reaction.emoji}</span>
          </Button>
        </motion.div>
      ))}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="h-8 w-8 p-0 ml-1"
      >
        <X className="h-4 w-4" />
      </Button>
    </motion.div>
  )
}
