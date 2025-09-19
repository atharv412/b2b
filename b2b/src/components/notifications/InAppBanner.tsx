"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  ExternalLink, 
  Bell, 
  MessageCircle, 
  Heart, 
  ShoppingCart, 
  Users, 
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ToastNotification, Notification } from '@/types/notifications'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

interface InAppBannerProps {
  notification: ToastNotification
  onDismiss: (notificationId: string) => void
  onAction?: (notification: Notification) => void
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
  low: 'border-l-blue-500 bg-blue-50',
  medium: 'border-l-green-500 bg-green-50',
  high: 'border-l-orange-500 bg-orange-50',
  urgent: 'border-l-red-500 bg-red-50'
}

export function InAppBanner({ 
  notification, 
  onDismiss, 
  onAction,
  className 
}: InAppBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  const Icon = notificationIcons[notification.notification.type]
  const priorityColor = priorityColors[notification.notification.priority]

  useEffect(() => {
    if (notification.autoClose !== false) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onDismiss(notification.id), 300)
      }, notification.duration || 5000)

      return () => clearTimeout(timer)
    }
  }, [notification.id, notification.autoClose, notification.duration, onDismiss])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => onDismiss(notification.id), 300)
  }

  const handleAction = () => {
    onAction?.(notification.notification)
    handleDismiss()
  }

  const handleNotificationClick = () => {
    if (notification.notification.action) {
      switch (notification.notification.action.type) {
        case 'navigate':
          if (notification.notification.action.url) {
            window.location.href = notification.notification.action.url
          }
          break
        case 'open_modal':
          console.log('Open modal:', notification.notification.action.modalId)
          break
        case 'external_link':
          if (notification.notification.action.url) {
            window.open(notification.notification.action.url, '_blank')
          }
          break
      }
    }
    handleAction()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.95 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.3 
          }}
          className={cn(
            "fixed top-4 right-4 z-50 max-w-sm w-full",
            className
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            className={cn(
              "relative p-4 rounded-lg shadow-lg border-l-4 bg-white border border-border",
              priorityColor
            )}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-black/10"
            >
              <X className="h-3 w-3" />
            </Button>

            <div className="flex items-start gap-3 pr-6">
              {/* Avatar/Icon */}
              <div className="flex-shrink-0">
                {notification.notification.avatar ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={notification.notification.avatar} />
                    <AvatarFallback>
                      {notification.notification.source.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm line-clamp-1">
                    {notification.notification.title}
                  </h4>
                  <Badge 
                    variant="outline" 
                    className="text-xs"
                  >
                    {notification.notification.priority}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {notification.notification.message}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.notification.createdAt), { addSuffix: true })}
                  </span>
                  
                  {notification.action && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNotificationClick}
                      className="text-xs h-6 px-2"
                    >
                      {notification.action.label}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {notification.autoClose !== false && (
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-current opacity-30 rounded-b-lg"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ 
                  duration: (notification.duration || 5000) / 1000,
                  ease: "linear"
                }}
              />
            )}

            {/* Hover Effect */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-lg bg-black/5 pointer-events-none"
                />
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Toast Container Component
interface ToastContainerProps {
  toasts: ToastNotification[]
  onDismiss: (notificationId: string) => void
  onAction?: (notification: Notification) => void
  className?: string
}

export function ToastContainer({ 
  toasts, 
  onDismiss, 
  onAction,
  className 
}: ToastContainerProps) {
  return (
    <div className={cn("fixed top-4 right-4 z-50 space-y-2", className)}>
      <AnimatePresence>
        {toasts.map((toast, index) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ delay: index * 0.1 }}
          >
            <InAppBanner
              notification={toast}
              onDismiss={onDismiss}
              onAction={onAction}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
