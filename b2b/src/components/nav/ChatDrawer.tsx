"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, Send, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useNav } from '@/context/NavContext'
import { cn } from '@/lib/utils'

const slideInRight = {
  hidden: { x: '100%', opacity: 0 },
  enter: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 140, damping: 20 } },
  exit: { x: '100%', opacity: 0 }
}

const fadeIn = {
  hidden: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
}

interface Chat {
  id: string
  name: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  avatar?: string
  isOnline: boolean
}

interface ChatDrawerProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function ChatDrawer({ isOpen, onClose, className }: ChatDrawerProps) {
  const { unreadCounts, updateUnreadCounts } = useNav()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedChat, setSelectedChat] = useState<string | null>(null)

  // Mock chat data
  const chats: Chat[] = [
    {
      id: '1',
      name: 'Aditya Singh',
      lastMessage: 'Hey, thanks for the quotation!',
      timestamp: '2 min ago',
      unreadCount: 2,
      avatar: '/avatars/john.jpg',
      isOnline: true
    },
    {
      id: '2',
      name: 'Ananya Gupta',
      lastMessage: 'Can we schedule a call tomorrow?',
      timestamp: '1 hour ago',
      unreadCount: 0,
      avatar: '/avatars/sarah.svg',
      isOnline: false
    },
    {
      id: '3',
      name: 'Rohan Kumar',
      lastMessage: 'The project looks great!',
      timestamp: '3 hours ago',
      unreadCount: 1,
      avatar: '/avatars/mike.jpg',
      isOnline: true
    },
    {
      id: '4',
      name: 'Tech Support',
      lastMessage: 'Your issue has been resolved',
      timestamp: '1 day ago',
      unreadCount: 0,
      avatar: '/avatars/support.jpg',
      isOnline: false
    }
  ]

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleChatClick = (chatId: string) => {
    setSelectedChat(chatId)
    // Mark as read
    const chat = chats.find(c => c.id === chatId)
    if (chat && chat.unreadCount > 0) {
      updateUnreadCounts({ 
        chat: Math.max(0, unreadCounts.chat - chat.unreadCount) 
      })
    }
  }

  const totalUnreadCount = chats.reduce((sum, chat) => sum + chat.unreadCount, 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="enter"
            exit="hidden"
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate="enter"
            exit="hidden"
            className={cn(
              "fixed right-0 top-0 z-50 h-full w-full max-w-sm bg-background border-l",
              className
            )}
          >
            <div className="flex h-16 items-center justify-between px-4 border-b">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">Messages</h2>
                {totalUnreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {totalUnreadCount}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close chat</span>
                </Button>
              </div>
            </div>

            <div className="p-4">
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="space-y-2">
                  {filteredChats.map((chat) => (
                    <motion.div
                      key={chat.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "p-3 rounded-lg cursor-pointer transition-colors",
                        selectedChat === chat.id 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-accent hover:text-accent-foreground"
                      )}
                      onClick={() => handleChatClick(chat.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={chat.avatar} alt={chat.name} />
                            <AvatarFallback>
                              {chat.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {chat.isOnline && (
                            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium truncate">
                              {chat.name}
                            </h3>
                            <span className="text-xs text-muted-foreground">
                              {chat.timestamp}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-sm text-muted-foreground truncate">
                              {chat.lastMessage}
                            </p>
                            {chat.unreadCount > 0 && (
                              <Badge 
                                variant="destructive" 
                                className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                              >
                                {chat.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {filteredChats.length === 0 && (
                  <div className="text-center py-8">
                    <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      No conversations found
                    </p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
