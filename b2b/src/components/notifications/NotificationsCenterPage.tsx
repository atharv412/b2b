"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  Filter, 
  Search, 
  Check, 
  X, 
  Trash2, 
  Eye, 
  EyeOff,
  Settings,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { NotificationItem } from './NotificationItem'
import { NotificationSettingsPanel } from './NotificationSettingsPanel'
import { useNotifications, useNotificationActions, useNotificationFilters } from '@/hooks/useNotifications'
import { NotificationType, NotificationPriority, NotificationStatus } from '@/types/notifications'
import { cn } from '@/lib/utils'

interface NotificationsCenterPageProps {
  className?: string
}

export function NotificationsCenterPage({ className }: NotificationsCenterPageProps) {
  const { notifications, unreadCount, isLoading } = useNotifications()
  const { markAllAsRead, clearAll } = useNotificationActions()
  const { filters, filteredNotifications, applyFilters, clearFilters, hasActiveFilters } = useNotificationFilters()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set())
  const [showSettings, setShowSettings] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)

  // Apply search filter
  useEffect(() => {
    const searchFilter = searchQuery ? { search: searchQuery } : {}
    applyFilters({ ...filters, ...searchFilter })
  }, [searchQuery, filters, applyFilters])

  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => {
      const newSet = new Set(prev)
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId)
      } else {
        newSet.add(notificationId)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (selectedNotifications.size === filteredNotifications.length) {
      setSelectedNotifications(new Set())
    } else {
      setSelectedNotifications(new Set(filteredNotifications.map(n => n.id)))
    }
  }

  const handleBulkAction = async (action: 'mark_read' | 'mark_unread' | 'dismiss' | 'delete') => {
    const notificationIds = Array.from(selectedNotifications)
    if (notificationIds.length === 0) return

    switch (action) {
      case 'mark_read':
        await markAllAsRead()
        break
      case 'mark_unread':
        // Implementation for mark as unread
        break
      case 'dismiss':
        // Implementation for dismiss
        break
      case 'delete':
        await clearAll()
        break
    }

    setSelectedNotifications(new Set())
    setIsSelecting(false)
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value === 'all' ? undefined : value }
    applyFilters(newFilters)
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    clearFilters()
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
              >
                <X className="h-4 w-4 mr-2" />
                Clear filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <Select
              value={filters.type || 'all'}
              onValueChange={(value) => handleFilterChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="post">Posts</SelectItem>
                <SelectItem value="chat">Chat</SelectItem>
                <SelectItem value="marketplace">Marketplace</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="connection">Connections</SelectItem>
                <SelectItem value="message">Messages</SelectItem>
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select
              value={filters.priority || 'all'}
              onValueChange={(value) => handleFilterChange('priority', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <AnimatePresence>
        {isSelecting && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                {selectedNotifications.size} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedNotifications.size === filteredNotifications.length ? 'Deselect all' : 'Select all'}
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('mark_read')}
              >
                <Eye className="h-4 w-4 mr-2" />
                Mark read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('dismiss')}
              >
                <X className="h-4 w-4 mr-2" />
                Dismiss
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('delete')}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsSelecting(false)
                  setSelectedNotifications(new Set())
                }}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {filteredNotifications.length > 0 && (
                <Badge variant="secondary">
                  {filteredNotifications.length}
                </Badge>
              )}
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSelecting(!isSelecting)}
              >
                {isSelecting ? 'Cancel' : 'Select'}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={markAllAsRead}>
                    <Eye className="h-4 w-4 mr-2" />
                    Mark all read
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={clearAll}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear all
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notifications found</p>
              <p className="text-sm">
                {hasActiveFilters ? 'Try adjusting your filters' : 'You\'re all caught up!'}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <NotificationItem
                    notification={notification}
                    showActions={true}
                    onAction={() => {
                      if (isSelecting) {
                        handleSelectNotification(notification.id)
                      }
                    }}
                    className={cn(
                      isSelecting && "hover:bg-muted/50",
                      selectedNotifications.has(notification.id) && "bg-blue-50 border-l-4 border-l-blue-500"
                    )}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings Modal */}
      <NotificationSettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  )
}
