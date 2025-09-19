"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Check, 
  CheckCheck, 
  Clock, 
  X, 
  Heart, 
  ThumbsUp, 
  Smile, 
  MoreHorizontal,
  Reply,
  Copy,
  Download,
  Eye,
  ShoppingCart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AttachmentPreview } from './AttachmentPreview'
import { MessageReactions } from './MessageReactions'
import { useMessages } from '@/hooks/useChat'
import { Message, ReactionType } from '@/types/chat'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

interface MessageItemProps {
  message: Message
  isOwn: boolean
  showAvatar?: boolean
  showTimestamp?: boolean
  className?: string
}

const statusIcons = {
  sending: Clock,
  sent: Check,
  delivered: CheckCheck,
  read: CheckCheck,
  failed: X
}

const statusColors = {
  sending: 'text-muted-foreground',
  sent: 'text-muted-foreground',
  delivered: 'text-blue-500',
  read: 'text-blue-500',
  failed: 'text-red-500'
}

const reactionEmojis: Record<ReactionType, string> = {
  like: '👍',
  love: '❤️',
  laugh: '😂',
  wow: '😮',
  sad: '😢',
  angry: '😠',
  thumbs_up: '👍',
  thumbs_down: '��'
}

export function MessageItem({ 
  message, 
  isOwn, 
  showAvatar = false, 
  showTimestamp = false,
  className 
}: MessageItemProps) {
  
  const [showReactions, setShowReactions] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const { addReaction, removeReaction } = useMessages(message.chatId)

  const StatusIcon = statusIcons[message.status]
  const statusColor = statusColors[message.status]

  const handleReaction = async (reactionType: ReactionType) => {
    const existingReaction = message.reactions?.find(r => r.userId === 'current-user' && r.type === reactionType)
    
    if (existingReaction) {
      await removeReaction(message.id, existingReaction.id)
    } else {
      await addReaction(message.id, reactionType)
    }
  }

  const handleReply = () => {
    // Handle reply functionality
    console.log('Reply to message:', message.id)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
  }

  const handleDownload = () => {
    if (message.attachments?.[0]) {
      const link = document.createElement('a')
      link.href = message.attachments[0].url
      link.download = message.attachments[0].name
      link.click()
    }
  }

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group relative flex gap-3",
        isOwn ? "flex-row-reverse" : "flex-row",
        className
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={message.sender?.avatar} />
          <AvatarFallback className="text-xs">
            {message.sender?.name?.split(' ').map(n => n[0]).join('') || 'U'}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Spacer for own messages */}
      {showAvatar && isOwn && <div className="w-8" />}

      {/* Message Content */}
      <div className={cn(
        "flex flex-col max-w-[85%] sm:max-w-[75%] md:max-w-[65%] lg:max-w-[55%]",
        isOwn ? "items-end" : "items-start"
      )}>
        {/* Sender Name & Timestamp */}
        {showTimestamp && (
          <div className={cn(
            "flex items-center gap-2 mb-1 text-xs text-muted-foreground",
            isOwn ? "flex-row-reverse" : "flex-row"
          )}>
            {!isOwn && (
              <span className="font-medium">{message.sender?.name || 'Unknown'}</span>
            )}
            <span>{formatMessageTime(message.timestamp)}</span>
          </div>
        )}

        {/* Message Container */}
        <div className="relative group/message">
          {/* Message Actions */}
          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={cn(
                  "absolute top-0 z-10 flex items-center gap-1",
                  isOwn ? "left-0 -translate-x-full" : "right-0 translate-x-full"
                )}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReactions(!showReactions)}
                  className="h-6 w-6 p-0"
                >
                  <Smile className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReply}
                  className="h-6 w-6 p-0"
                >
                  <Reply className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                {message.attachments && message.attachments.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownload}
                    className="h-6 w-6 p-0"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Message Bubble */}
          <div className={cn(
            "relative px-4 py-2 rounded-2xl max-w-full",
            isOwn 
              ? "bg-primary text-primary-foreground rounded-br-md" 
              : "bg-muted rounded-bl-md",
            message.status === 'failed' && "border border-red-500"
          )}>
            {/* Text Content */}
            {message.type === 'text' && (
              <div className="whitespace-pre-wrap break-words text-sm">
                {message.content}
              </div>
            )}

            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="space-y-2 mt-2">
                {message.attachments.map((attachment) => (
                  <AttachmentPreview
                    key={attachment.id}
                    attachment={attachment}
                    isOwn={isOwn}
                  />
                ))}
              </div>
            )}

            {/* Product Preview */}
            {message.type === 'product' && message.metadata?.productId && (
              <div className="mt-2 p-3 bg-background/10 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">
                      {(message.metadata as any).productName || 'Product'}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {(message.metadata as any).productPrice || 'Price not available'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quote Preview */}
            {message.type === 'quote' && (message.metadata as any)?.quotedMessage && (
              <div className="mt-2 p-3 bg-background/10 rounded-lg border-l-4 border-primary/50">
                <div className="text-xs text-muted-foreground mb-1">
                  Replying to {(message.metadata as any).quotedMessage.sender?.name}
                </div>
                <div className="text-sm truncate">
                                      {(message.metadata as any).quotedMessage.content}
                </div>
              </div>
            )}

            {/* Status Icons */}
            {isOwn && (
              <div className={cn(
                "absolute -bottom-1 -right-1 flex items-center gap-1",
                statusColor
              )}>
                <StatusIcon className="h-3 w-3" />
                {message.status === 'read' && (
                  <div className="h-2 w-2 bg-blue-500 rounded-full" />
                )}
              </div>
            )}
          </div>

          {/* Message Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className={cn(
              "flex flex-wrap gap-1 mt-1",
              isOwn ? "justify-end" : "justify-start"
            )}>
              {message.reactions.map((reaction) => (
                <Button
                  key={reaction.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReaction(reaction.type)}
                  className="h-6 px-2 text-xs"
                >
                  {reactionEmojis[reaction.type]}
                  <span className="ml-1">{(reaction as any).count}</span>
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Reaction Picker */}
        <AnimatePresence>
          {showReactions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={cn(
                "absolute top-full mt-2 z-20",
                isOwn ? "right-0" : "left-0"
              )}
            >
              <MessageReactions
                onReaction={handleReaction}
                onClose={() => setShowReactions(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
