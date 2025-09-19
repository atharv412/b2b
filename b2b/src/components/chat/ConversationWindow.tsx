"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Search, 
  Phone, 
  Video, 
  MoreVertical, 
  Users, 
  ShoppingCart, 
  Headphones,
  Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageItem } from './MessageItem'
import { Composer } from './Composer'
import { TypingIndicator } from './TypingIndicator'
import { ConversationDetailsDrawer } from './ConversationDetailsDrawer'
import { useMessages } from '@/hooks/useChat'
import { Chat } from '@/types/chat'
import { cn } from '@/lib/utils'

interface ConversationWindowProps {
  chat: Chat | null
  onBack?: () => void
  isMobile?: boolean
  className?: string
}

export function ConversationWindow({ chat, onBack, isMobile = false, className }: ConversationWindowProps) {
  
  const [showSearch, setShowSearch] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const { 
    messages, 
    typingUsers, 
    hasMore, 
    isLoadingMore, 
    loadMoreMessages
  } = useMessages(chat?.id || '')

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Mark as read when chat is active
  useEffect(() => {
    if (chat && chat.unreadCount > 0) {
      // TODO: Implement markAsRead functionality
      console.log('Marking chat as read:', chat.id)
    }
  }, [chat])

  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore) {
      loadMoreMessages()
    }
  }

  const getChatTitle = (chat: Chat) => {
    if (chat.type === 'direct') {
      const otherParticipant = chat.participants.find(p => p.id !== 'current-user')
      return otherParticipant?.name || chat.name
    }
    return chat.name
  }

  const getChatSubtitle = (chat: Chat) => {
    if (chat.type === 'direct') {
      const otherParticipant = chat.participants.find(p => p.id !== 'current-user')
      return otherParticipant?.status === 'online' ? 'Online' : 'Last seen recently'
    }
    return `${chat.participants.length} participants`
  }

  const getChatIcon = (chat: Chat) => {
    switch (chat.type) {
      case 'group':
        return <Users className="h-4 w-4" />
      case 'product':
        return <ShoppingCart className="h-4 w-4" />
      case 'support':
        return <Headphones className="h-4 w-4" />
      default:
        return null
    }
  }

  if (!chat) {
    return (
      <div className={cn(
        "flex-1 flex items-center justify-center bg-muted/10",
        className
      )}>
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
            <Users className="h-12 w-12 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Select a conversation
            </h3>
            <p className="text-sm text-muted-foreground">
              Choose a chat to start messaging
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "flex flex-col h-full bg-background",
      className
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        isMobile && "px-4 py-3"
      )}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Back Button - Only show on mobile */}
          {isMobile && onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-8 w-8 flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Chat Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={chat.avatar} />
              <AvatarFallback>
                {getChatTitle(chat).split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-sm truncate">
                  {getChatTitle(chat)}
                </h2>
                {getChatIcon(chat) && (
                  <div className="text-muted-foreground flex-shrink-0">
                    {getChatIcon(chat)}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {getChatSubtitle(chat)}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSearch(!showSearch)}
            className="h-8 w-8"
          >
            <Search className="h-4 w-4" />
          </Button>
          
          {chat.type === 'direct' && (
            <>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Video className="h-4 w-4" />
              </Button>
            </>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDetails(true)}
            className="h-8 w-8"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          >
            <div className="p-4">
              <Input
                placeholder="Search messages..."
                className="w-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        onScroll={(e) => {
          const { scrollTop } = e.currentTarget
          if (scrollTop === 0 && hasMore && !isLoadingMore) {
            handleLoadMore()
          }
        }}
      >
        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? 'Loading...' : 'Load more messages'}
            </Button>
          </div>
        )}

        {/* Messages List */}
        <div className="space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <MessageItem
                message={message}
                isOwn={message.senderId === 'current-user'}
                showAvatar={index === 0 || messages[index - 1].senderId !== message.senderId}
                showTimestamp={index === messages.length - 1 || 
                  new Date(message.timestamp).getTime() - new Date(messages[index + 1].timestamp).getTime() > 300000}
              />
            </motion.div>
          ))}
        </div>

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <TypingIndicator users={typingUsers as any} />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Composer chatId={chat.id} />
      </div>

      {/* Details Drawer */}
      <ConversationDetailsDrawer
        chat={chat}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />
    </div>
  )
}
