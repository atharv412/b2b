"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  Settings, 
  Eye, 
  EyeOff, 
  MoreHorizontal,
  Check,
  X,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { NotificationItem } from './NotificationItem'
import { GroupedNotificationCard } from './GroupedNotificationCard'
import { useNotifications, useNotificationActions } from '@/hooks/useNotifications'
import { cn } from '@/lib/utils'

interface NotificationsDropdownProps {
  onClose: () => void
  className?: string
}

export function NotificationsDropdown({ onClose, className }: NotificationsDropdownProps) {
  const { groupedNotifications, unreadCount, isLoading } = useNotifications()
  const { markAllAsRead, clearAll } = useNotificationActions()
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [showAll, setShowAll] = useState(false)

  const handleGroupToggle = (groupType: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev)
      if (newSet.has(groupType)) {
        newSet.delete(groupType)
      } else {
        newSet.add(groupType)
      }
      return newSet
    })
  }

  const handleMarkAllRead = async () => {
    await markAllAsRead()
  }

  const handleClearAll = async () => {
    await clearAll()
  }

  const displayGroups = showAll ? groupedNotifications : groupedNotifications.slice(0, 3)

  return (
    <Card className={cn("w-96 max-h-[600px] overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleMarkAllRead}>
                  <Check className="h-4 w-4 mr-2" />
                  Mark all read
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleClearAll}>
                  <X className="h-4 w-4 mr-2" />
                  Clear all
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onClose}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Quick Actions */}
        <div className="px-6 pb-3 border-b">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="flex-1"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showAll ? 'Show less' : 'Show all'}
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : groupedNotifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notifications yet</p>
              <p className="text-sm">We'll notify you when something important happens</p>
            </div>
          ) : (
            <div className="space-y-1">
              {displayGroups.map((group, index) => (
                <motion.div
                  key={group.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GroupedNotificationCard
                    group={group}
                    isExpanded={expandedGroups.has(group.type)}
                    onToggle={() => handleGroupToggle(group.type)}
                    onNotificationClick={onClose}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {groupedNotifications.length > 0 && (
          <div className="px-6 py-3 border-t bg-muted/50">
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => {
                onClose()
                // Navigate to notifications center
                window.location.href = '/notifications'
              }}
            >
              View all notifications
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
