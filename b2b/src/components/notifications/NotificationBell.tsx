"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { NotificationsDropdown } from './NotificationsDropdown'
import { useNotifications } from '@/hooks/useNotifications'
import { cn } from '@/lib/utils'

interface NotificationBellProps {
  className?: string
  showDropdown?: boolean
  onToggleDropdown?: (isOpen: boolean) => void
}

export function NotificationBell({ 
  className, 
  showDropdown = false,
  onToggleDropdown 
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { unreadCount, isLoading } = useNotifications()

  const handleToggle = () => {
    const newIsOpen = !isOpen
    setIsOpen(newIsOpen)
    onToggleDropdown?.(newIsOpen)
  }

  const handleClose = () => {
    setIsOpen(false)
    onToggleDropdown?.(false)
  }

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className="relative p-2 hover:bg-muted/50 transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell className="h-5 w-5" />
        
        {/* Unread Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                transition: { type: "spring", stiffness: 500, damping: 30 }
              }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-1 -right-1"
            >
              <Badge 
                variant="destructive" 
                className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold min-w-[20px]"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse Animation for New Notifications */}
        {unreadCount > 0 && (
          <motion.div
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive/20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
      </Button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 z-50"
          >
            <NotificationsDropdown onClose={handleClose} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={handleClose}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
