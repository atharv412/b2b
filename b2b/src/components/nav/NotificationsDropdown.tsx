"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Check, X, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { useNav } from '@/context/NavContext'
import { cn } from '@/lib/utils'

const fadeScale = {
  hidden: { opacity: 0, scale: 0.95 },
  enter: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } }
}

interface Notification {
  id: string
  title: string
  message: string
  type: 'mention' | 'quotation' | 'system' | 'connection'
  timestamp: string
  read: boolean
  avatar?: string
}

interface NotificationsDropdownProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function NotificationsDropdown({ isOpen, onClose, className }: NotificationsDropdownProps) {
  const { unreadCounts, updateUnreadCounts } = useNav()

  // Mock notifications data
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'New Connection Request',
      message: 'John Smith wants to connect with you',
      type: 'connection',
      timestamp: '2 minutes ago',
      read: false,
      avatar: '/avatars/john.jpg'
    },
    {
      id: '2',
      title: 'Product Quotation',
      message: 'You received a quotation for "Industrial Pumps"',
      type: 'quotation',
      timestamp: '1 hour ago',
      read: false
    },
    {
      id: '3',
      title: 'Mentioned in Post',
      message: 'Sarah mentioned you in a post about project updates',
      type: 'mention',
      timestamp: '3 hours ago',
      read: true,
      avatar: '/avatars/sarah.jpg'
    },
    {
      id: '4',
      title: 'System Update',
      message: 'New features available in your dashboard',
      type: 'system',
      timestamp: '1 day ago',
      read: true
    }
  ]

  const unreadNotifications = notifications.filter(n => !n.read)
  const readNotifications = notifications.filter(n => n.read)

  const handleMarkAsRead = (notificationId: string) => {
    // Update notification as read
    console.log('Mark as read:', notificationId)
    // Update unread count
    updateUnreadCounts({ 
      notifications: Math.max(0, unreadCounts.notifications - 1) 
    })
  }

  const handleMarkAllAsRead = () => {
    // Mark all notifications as read
    console.log('Mark all as read')
    updateUnreadCounts({ notifications: 0 })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'mention':
        return '💬'
      case 'quotation':
        return '💰'
      case 'connection':
        return '👥'
      case 'system':
        return '⚙️'
      default:
        return '🔔'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'mention':
        return 'text-blue-600'
      case 'quotation':
        return 'text-green-600'
      case 'connection':
        return 'text-purple-600'
      case 'system':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={onClose}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCounts.notifications > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1"
            >
              <Badge 
                variant="destructive" 
                className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {unreadCounts.notifications > 99 ? '99+' : unreadCounts.notifications}
              </Badge>
            </motion.div>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-80 p-0" 
        align="end"
        sideOffset={8}
      >
        <motion.div
          variants={fadeScale}
          initial="hidden"
          animate="enter"
          exit="hidden"
        >
          <div className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadNotifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="text-xs h-6 px-2"
                  >
                    Mark all read
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <DropdownMenuSeparator />

          <ScrollArea className="h-96">
            <div className="p-2">
              {/* Unread Notifications */}
              {unreadNotifications.length > 0 && (
                <div className="space-y-2 mb-4">
                  <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-2">
                    Unread ({unreadNotifications.length})
                  </DropdownMenuLabel>
                  {unreadNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-lg">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.timestamp}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMarkAsRead(notification.id)
                              }}
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Read Notifications */}
              {readNotifications.length > 0 && (
                <div className="space-y-2">
                  <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-2">
                    Earlier
                  </DropdownMenuLabel>
                  {readNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-lg opacity-60">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.timestamp}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {notifications.length === 0 && (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-sm text-gray-500">No notifications yet</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
