"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Users, Search, Filter, ArrowLeft, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ChatsList } from './ChatsList'
import { ConversationWindow } from './ConversationWindow'
import { useWebSocket } from '@/hooks/useChat'
import { cn } from '@/lib/utils'

export function Chat() {
  const [activeChat, setActiveChat] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileChatList, setShowMobileChatList] = useState(true)
  const { connect, isConnected } = useWebSocket()

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Connect to WebSocket only once on mount
  useEffect(() => {
    connect('current-user')
  }, []) // Empty dependency array to run only once

  const handleChatSelect = (chat: any) => {
    setActiveChat(chat)
    // On mobile, hide chat list when chat is selected
    if (isMobile) {
      setShowMobileChatList(false)
    }
  }

  const handleBackToChatList = () => {
    setActiveChat(null)
    if (isMobile) {
      setShowMobileChatList(true)
    }
  }

  const filters = [
    { id: 'all', label: 'All', count: 12 },
    { id: 'unread', label: 'Unread', count: 3 },
    { id: 'pinned', label: 'Pinned', count: 2 }
  ]

  return (
    <div className="flex h-full bg-background relative">
      {/* Mobile Header - Only visible on mobile when chat list is shown */}
      {isMobile && showMobileChatList && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-background border-b p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Messages</h1>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Chats List */}
      <AnimatePresence>
        {(!isMobile || showMobileChatList) && (
          <motion.div
            initial={isMobile ? { x: -320 } : undefined}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -320 } : undefined}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={cn(
              "flex flex-col h-full bg-muted/20 border-r",
              isMobile 
                ? "absolute left-0 top-0 w-80 z-20 shadow-lg" 
                : "w-full md:w-1/3 lg:w-1/4 xl:w-1/5"
            )}
          >
            {/* Header */}
            <div className={cn(
              "p-4 border-b bg-background flex-shrink-0",
              isMobile && "pt-16" // Add padding for mobile header
            )}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Chats</h2>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {filters.map((filterItem) => (
                  <Button
                    key={filterItem.id}
                    variant={filter === filterItem.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(filterItem.id)}
                    className="relative flex-shrink-0"
                  >
                    {filterItem.label}
                    {filterItem.count > 0 && (
                      <Badge 
                        variant="secondary" 
                        className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {filterItem.count}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Chats List */}
            <div className="flex-1 overflow-y-auto">
              <ChatsList 
                onChatSelect={handleChatSelect}
                activeChat={activeChat}
                searchQuery={searchQuery}
                filter={filter}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conversation Window */}
      <div className={cn(
        "flex flex-col flex-1",
        isMobile && !showMobileChatList && "w-full"
      )}>
        {activeChat ? (
          <ConversationWindow 
            chat={activeChat}
            onBack={isMobile ? handleBackToChatList : () => setActiveChat(null)}
            isMobile={isMobile}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-muted/10">
            <div className="text-center space-y-4 p-6">
              <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  No chats found
                </h3>
                <p className="text-sm text-muted-foreground">
                  Start a conversation to get started
                </p>
              </div>
              <Button className="mt-4">
                <MessageCircle className="h-4 w-4 mr-2" />
                Start New Chat
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Overlay - Only on mobile when chat list is open */}
      {isMobile && showMobileChatList && (
        <div 
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setShowMobileChatList(false)}
        />
      )}
    </div>
  )
}
