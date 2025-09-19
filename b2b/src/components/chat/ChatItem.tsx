"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Pin, 
  PinOff, 
  Volume2, 
  VolumeX, 
  Archive, 
  MoreHorizontal,
  MessageCircle,
  Users,
  ShoppingCart,
  Headphones
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Chat } from '@/types/chat'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

interface ChatItemProps {
  chat: Chat
  isActive: boolean
  onClick: () => void
  onAction: (chatId: string, action: string) => void
  showTypeIcon?: boolean
}

const chatTypeIcons = {
  direct: MessageCircle,
  group: Users,
  product: ShoppingCart,
  support: Headphones
}

const chatTypeColors = {
  direct: 'text-blue-600',
  group: 'text-green-600',
  product: 'text-purple-600',
  support: 'text-orange-600'
}

export function ChatItem({ chat, isActive, onClick, onAction, showTypeIcon = false }: ChatItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getChatDisplayName = (chat: Chat) => {
    if (chat.type === 'direct') {
      const otherParticipant = chat.participants.find(p => p.id !== 'current-user')
      return otherParticipant?.name || chat.name
    }
    return chat.name
  }

  const getChatAvatar = (chat: Chat) => {
    if (chat.avatar) {
      return chat.avatar
    }
    if (chat.type === 'direct') {
      const otherParticipant = chat.participants.find(p => p.id !== 'current-user')
      return otherParticipant?.avatar
    }
    return undefined
  }

  const getChatTypeIcon = (type: string) => {
    const Icon = chatTypeIcons[type as keyof typeof chatTypeIcons] || MessageCircle
    return <Icon className="h-4 w-4" />
  }

  const getChatTypeColor = (type: string) => {
    return chatTypeColors[type as keyof typeof chatTypeColors] || 'text-gray-600'
  }

  return (
    <motion.div
      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
      className={cn(
        "relative group cursor-pointer border-b border-border/50 transition-colors",
        isActive && "bg-muted/50"
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3 p-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <Avatar className="h-12 w-12">
            <AvatarImage src={getChatAvatar(chat)} />
            <AvatarFallback className="text-sm">
              {getChatDisplayName(chat).split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          {/* Online Status */}
          {chat.participants.some(p => p.id !== 'current-user' && p.status === 'online') && (
            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-background rounded-full" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <h3 className="font-medium text-sm truncate">
                {getChatDisplayName(chat)}
              </h3>
              {showTypeIcon && (
                <div className={cn("flex-shrink-0", getChatTypeColor(chat.type))}>
                  {getChatTypeIcon(chat.type)}
                </div>
              )}
              {chat.isPinned && (
                <Pin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              )}
              {chat.isMuted && (
                <VolumeX className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              )}
            </div>
            
            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              {chat.lastMessage && (
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(new Date(chat.lastMessage.timestamp), { addSuffix: true })}
                </span>
              )}
              {chat.unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs min-w-[20px]"
                >
                  {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground truncate flex-1 min-w-0">
              {chat.lastMessage?.content || 'No messages yet'}
            </p>
            
            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              {chat.lastMessage?.status === 'read' && (
                <div className="h-2 w-2 bg-blue-500 rounded-full" />
              )}
              {chat.lastMessage?.status === 'delivered' && (
                <div className="h-2 w-2 bg-gray-400 rounded-full" />
              )}
            </div>
          </div>
        </div>

        {/* Actions Menu */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onAction(chat.id, chat.isPinned ? 'unpin' : 'pin')}>
                    {chat.isPinned ? (
                      <>
                        <PinOff className="h-4 w-4 mr-2" />
                        Unpin
                      </>
                    ) : (
                      <>
                        <Pin className="h-4 w-4 mr-2" />
                        Pin
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAction(chat.id, chat.isMuted ? 'unmute' : 'mute')}>
                    {chat.isMuted ? (
                      <>
                        <Volume2 className="h-4 w-4 mr-2" />
                        Unmute
                      </>
                    ) : (
                      <>
                        <VolumeX className="h-4 w-4 mr-2" />
                        Mute
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onAction(chat.id, 'archive')}>
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
