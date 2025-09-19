"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  Heart, 
  ShoppingCart, 
  Users, 
  Settings, 
  Bell,
  ExternalLink,
  X,
  MoreHorizontal,
  Check,
  Eye,
  EyeOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Notification } from '@/types/notifications'
import { useNotificationActions } from '@/hooks/useNotifications'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

interface NotificationItemProps {
  notification: Notification
  onAction?: (notification: Notification) => void
  onDismiss?: (notificationId: string) => void
  showActions?: boolean
  compact?: boolean
  className?: string
}

const notificationIcons = {
  post: MessageCircle,
  chat: MessageCircle,
  marketplace: ShoppingCart,
  system: Settings,
  connection: Users,
  message: Bell
}

const priorityColors = {
  low: 'text-muted-foreground',
  medium: 'text-blue-600',
  high: 'text-orange-600',
  urgent: 'text-red-600'
}

export function NotificationItem({
  notification,
  onAction,
  onDismiss,
  showActions = true,
  compact = false,
  className
}: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { markAsRead, markAsUnread, dismiss, deleteNotification } = useNotificationActions()

  const Icon = notificationIcons[notification.type]
  const isUnread = notification.status === 'unread'
  const priorityColor = priorityColors[notification.priority]

  const handleClick = () => {
    if (isUnread) {
      markAsRead(notification.id)
    }
    onAction?.(notification)
  }

  const handleMarkAsRead = () => {
    if (isUnread) {
      markAsRead(notification.id)
    } else {
      markAsUnread(notification.id)
    }
  }

  const handleDismiss = () => {
    dismiss(notification.id)
    onDismiss?.(notification.id)
  }

  const handleDelete = () => {
    deleteNotification(notification.id)
  }

  const handleAction = () => {
    if (notification.action) {
      switch (notification.action.type) {
        case 'navigate':
          if (notification.action.url) {
            window.location.href = notification.action.url
          }
          break
        case 'open_modal':
          // Handle modal opening
          console.log('Open modal:', notification.action.modalId)
          break
        case 'external_link':
          if (notification.action.url) {
            window.open(notification.action.url, '_blank')
          }
          break
      }
    }
    handleClick()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn(
        "group relative p-4 hover:bg-muted/50 transition-colors cursor-pointer",
        isUnread && "bg-blue-50/50 border-l-4 border-l-blue-500",
        compact && "p-3",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleAction}
    >
      <div className="flex items-start gap-3">
        {/* Avatar/Icon */}
        <div className="flex-shrink-0">
          {notification.avatar ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={notification.avatar} />
              <AvatarFallback>
                {notification.source.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center",
              isUnread ? "bg-blue-100" : "bg-muted"
            )}>
              <Icon className={cn("h-4 w-4", isUnread ? "text-blue-600" : "text-muted-foreground")} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className={cn(
                "font-medium text-sm leading-tight",
                isUnread && "font-semibold"
              )}>
                {notification.title}
              </h4>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {notification.message}
              </p>
              
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </span>
                <Badge 
                  variant="outline" 
                  className={cn("text-xs", priorityColor)}
                >
                  {notification.priority}
                </Badge>
                {notification.type && (
                  <Badge variant="secondary" className="text-xs">
                    {notification.type}
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex items-center gap-1 ml-2">
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMarkAsRead()
                        }}
                        className="h-6 w-6 p-0"
                      >
                        {isUnread ? (
                          <Eye className="h-3 w-3" />
                        ) : (
                          <EyeOff className="h-3 w-3" />
                        )}
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                            className="h-6 w-6 p-0"
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            handleMarkAsRead()
                          }}>
                            {isUnread ? (
                              <>
                                <Eye className="h-4 w-4 mr-2" />
                                Mark as read
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-4 w-4 mr-2" />
                                Mark as unread
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            handleDismiss()
                          }}>
                            <X className="h-4 w-4 mr-2" />
                            Dismiss
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete()
                            }}
                            className="text-destructive"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Image Preview */}
          {notification.image && (
            <div className="mt-3">
              <img
                src={notification.image}
                alt={notification.title}
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Action Button */}
          {notification.action && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleAction()
                }}
                className="text-xs"
              >
                {notification.action.type === 'external_link' && (
                  <ExternalLink className="h-3 w-3 mr-1" />
                )}
                {notification.action.type === 'navigate' ? 'View' : 'Open'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Unread Indicator */}
      {isUnread && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-blue-500 rounded-full" />
      )}
    </motion.div>
  )
}
