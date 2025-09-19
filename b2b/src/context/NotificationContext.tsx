"use client"

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { 
  Notification, 
  NotificationGroup, 
  NotificationPreferences, 
  NotificationStats,
  NotificationFilters,
  NotificationBulkAction,
  RealtimeNotification
} from '@/types/notifications'

interface NotificationState {
  notifications: Notification[]
  groupedNotifications: NotificationGroup[]
  preferences: NotificationPreferences | null
  stats: NotificationStats | null
  filters: NotificationFilters
  isLoading: boolean
  error: string | null
  isConnected: boolean
  unreadCount: number
}

type NotificationAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'UPDATE_NOTIFICATION'; payload: { id: string; updates: Partial<Notification> } }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'MARK_READ'; payload: string[] }
  | { type: 'MARK_UNREAD'; payload: string[] }
  | { type: 'DISMISS_NOTIFICATION'; payload: string }
  | { type: 'SET_PREFERENCES'; payload: NotificationPreferences }
  | { type: 'SET_STATS'; payload: NotificationStats }
  | { type: 'SET_FILTERS'; payload: NotificationFilters }
  | { type: 'SET_CONNECTION_STATUS'; payload: boolean }
  | { type: 'BULK_ACTION'; payload: NotificationBulkAction }

const initialState: NotificationState = {
  notifications: [],
  groupedNotifications: [],
  preferences: null,
  stats: null,
  filters: {},
  isLoading: false,
  error: null,
  isConnected: false,
  unreadCount: 0
}

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    
    case 'SET_NOTIFICATIONS':
      const notifications = action.payload
      const unreadCount = notifications.filter(n => n.status === 'unread').length
      return {
        ...state,
        notifications,
        unreadCount,
        isLoading: false,
        error: null
      }
    
    case 'ADD_NOTIFICATION':
      const newNotification = action.payload
      const updatedNotifications = [newNotification, ...state.notifications]
      const newUnreadCount = state.unreadCount + (newNotification.status === 'unread' ? 1 : 0)
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: newUnreadCount
      }
    
    case 'UPDATE_NOTIFICATION':
      const { id, updates } = action.payload
      const modifiedNotifications = state.notifications.map(n =>
        n.id === id ? { ...n, ...updates } : n
      )
      const modifiedUnreadCount = modifiedNotifications.filter(n => n.status === 'unread').length
      return {
        ...state,
        notifications: modifiedNotifications,
        unreadCount: modifiedUnreadCount
      }
    
    case 'REMOVE_NOTIFICATION':
      const filteredNotifications = state.notifications.filter(n => n.id !== action.payload)
      const filteredUnreadCount = filteredNotifications.filter(n => n.status === 'unread').length
      return {
        ...state,
        notifications: filteredNotifications,
        unreadCount: filteredUnreadCount
      }
    
    case 'MARK_READ':
      const readNotifications = state.notifications.map(n =>
        action.payload.includes(n.id) ? { ...n, status: 'read' as const, readAt: new Date().toISOString() } : n
      )
      const readUnreadCount = readNotifications.filter(n => n.status === 'unread').length
      return {
        ...state,
        notifications: readNotifications,
        unreadCount: readUnreadCount
      }
    
    case 'MARK_UNREAD':
      const unreadNotifications = state.notifications.map(n =>
        action.payload.includes(n.id) ? { ...n, status: 'unread' as const, readAt: undefined } : n
      )
      const unreadUnreadCount = unreadNotifications.filter(n => n.status === 'unread').length
      return {
        ...state,
        notifications: unreadNotifications,
        unreadCount: unreadUnreadCount
      }
    
    case 'DISMISS_NOTIFICATION':
      const dismissedNotifications = state.notifications.map(n =>
        n.id === action.payload ? { ...n, status: 'dismissed' as const, dismissedAt: new Date().toISOString() } : n
      )
      const dismissedUnreadCount = dismissedNotifications.filter(n => n.status === 'unread').length
      return {
        ...state,
        notifications: dismissedNotifications,
        unreadCount: dismissedUnreadCount
      }
    
    case 'SET_PREFERENCES':
      return { ...state, preferences: action.payload }
    
    case 'SET_STATS':
      return { ...state, stats: action.payload }
    
    case 'SET_FILTERS':
      return { ...state, filters: action.payload }
    
    case 'SET_CONNECTION_STATUS':
      return { ...state, isConnected: action.payload }
    
    case 'BULK_ACTION':
      const { type: actionType, notificationIds } = action.payload
      let bulkModifiedNotifications = [...state.notifications]
      
      switch (actionType) {
        case 'mark_read':
          bulkModifiedNotifications = bulkModifiedNotifications.map(n =>
            notificationIds.includes(n.id) ? { ...n, status: 'read' as const, readAt: new Date().toISOString() } : n
          )
          break
        case 'mark_unread':
          bulkModifiedNotifications = bulkModifiedNotifications.map(n =>
            notificationIds.includes(n.id) ? { ...n, status: 'unread' as const, readAt: undefined } : n
          )
          break
        case 'dismiss':
          bulkModifiedNotifications = bulkModifiedNotifications.map(n =>
            notificationIds.includes(n.id) ? { ...n, status: 'dismissed' as const, dismissedAt: new Date().toISOString() } : n
          )
          break
        case 'delete':
          bulkModifiedNotifications = bulkModifiedNotifications.filter(n => !notificationIds.includes(n.id))
          break
      }
      
      const bulkUnreadCount = bulkModifiedNotifications.filter(n => n.status === 'unread').length
      return {
        ...state,
        notifications: bulkModifiedNotifications,
        unreadCount: bulkUnreadCount
      }
    
    default:
      return state
  }
}

interface NotificationContextType {
  state: NotificationState
  actions: {
    loadNotifications: (filters?: NotificationFilters) => Promise<void>
    markAsRead: (notificationIds: string[]) => Promise<void>
    markAsUnread: (notificationIds: string[]) => Promise<void>
    dismissNotification: (notificationId: string) => Promise<void>
    deleteNotification: (notificationId: string) => Promise<void>
    bulkAction: (action: NotificationBulkAction) => Promise<void>
    updatePreferences: (preferences: Partial<NotificationPreferences>) => Promise<void>
    loadPreferences: () => Promise<void>
    loadStats: () => Promise<void>
    setFilters: (filters: NotificationFilters) => void
    clearFilters: () => void
    refreshNotifications: () => Promise<void>
  }
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState)

  // Group notifications by type
  const groupNotifications = useCallback((notifications: Notification[]): NotificationGroup[] => {
    const groups: Record<NotificationType, Notification[]> = {
      post: [],
      chat: [],
      marketplace: [],
      system: [],
      connection: [],
      message: []
    }

    notifications.forEach(notification => {
      groups[notification.type].push(notification)
    })

    return Object.entries(groups)
      .filter(([_, notifications]) => notifications.length > 0)
      .map(([type, notifications]) => ({
        type: type as NotificationType,
        count: notifications.length,
        unreadCount: notifications.filter(n => n.status === 'unread').length,
        latestNotification: notifications[0],
        notifications: notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      }))
  }, [])

  // Update grouped notifications when notifications change
  useEffect(() => {
    const grouped = groupNotifications(state.notifications)
    dispatch({ type: 'SET_NOTIFICATIONS', payload: state.notifications })
  }, [state.notifications, groupNotifications])

  // API stubs
  const loadNotifications = async (filters: NotificationFilters = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'post',
          priority: 'medium',
          title: 'New comment on your post',
          message: 'John Doe commented on "Building Better APIs"',
          avatar: '/avatars/john.jpg',
          createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          status: 'unread',
          source: { id: 'user1', name: 'John Doe', type: 'user' },
          action: { type: 'navigate', url: '/posts/123' },
          metadata: { postId: '123', userId: 'user1' }
        },
        {
          id: '2',
          type: 'chat',
          priority: 'high',
          title: 'New message in Design Team',
          message: 'Sarah: "Can we review the new mockups?"',
          avatar: '/avatars/sarah.jpg',
          createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          status: 'unread',
          source: { id: 'user2', name: 'Sarah Wilson', type: 'user' },
          action: { type: 'navigate', url: '/chat/design-team' },
          metadata: { chatId: 'design-team', userId: 'user2' }
        },
        {
          id: '3',
          type: 'marketplace',
          priority: 'low',
          title: 'New product listing',
          message: 'Check out the new "Project Management Tool" in marketplace',
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          status: 'read',
          source: { id: 'system', name: 'Marketplace', type: 'system' },
          action: { type: 'navigate', url: '/marketplace/products/456' },
          metadata: { productId: '456' }
        },
        {
          id: '4',
          type: 'connection',
          priority: 'medium',
          title: 'New connection request',
          message: 'Mike Johnson wants to connect with you',
          avatar: '/avatars/mike.jpg',
          createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          status: 'unread',
          source: { id: 'user3', name: 'Mike Johnson', type: 'user' },
          action: { type: 'navigate', url: '/connections/requests' },
          metadata: { userId: 'user3' }
        },
        {
          id: '5',
          type: 'system',
          priority: 'urgent',
          title: 'System Maintenance',
          message: 'Scheduled maintenance will begin in 30 minutes',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          status: 'read',
          source: { id: 'system', name: 'System', type: 'system' },
          action: { type: 'open_modal', modalId: 'maintenance-notice' }
        }
      ]

      dispatch({ type: 'SET_NOTIFICATIONS', payload: mockNotifications })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load notifications' })
    }
  }

  const markAsRead = async (notificationIds: string[]) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      dispatch({ type: 'MARK_READ', payload: notificationIds })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to mark notifications as read' })
    }
  }

  const markAsUnread = async (notificationIds: string[]) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      dispatch({ type: 'MARK_UNREAD', payload: notificationIds })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to mark notifications as unread' })
    }
  }

  const dismissNotification = async (notificationId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      dispatch({ type: 'DISMISS_NOTIFICATION', payload: notificationId })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to dismiss notification' })
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: notificationId })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete notification' })
    }
  }

  const bulkAction = async (action: NotificationBulkAction) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      dispatch({ type: 'BULK_ACTION', payload: action })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to perform bulk action' })
    }
  }

  const updatePreferences = async (preferences: Partial<NotificationPreferences>) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      // Mock API call
      dispatch({ type: 'SET_PREFERENCES', payload: preferences as NotificationPreferences })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update preferences' })
    }
  }

  const loadPreferences = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      // Mock preferences
      const mockPreferences: NotificationPreferences = {
        userId: 'current-user',
        email: {
          enabled: true,
          types: ['post', 'chat', 'connection'],
          frequency: 'immediate',
          quietHours: {
            enabled: true,
            start: '22:00',
            end: '08:00',
            timezone: 'UTC'
          }
        },
        whatsapp: {
          enabled: false,
          types: ['urgent'],
          frequency: 'immediate'
        },
        push: {
          enabled: true,
          types: ['post', 'chat', 'connection'],
          priority: ['high', 'urgent']
        },
        inApp: {
          enabled: true,
          types: ['post', 'chat', 'marketplace', 'connection', 'message', 'system'],
          showBanner: true,
          sound: true
        }
      }
      dispatch({ type: 'SET_PREFERENCES', payload: mockPreferences })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load preferences' })
    }
  }

  const loadStats = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      // Mock stats
      const mockStats: NotificationStats = {
        total: state.notifications.length,
        unread: state.unreadCount,
        byType: {
          post: state.notifications.filter(n => n.type === 'post').length,
          chat: state.notifications.filter(n => n.type === 'chat').length,
          marketplace: state.notifications.filter(n => n.type === 'marketplace').length,
          system: state.notifications.filter(n => n.type === 'system').length,
          connection: state.notifications.filter(n => n.type === 'connection').length,
          message: state.notifications.filter(n => n.type === 'message').length
        },
        byPriority: {
          low: state.notifications.filter(n => n.priority === 'low').length,
          medium: state.notifications.filter(n => n.priority === 'medium').length,
          high: state.notifications.filter(n => n.priority === 'high').length,
          urgent: state.notifications.filter(n => n.priority === 'urgent').length
        },
        recentActivity: {
          lastNotification: state.notifications[0]?.createdAt || '',
          averagePerDay: 12,
          peakHour: 14
        }
      }
      dispatch({ type: 'SET_STATS', payload: mockStats })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load stats' })
    }
  }

  const setFilters = (filters: NotificationFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters })
  }

  const clearFilters = () => {
    dispatch({ type: 'SET_FILTERS', payload: {} })
  }

  const refreshNotifications = async () => {
    await loadNotifications(state.filters)
  }

  const value: NotificationContextType = {
    state,
    actions: {
      loadNotifications,
      markAsRead,
      markAsUnread,
      dismissNotification,
      deleteNotification,
      bulkAction,
      updatePreferences,
      loadPreferences,
      loadStats,
      setFilters,
      clearFilters,
      refreshNotifications
    }
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotificationContext() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider')
  }
  return context
}
