"use client"

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react'
import { 
  Chat, 
  Message, 
  User, 
  TypingUser, 
  ChatFilters, 
  MessageFilters,
  ChatEvent,
  MessageEvent,
  TypingEvent,
  PresenceEvent,
  ReactionEvent,
  StatusUpdateEvent
} from '@/types/chat'

interface ChatState {
  chats: Chat[]
  activeChat: Chat | null
  messages: Record<string, Message[]>
  typingUsers: Record<string, TypingUser[]>
  onlineUsers: Set<string>
  isLoading: boolean
  error: string | null
  isConnected: boolean
  filters: ChatFilters
  hasMoreMessages: Record<string, boolean>
  messageCursors: Record<string, string | null>
}

type ChatAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CONNECTION_STATUS'; payload: boolean }
  | { type: 'SET_CHATS'; payload: Chat[] }
  | { type: 'ADD_CHAT'; payload: Chat }
  | { type: 'UPDATE_CHAT'; payload: { id: string; updates: Partial<Chat> } }
  | { type: 'SET_ACTIVE_CHAT'; payload: Chat | null }
  | { type: 'SET_MESSAGES'; payload: { chatId: string; messages: Message[] } }
  | { type: 'ADD_MESSAGE'; payload: { chatId: string; message: Message } }
  | { type: 'UPDATE_MESSAGE'; payload: { chatId: string; messageId: string; updates: Partial<Message> } }
  | { type: 'SET_TYPING_USERS'; payload: { chatId: string; users: TypingUser[] } }
  | { type: 'ADD_TYPING_USER'; payload: { chatId: string; user: TypingUser } }
  | { type: 'REMOVE_TYPING_USER'; payload: { chatId: string; userId: string } }
  | { type: 'SET_ONLINE_USERS'; payload: Set<string> }
  | { type: 'SET_FILTERS'; payload: ChatFilters }
  | { type: 'SET_HAS_MORE_MESSAGES'; payload: { chatId: string; hasMore: boolean } }
  | { type: 'SET_MESSAGE_CURSOR'; payload: { chatId: string; cursor: string | null } }

const initialState: ChatState = {
  chats: [],
  activeChat: null,
  messages: {},
  typingUsers: {},
  onlineUsers: new Set(),
  isLoading: false,
  error: null,
  isConnected: false,
  filters: {},
  hasMoreMessages: {},
  messageCursors: {}
}

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'SET_CONNECTION_STATUS':
      return { ...state, isConnected: action.payload }
    
    case 'SET_CHATS':
      return { ...state, chats: action.payload }
    
    case 'ADD_CHAT':
      return { ...state, chats: [...state.chats, action.payload] }
    
    case 'UPDATE_CHAT':
      return {
        ...state,
        chats: state.chats.map(chat =>
          chat.id === action.payload.id
            ? { ...chat, ...action.payload.updates }
            : chat
        )
      }
    
    case 'SET_ACTIVE_CHAT':
      return { ...state, activeChat: action.payload }
    
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.chatId]: action.payload.messages
        }
      }
    
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.chatId]: [
            ...(state.messages[action.payload.chatId] || []),
            action.payload.message
          ]
        }
      }
    
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.chatId]: (state.messages[action.payload.chatId] || []).map(msg =>
            msg.id === action.payload.messageId
              ? { ...msg, ...action.payload.updates }
              : msg
          )
        }
      }
    
    case 'SET_TYPING_USERS':
      return {
        ...state,
        typingUsers: {
          ...state.typingUsers,
          [action.payload.chatId]: action.payload.users
        }
      }
    
    case 'ADD_TYPING_USER':
      return {
        ...state,
        typingUsers: {
          ...state.typingUsers,
          [action.payload.chatId]: [
            ...(state.typingUsers[action.payload.chatId] || []).filter(u => u.id !== action.payload.user.id),
            action.payload.user
          ]
        }
      }
    
    case 'REMOVE_TYPING_USER':
      return {
        ...state,
        typingUsers: {
          ...state.typingUsers,
          [action.payload.chatId]: (state.typingUsers[action.payload.chatId] || []).filter(
            u => u.id !== action.payload.userId
          )
        }
      }
    
    case 'SET_ONLINE_USERS':
      return { ...state, onlineUsers: action.payload }
    
    case 'SET_FILTERS':
      return { ...state, filters: action.payload }
    
    case 'SET_HAS_MORE_MESSAGES':
      return {
        ...state,
        hasMoreMessages: {
          ...state.hasMoreMessages,
          [action.payload.chatId]: action.payload.hasMore
        }
      }
    
    case 'SET_MESSAGE_CURSOR':
      return {
        ...state,
        messageCursors: {
          ...state.messageCursors,
          [action.payload.chatId]: action.payload.cursor
        }
      }
    
    default:
      return state
  }
}

interface ChatContextType {
  state: ChatState
  actions: {
    loadChats: (filters?: ChatFilters) => Promise<void>
    loadMessages: (chatId: string, cursor?: string) => Promise<void>
    sendMessage: (chatId: string, content: string, type?: string, attachments?: any[]) => Promise<void>
    updateMessage: (chatId: string, messageId: string, updates: Partial<Message>) => Promise<void>
    setActiveChat: (chat: Chat | null) => void
    markAsRead: (chatId: string) => Promise<void>
    setTyping: (chatId: string, isTyping: boolean) => void
    addReaction: (chatId: string, messageId: string, reaction: string) => Promise<void>
    removeReaction: (chatId: string, messageId: string, reaction: string) => Promise<void>
    pinChat: (chatId: string) => Promise<void>
    unpinChat: (chatId: string) => Promise<void>
    muteChat: (chatId: string) => Promise<void>
    unmuteChat: (chatId: string) => Promise<void>
    archiveChat: (chatId: string) => Promise<void>
    unarchiveChat: (chatId: string) => Promise<void>
    setFilters: (filters: ChatFilters) => void
    clearFilters: () => void
    connectSocket: (userId: string) => void
    disconnectSocket: () => void
  }
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState)

  // Mock WebSocket connection
  const connectSocket = useCallback((userId: string) => {
    console.log('Connecting to WebSocket for user:', userId)
    dispatch({ type: 'SET_CONNECTION_STATUS', payload: true })
    
    // Simulate connection delay
    setTimeout(() => {
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: true })
    }, 1000)
  }, [])

  const disconnectSocket = useCallback(() => {
    console.log('Disconnecting from WebSocket')
    dispatch({ type: 'SET_CONNECTION_STATUS', payload: false })
  }, [])

  // Load chats
  const loadChats = useCallback(async (filters: ChatFilters = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      // Mock API call
      const mockChats: Chat[] = [
        {
          id: '1',
          name: 'John Doe',
          type: 'direct',
          participants: [
            { id: 'user1', name: 'John Doe', email: 'john@example.com', avatar: '/avatars/john.jpg', role: 'professional', sellerEnabled: true, verified: true },
            { id: 'current-user', name: 'You', email: 'you@example.com', avatar: '/avatars/you.jpg', role: 'professional', sellerEnabled: true, verified: true }
          ],
          lastMessage: {
            id: 'msg1',
            content: 'Hey, how are you doing?',
            senderId: 'user1',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            type: 'text',
            status: 'delivered'
          },
          unreadCount: 2,
          isPinned: false,
          isMuted: false,
          isArchived: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
        },
        {
          id: '2',
          name: 'Design Team',
          type: 'group',
          participants: [
            { id: 'user2', name: 'Sarah Wilson', email: 'sarah@example.com', avatar: '/avatars/sarah.jpg', role: 'professional', sellerEnabled: false, verified: true },
            { id: 'user3', name: 'Mike Johnson', email: 'mike@example.com', avatar: '/avatars/mike.jpg', role: 'professional', sellerEnabled: true, verified: false },
            { id: 'current-user', name: 'You', email: 'you@example.com', avatar: '/avatars/you.jpg', role: 'professional', sellerEnabled: true, verified: true }
          ],
          lastMessage: {
            id: 'msg2',
            content: 'The new design looks great!',
            senderId: 'user2',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            type: 'text',
            status: 'read'
          },
          unreadCount: 0,
          isPinned: true,
          isMuted: false,
          isArchived: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
        }
      ]
      
      dispatch({ type: 'SET_CHATS', payload: mockChats })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load chats' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  // Load messages for a chat
  const loadMessages = useCallback(async (chatId: string, cursor?: string) => {
    try {
      // Mock API call
      const mockMessages: Message[] = [
        {
          id: 'msg1',
          content: 'Hey, how are you doing?',
          senderId: 'user1',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          type: 'text',
          status: 'delivered',
          reactions: [],
          attachments: []
        },
        {
          id: 'msg2',
          content: 'I\'m doing great! Thanks for asking.',
          senderId: 'current-user',
          timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
          type: 'text',
          status: 'read',
          reactions: [],
          attachments: []
        }
      ]
      
      dispatch({ type: 'SET_MESSAGES', payload: { chatId, messages: mockMessages } })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load messages' })
    }
  }, [])

  // Send message
  const sendMessage = useCallback(async (chatId: string, content: string, type: string = 'text', attachments: any[] = []) => {
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      content,
      senderId: 'current-user',
      timestamp: new Date().toISOString(),
      type: type as any,
      status: 'sending',
      reactions: [],
      attachments
    }

    // Optimistically add message
    dispatch({ type: 'ADD_MESSAGE', payload: { chatId, message: newMessage } })

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update message status
      dispatch({ type: 'UPDATE_MESSAGE', payload: { chatId, messageId: newMessage.id, updates: { status: 'delivered' } } })
    } catch (error) {
      dispatch({ type: 'UPDATE_MESSAGE', payload: { chatId, messageId: newMessage.id, updates: { status: 'failed' } } })
    }
  }, [])

  // Update message
  const updateMessage = useCallback(async (chatId: string, messageId: string, updates: Partial<Message>) => {
    dispatch({ type: 'UPDATE_MESSAGE', payload: { chatId, messageId, updates } })
  }, [])

  // Set active chat
  const setActiveChat = useCallback((chat: Chat | null) => {
    dispatch({ type: 'SET_ACTIVE_CHAT', payload: chat })
  }, [])

  // Mark as read
  const markAsRead = useCallback(async (chatId: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update chat unread count
      dispatch({ type: 'UPDATE_CHAT', payload: { id: chatId, updates: { unreadCount: 0 } } })
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }, [])

  // Set typing status
  const setTyping = useCallback((chatId: string, isTyping: boolean) => {
    if (isTyping) {
      const typingUser: TypingUser = {
        id: 'current-user',
        name: 'You',
        timestamp: Date.now()
      }
      dispatch({ type: 'ADD_TYPING_USER', payload: { chatId, user: typingUser } })
      
      // Remove typing status after 3 seconds
      setTimeout(() => {
        dispatch({ type: 'REMOVE_TYPING_USER', payload: { chatId, userId: 'current-user' } })
      }, 3000)
    } else {
      dispatch({ type: 'REMOVE_TYPING_USER', payload: { chatId, userId: 'current-user' } })
    }
  }, [])

  // Add reaction
  const addReaction = useCallback(async (chatId: string, messageId: string, reaction: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update message with reaction
      const message = state.messages[chatId]?.find(msg => msg.id === messageId)
      if (message) {
        const existingReaction = message.reactions.find(r => r.emoji === reaction && r.userId === 'current-user')
        if (existingReaction) {
          // Remove reaction
          const updatedReactions = message.reactions.filter(r => r !== existingReaction)
          dispatch({ type: 'UPDATE_MESSAGE', payload: { chatId, messageId, updates: { reactions: updatedReactions } } })
        } else {
          // Add reaction
          const newReaction = { emoji: reaction, userId: 'current-user', timestamp: new Date().toISOString() }
          dispatch({ type: 'UPDATE_MESSAGE', payload: { chatId, messageId, updates: { reactions: [...message.reactions, newReaction] } } })
        }
      }
    } catch (error) {
      console.error('Failed to add reaction:', error)
    }
  }, [state.messages])

  // Remove reaction
  const removeReaction = useCallback(async (chatId: string, messageId: string, reaction: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update message to remove reaction
      const message = state.messages[chatId]?.find(msg => msg.id === messageId)
      if (message) {
        const updatedReactions = message.reactions.filter(r => !(r.emoji === reaction && r.userId === 'current-user'))
        dispatch({ type: 'UPDATE_MESSAGE', payload: { chatId, messageId, updates: { reactions: updatedReactions } } })
      }
    } catch (error) {
      console.error('Failed to remove reaction:', error)
    }
  }, [state.messages])

  // Pin chat
  const pinChat = useCallback(async (chatId: string) => {
    dispatch({ type: 'UPDATE_CHAT', payload: { id: chatId, updates: { isPinned: true } } })
  }, [])

  const unpinChat = useCallback(async (chatId: string) => {
    dispatch({ type: 'UPDATE_CHAT', payload: { id: chatId, updates: { isPinned: false } } })
  }, [])

  const muteChat = useCallback(async (chatId: string) => {
    dispatch({ type: 'UPDATE_CHAT', payload: { id: chatId, updates: { isMuted: true } } })
  }, [])

  const unmuteChat = useCallback(async (chatId: string) => {
    dispatch({ type: 'UPDATE_CHAT', payload: { id: chatId, updates: { isMuted: false } } })
  }, [])

  const archiveChat = useCallback(async (chatId: string) => {
    dispatch({ type: 'UPDATE_CHAT', payload: { id: chatId, updates: { isArchived: true } } })
  }, [])

  const unarchiveChat = useCallback(async (chatId: string) => {
    dispatch({ type: 'UPDATE_CHAT', payload: { id: chatId, updates: { isArchived: false } } })
  }, [])

  const setFilters = useCallback((filters: ChatFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters })
  }, [])

  const clearFilters = useCallback(() => {
    dispatch({ type: 'SET_FILTERS', payload: {} })
  }, [])

  // Memoize actions to prevent infinite re-renders
  const actions = useMemo(() => ({
    loadChats,
    loadMessages,
    sendMessage,
    updateMessage,
    setActiveChat,
    markAsRead,
    setTyping,
    addReaction,
    removeReaction,
    pinChat,
    unpinChat,
    muteChat,
    unmuteChat,
    archiveChat,
    unarchiveChat,
    setFilters,
    clearFilters,
    connectSocket,
    disconnectSocket
  }), [
    loadChats,
    loadMessages,
    sendMessage,
    updateMessage,
    setActiveChat,
    markAsRead,
    setTyping,
    addReaction,
    removeReaction,
    pinChat,
    unpinChat,
    muteChat,
    unmuteChat,
    setFilters,
    clearFilters,
    connectSocket,
    disconnectSocket
  ])

  const value: ChatContextType = {
    state,
    actions
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}
