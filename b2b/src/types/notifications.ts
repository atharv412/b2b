export type NotificationType = 'post' | 'chat' | 'marketplace' | 'system' | 'connection' | 'message'

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'

export type DeliveryMethod = 'in_app' | 'email' | 'whatsapp' | 'push'

export type NotificationStatus = 'unread' | 'read' | 'dismissed'

export interface Notification {
  id: string
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  avatar?: string
  image?: string
  createdAt: string
  readAt?: string
  dismissedAt?: string
  status: NotificationStatus
  source: {
    id: string
    name: string
    type: 'user' | 'system' | 'company'
  }
  action?: {
    type: 'navigate' | 'open_modal' | 'external_link'
    url?: string
    modalId?: string
    params?: Record<string, any>
  }
  metadata?: {
    postId?: string
    chatId?: string
    productId?: string
    userId?: string
    [key: string]: any
  }
}

export interface NotificationGroup {
  type: NotificationType
  count: number
  unreadCount: number
  latestNotification: Notification
  notifications: Notification[]
}

export interface NotificationPreferences {
  userId: string
  email: {
    enabled: boolean
    types: NotificationType[]
    frequency: 'immediate' | 'hourly' | 'daily' | 'weekly'
    quietHours: {
      enabled: boolean
      start: string // HH:MM format
      end: string // HH:MM format
      timezone: string
    }
  }
  whatsapp: {
    enabled: boolean
    types: NotificationType[]
    frequency: 'immediate' | 'hourly' | 'daily'
  }
  push: {
    enabled: boolean
    types: NotificationType[]
    priority: NotificationPriority[]
  }
  inApp: {
    enabled: boolean
    types: NotificationType[]
    showBanner: boolean
    sound: boolean
  }
}

export interface NotificationStats {
  total: number
  unread: number
  byType: Record<NotificationType, number>
  byPriority: Record<NotificationPriority, number>
  recentActivity: {
    lastNotification: string
    averagePerDay: number
    peakHour: number
  }
}

export interface NotificationFilters {
  type?: NotificationType
  priority?: NotificationPriority
  status?: NotificationStatus
  dateRange?: {
    start: string
    end: string
  }
  search?: string
}

export interface NotificationBulkAction {
  type: 'mark_read' | 'mark_unread' | 'dismiss' | 'delete'
  notificationIds: string[]
}

// API Response Types
export interface NotificationsResponse {
  notifications: Notification[]
  total: number
  hasMore: boolean
  nextCursor?: string
}

export interface NotificationPreferencesResponse {
  preferences: NotificationPreferences
  updated: boolean
}

export interface MarkReadResponse {
  success: boolean
  updatedCount: number
}

export interface NotificationSubscription {
  userId: string
  callback: (notification: Notification) => void
  unsubscribe: () => void
}

// Real-time notification payload
export interface RealtimeNotification {
  type: 'new' | 'update' | 'delete'
  notification: Notification
  userId: string
  timestamp: string
}

// Toast notification for high-priority alerts
export interface ToastNotification {
  id: string
  notification: Notification
  action?: {
    label: string
    onClick: () => void
  }
  autoClose?: boolean
  duration?: number
}
