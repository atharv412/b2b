"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface QuickRepliesProps {
  onSelect: (reply: string) => void
  className?: string
}

const quickReplies = [
  "Hello! How can I help you?",
  "Thanks for reaching out!",
  "I'll get back to you soon.",
  "Let me check on that for you.",
  "That sounds great!",
  "I understand your concern.",
  "Let's schedule a meeting.",
  "I'll send you the details shortly."
]

export function QuickReplies({ onSelect, className }: QuickRepliesProps) {
  return (
    <div className={cn(
      "p-3 bg-muted/50 rounded-lg border",
      className
    )}>
      <div className="text-xs font-medium text-muted-foreground mb-2">
        Quick Replies
      </div>
      <div className="flex flex-wrap gap-2">
        {quickReplies.map((reply, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelect(reply)}
              className="text-xs h-7 px-2"
            >
              {reply}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
