"use client"

import { useCallback, useEffect, useState } from 'react'
import { useChatContext } from '@/context/ChatContext'
import { 
  Chat, 
  Message, 
  ChatFilters, 
  MessageFilters,
  SendMessageRequest,
  UploadAttachmentRequest,
  ReactionType
} from '@/types/chat'

// Main chat hook
export function useChat() {
  const { state, actions } = useChatContext()

  useEffect(() => {
    actions.loadChats()
  }, [])

  return {
    chats: state.chats,
    activeChat: state.activeChat,
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    isConnected: state.isConnected,
    actions
  }
}

// Chat list hook with filtering
export function useChatList() {
  const { state, actions } = useChatContext()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredChats = state.chats.filter(chat => {
    if (state.filters.search && !chat.name.toLowerCase().includes(state.filters.search.toLowerCase())) {
      return false
    }
    if (state.filters.type && chat.type !== state.filters.type) {
      return false
    }
    if (state.filters.unreadOnly && chat.unreadCount === 0) {
      return false
    }
    if (state.filters.pinnedOnly && !chat.isPinned) {
      return false
    }
    if (state.filters.archivedOnly && !chat.isArchived) {
      return false
    }
    return true
  })

  const pinnedChats = filteredChats.filter(chat => chat.isPinned)
  const regularChats = filteredChats.filter(chat => !chat.isPinned)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    actions.setFilters({ ...state.filters, search: query })
  }

  const handleFilterChange = (filters: Partial<ChatFilters>) => {
    actions.setFilters({ ...state.filters, ...filters })
  }

  const clearFilters = () => {
    setSearchQuery('')
    actions.clearFilters()
  }

  return {
    chats: filteredChats,
    pinnedChats,
    regularChats,
    searchQuery,
    filters: state.filters,
    handleSearch,
    handleFilterChange,
    clearFilters,
    isLoading: state.isLoading
  }
}

// Messages hook
export function useMessages(chatId: string) {
  const { state, actions } = useChatContext()
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const messages = state.messages[chatId] || []
  const hasMore = state.hasMoreMessages[chatId] || false
  const typingUsers = state.typingUsers[chatId] || []

  const loadMessages = useCallback(async (filters?: MessageFilters) => {
    await actions.loadMessages(chatId, filters)
  }, [chatId, actions])

  const loadMoreMessages = useCallback(async () => {
    if (!hasMore || isLoadingMore) return

    setIsLoadingMore(true)
    try {
      const cursor = state.messageCursors[chatId]
      await actions.loadMessages(chatId, { before: cursor, limit: 20 })
    } finally {
      setIsLoadingMore(false)
    }
  }, [chatId, hasMore, isLoadingMore, state.messageCursors, actions])

  const sendMessage = useCallback(async (content: string, type: string = 'text', replyTo?: string) => {
    await actions.sendMessage(chatId, content, type, replyTo)
  }, [chatId, actions])

  const sendFile = useCallback(async (file: File) => {
    // Mock file upload
    console.log('Uploading file:', file.name)
    // In real implementation, upload file and send message with attachment
  }, [])

  const addReaction = useCallback(async (messageId: string, reactionType: ReactionType) => {
    await actions.addReaction(chatId, messageId, reactionType)
  }, [chatId, actions])

  const removeReaction = useCallback(async (messageId: string, reactionId: string) => {
    await actions.removeReaction(chatId, messageId, reactionId)
  }, [chatId, actions])

  const setTyping = useCallback((isTyping: boolean) => {
    actions.setTyping(chatId, isTyping)
  }, [chatId, actions])

  useEffect(() => {
    if (chatId) {
      loadMessages()
    }
  }, [chatId, loadMessages])

  return {
    messages,
    typingUsers,
    hasMore,
    isLoadingMore,
    loadMoreMessages,
    sendMessage,
    sendFile,
    addReaction,
    removeReaction,
    setTyping
  }
}

// Presence hook
export function usePresence() {
  const { state } = useChatContext()
  
  const isUserOnline = useCallback((userId: string) => {
    return state.onlineUsers.has(userId)
  }, [state.onlineUsers])

  const getOnlineUsers = useCallback(() => {
    return Array.from(state.onlineUsers)
  }, [state.onlineUsers])

  return {
    onlineUsers: state.onlineUsers,
    isUserOnline,
    getOnlineUsers
  }
}

// Composer hook
export function useComposer(chatId: string) {
  const [content, setContent] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [replyTo, setReplyTo] = useState<Message | null>(null)
  
  const { sendMessage, setTyping } = useMessages(chatId)

  const handleSend = useCallback(async () => {
    if (!content.trim() && attachments.length === 0) return

    await sendMessage(content, 'text', replyTo?.id)
    
    setContent('')
    setAttachments([])
    setReplyTo(null)
    setIsTyping(false)
    setTyping(false)
  }, [content, attachments, replyTo, sendMessage, setTyping])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  const handleTyping = useCallback((value: string) => {
    setContent(value)
    
    if (value.trim() && !isTyping) {
      setIsTyping(true)
      setTyping(true)
    } else if (!value.trim() && isTyping) {
      setIsTyping(false)
      setTyping(false)
    }
  }, [isTyping, setTyping])

  const addAttachment = useCallback((file: File) => {
    setAttachments(prev => [...prev, file])
  }, [])

  const removeAttachment = useCallback((index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }, [])

  const clearReply = useCallback(() => {
    setReplyTo(null)
  }, [])

  // Cleanup typing indicator on unmount
  useEffect(() => {
    return () => {
      if (isTyping) {
        setTyping(false)
      }
    }
  }, [isTyping, setTyping])

  return {
    content,
    attachments,
    replyTo,
    isTyping,
    setContent: handleTyping,
    addAttachment,
    removeAttachment,
    setReplyTo,
    clearReply,
    handleSend,
    handleKeyPress
  }
}

// WebSocket hook
export function useWebSocket() {
  const { state, actions } = useChatContext()
  const [isConnecting, setIsConnecting] = useState(false)

  const connect = useCallback(async (userId: string) => {
    setIsConnecting(true)
    try {
      actions.connectSocket(userId)
    } finally {
      setIsConnecting(false)
    }
  }, [actions])

  const disconnect = useCallback(() => {
    actions.disconnectSocket()
  }, [actions])

  return {
    isConnected: state.isConnected,
    isConnecting,
    connect,
    disconnect
  }
}

// Chat actions hook
export function useChatActions() {
  const { actions } = useChatContext()

  const pinChat = useCallback(async (chatId: string) => {
    await actions.pinChat(chatId)
  }, [actions])

  const unpinChat = useCallback(async (chatId: string) => {
    await actions.unpinChat(chatId)
  }, [actions])

  const muteChat = useCallback(async (chatId: string) => {
    await actions.muteChat(chatId)
  }, [actions])

  const unmuteChat = useCallback(async (chatId: string) => {
    await actions.unmuteChat(chatId)
  }, [actions])

  const archiveChat = useCallback(async (chatId: string) => {
    await actions.archiveChat(chatId)
  }, [actions])

  const unarchiveChat = useCallback(async (chatId: string) => {
    await actions.unarchiveChat(chatId)
  }, [actions])

  const markAsRead = useCallback(async (chatId: string) => {
    await actions.markAsRead(chatId)
  }, [actions])

  return {
    pinChat,
    unpinChat,
    muteChat,
    unmuteChat,
    archiveChat,
    unarchiveChat,
    markAsRead
  }
}
