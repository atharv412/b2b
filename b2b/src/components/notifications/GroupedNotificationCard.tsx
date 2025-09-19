"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, 
  ChevronRight, 
  MessageCircle, 
  Heart, 
  ShoppingCart, 
  Users, 
  Settings, 
  Bell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { NotificationItem } from './NotificationItem'
import { NotificationGroup } from '@/types/notifications'
import { cn } from '@/lib/utils'

interface GroupedNotificationCardProps {
  group: NotificationGroup
  isExpanded: boolean
  onToggle: () => void
  onNotificationClick?: (notification: any) => void
  className?: string
}

const groupIcons = {
  post: MessageCircle,
  chat: MessageCircle,
  marketplace: ShoppingCart,
  system: Settings,
  connection: Users,
  message: Bell
}

const groupColors = {
  post: 'text-blue-600 bg-blue-100',
  chat: 'text-green-600 bg-green-100',
  marketplace: 'text-purple-600 bg-purple-100',
  system: 'text-gray-600 bg-gray-100',
  connection: 'text-orange-600 bg-orange-100',
  message: 'text-pink-600 bg-pink-100'
}

export function GroupedNotificationCard({
  group,
  isExpanded,
  onToggle,
  onNotificationClick,
  className
}: GroupedNotificationCardProps) {
  const Icon = groupIcons[group.type]
  const colorClass = groupColors[group.type]

  const getGroupTitle = (type: string) => {
    switch (type) {
      case 'post': return 'Posts'
      case 'chat': return 'Messages'
      case 'marketplace': return 'Marketplace'
      case 'system': return 'System'
      case 'connection': return 'Connections'
      case 'message': return 'Messages'
      default: return type
    }
  }

  const getGroupDescription = (type: string, count: number, unreadCount: number) => {
    if (unreadCount > 0) {
      return `${unreadCount} new ${type}${unreadCount > 1 ? 's' : ''}`
    }
    return `${count} ${type}${count > 1 ? 's' : ''}`
  }

  return (
    <div className={cn("border-b last:border-b-0", className)}>
      {/* Group Header */}
      <Button
        variant="ghost"
        className="w-full justify-between p-4 h-auto hover:bg-muted/50"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
            colorClass
          )}>
            <Icon className="h-4 w-4" />
          </div>
          
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm">{getGroupTitle(group.type)}</h3>
              {group.unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {group.unreadCount}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {getGroupDescription(group.type, group.count, group.unreadCount)}
            </p>
          </div>
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </Button>

      {/* Group Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t bg-muted/20">
              {group.notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <NotificationItem
                    notification={notification}
                    onAction={onNotificationClick}
                    compact={true}
                    showActions={false}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
