"use client"

import { useCallback, useEffect, useState } from 'react'
import { useNotificationContext } from '@/context/NotificationContext'
import { 
  Notification, 
  NotificationPreferences, 
  NotificationFilters,
  NotificationBulkAction,
  RealtimeNotification,
  NotificationSubscription
} from '@/types/notifications'

// Main notifications hook
export function useNotifications() {
  const { state, actions } = useNotificationContext()

  useEffect(() => {
    actions.loadNotifications()
    actions.loadPreferences()
    actions.loadStats()
  }, [])

  return {
    notifications: state.notifications,
    groupedNotifications: state.groupedNotifications,
    unreadCount: state.unreadCount,
    isLoading: state.isLoading,
    error: state.error,
    isConnected: state.isConnected,
    actions
  }
}

// Notification preferences hook
export function useNotificationPreferences() {
  const { state, actions } = useNotificationContext()

  const updatePreference = useCallback(async (
    category: keyof NotificationPreferences,
    updates: Partial<NotificationPreferences[keyof NotificationPreferences]>
  ) => {
    if (!state.preferences) return

    const updatedPreferences = {
      ...state.preferences,
      [category]: {
        ...state.preferences[category],
        ...updates
      }
    }

    await actions.updatePreferences(updatedPreferences)
  }, [state.preferences, actions])

  const toggleDeliveryMethod = useCallback(async (
    method: keyof NotificationPreferences,
    enabled: boolean
  ) => {
    await updatePreference(method, { enabled })
  }, [updatePreference])

  const updateTypes = useCallback(async (
    method: keyof NotificationPreferences,
    types: string[]
  ) => {
    await updatePreference(method, { types })
  }, [updatePreference])

  return {
    preferences: state.preferences,
    updatePreference,
    toggleDeliveryMethod,
    updateTypes,
    isLoading: state.isLoading
  }
}

// Real-time notifications hook
export function useRealtimeNotifications() {
  const [subscriptions, setSubscriptions] = useState<Map<string, NotificationSubscription>>(new Map())

  const subscribe = useCallback((
    userId: string,
    callback: (notification: Notification) => void
  ): NotificationSubscription => {
    // Mock WebSocket connection
    const mockConnection = {
      userId,
      callback,
      unsubscribe: () => {
        setSubscriptions(prev => {
          const newSubs = new Map(prev)
          newSubs.delete(userId)
          return newSubs
        })
      }
    }

    setSubscriptions(prev => new Map(prev).set(userId, mockConnection))

    // Simulate real-time notifications
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance of new notification
        const mockNotification: Notification = {
          id: `realtime-${Date.now()}`,
          type: ['post', 'chat', 'marketplace', 'system'][Math.floor(Math.random() * 4)] as any,
          priority: ['low', 'medium', 'high', 'urgent'][Math.floor(Math.random() * 4)] as any,
          title: 'Real-time notification',
          message: 'This is a simulated real-time notification',
          createdAt: new Date().toISOString(),
          status: 'unread',
          source: {
            id: 'system',
            name: 'System',
            type: 'system'
          }
        }
        callback(mockNotification)
      }
    }, 10000) // Check every 10 seconds

    return {
      userId,
      callback,
      unsubscribe: () => {
        clearInterval(interval)
        mockConnection.unsubscribe()
      }
    }
  }, [])

  const unsubscribe = useCallback((userId: string) => {
    const subscription = subscriptions.get(userId)
    if (subscription) {
      subscription.unsubscribe()
    }
  }, [subscriptions])

  return {
    subscribe,
    unsubscribe,
    isConnected: subscriptions.size > 0
  }
}

// Notification filters hook
export function useNotificationFilters() {
  const { state, actions } = useNotificationContext()

  const applyFilters = useCallback((filters: NotificationFilters) => {
    actions.setFilters(filters)
    actions.loadNotifications(filters)
  }, [actions])

  const clearFilters = useCallback(() => {
    actions.clearFilters()
    actions.loadNotifications()
  }, [actions])

  const filteredNotifications = state.notifications.filter(notification => {
    if (state.filters.type && notification.type !== state.filters.type) return false
    if (state.filters.priority && notification.priority !== state.filters.priority) return false
    if (state.filters.status && notification.status !== state.filters.status) return false
    if (state.filters.search) {
      const searchLower = state.filters.search.toLowerCase()
      return (
        notification.title.toLowerCase().includes(searchLower) ||
        notification.message.toLowerCase().includes(searchLower) ||
        notification.source.name.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  return {
    filters: state.filters,
    filteredNotifications,
    applyFilters,
    clearFilters,
    hasActiveFilters: Object.keys(state.filters).length > 0
  }
}

// Notification actions hook
export function useNotificationActions() {
  const { actions } = useNotificationContext()

  const markAsRead = useCallback(async (notificationIds: string | string[]) => {
    const ids = Array.isArray(notificationIds) ? notificationIds : [notificationIds]
    await actions.markAsRead(ids)
  }, [actions])

  const markAsUnread = useCallback(async (notificationIds: string | string[]) => {
    const ids = Array.isArray(notificationIds) ? notificationIds : [notificationIds]
    await actions.markAsUnread(ids)
  }, [actions])

  const dismiss = useCallback(async (notificationId: string) => {
    await actions.dismissNotification(notificationId)
  }, [actions])

  const deleteNotification = useCallback(async (notificationId: string) => {
    await actions.deleteNotification(notificationId)
  }, [actions])

  const bulkAction = useCallback(async (action: NotificationBulkAction) => {
    await actions.bulkAction(action)
  }, [actions])

  const { state } = useNotificationContext()
  
  const markAllAsRead = useCallback(async () => {
    const unreadIds = state.notifications
      .filter(n => n.status === 'unread')
      .map(n => n.id)
    
    if (unreadIds.length > 0) {
      await actions.bulkAction({
        type: 'mark_read',
        notificationIds: unreadIds
      })
    }
  }, [actions, state.notifications])

  const clearAll = useCallback(async () => {
    const allIds = state.notifications.map(n => n.id)
    
    if (allIds.length > 0) {
      await actions.bulkAction({
        type: 'delete',
        notificationIds: allIds
      })
    }
  }, [actions])

  return {
    markAsRead,
    markAsUnread,
    dismiss,
    deleteNotification,
    bulkAction,
    markAllAsRead,
    clearAll
  }
}

// Toast notifications hook
export function useToastNotifications() {
  const [toasts, setToasts] = useState<Notification[]>([])

  const showToast = useCallback((notification: Notification) => {
    setToasts(prev => [notification, ...prev])
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== notification.id))
    }, 5000)
  }, [])

  const removeToast = useCallback((notificationId: string) => {
    setToasts(prev => prev.filter(t => t.id !== notificationId))
  }, [])

  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  return {
    toasts,
    showToast,
    removeToast,
    clearAllToasts
  }
}

// Notification stats hook
export function useNotificationStats() {
  const { state, actions } = useNotificationContext()

  useEffect(() => {
    actions.loadStats()
  }, [actions])

  return {
    stats: state.stats,
    isLoading: state.isLoading
  }
}
