"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  MessageCircle,
  Filter,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChatItem } from './ChatItem'
import { useChatList, useChatActions } from '@/hooks/useChat'
import { Chat } from '@/types/chat'
import { cn } from '@/lib/utils'

interface ChatsListProps {
  onChatSelect: (chat: Chat) => void
  activeChat?: Chat | null
  searchQuery?: string
  filter?: string
  className?: string
}

export function ChatsList({ 
  onChatSelect, 
  activeChat, 
  searchQuery = '', 
  filter = 'all',
  className 
}: ChatsListProps) {
  const { 
    chats, 
    pinnedChats, 
    regularChats, 
    filters, 
    handleSearch, 
    handleFilterChange, 
    clearFilters,
    isLoading 
  } = useChatList()
  
  const { pinChat, unpinChat, muteChat, unmuteChat, archiveChat } = useChatActions()
  const [showFilters, setShowFilters] = useState(false)

  const handleChatAction = async (chatId: string, action: string) => {
    switch (action) {
      case 'pin':
        await pinChat(chatId)
        break
      case 'unpin':
        await unpinChat(chatId)
        break
      case 'mute':
        await muteChat(chatId)
        break
      case 'unmute':
        await unmuteChat(chatId)
        break
      case 'archive':
        await archiveChat(chatId)
        break
    }
  }

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Chats List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-1">
            {/* Pinned Chats */}
            {pinnedChats.length > 0 && (
              <div className="px-4 py-2">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <MessageCircle className="h-3 w-3" />
                  Pinned
                </div>
              </div>
            )}
            
            {pinnedChats.map((chat, index) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ChatItem
                  chat={chat}
                  isActive={activeChat?.id === chat.id}
                  onClick={() => onChatSelect(chat)}
                  onAction={handleChatAction}
                  showTypeIcon={true}
                />
              </motion.div>
            ))}

            {/* Regular Chats */}
            {regularChats.length > 0 && (
              <div className="px-4 py-2">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  <MessageCircle className="h-3 w-3" />
                  All Chats
                </div>
              </div>
            )}

            {regularChats.map((chat, index) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (pinnedChats.length + index) * 0.05 }}
              >
                <ChatItem
                  chat={chat}
                  isActive={activeChat?.id === chat.id}
                  onClick={() => onChatSelect(chat)}
                  onAction={handleChatAction}
                  showTypeIcon={true}
                />
              </motion.div>
            ))}

            {/* Empty State */}
            {chats.length === 0 && (
              <div className="text-center py-8 text-muted-foreground px-4">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm font-medium mb-1">No chats found</p>
                <p className="text-xs">
                  {searchQuery ? 'Try adjusting your search' : 'Start a conversation to get started'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
