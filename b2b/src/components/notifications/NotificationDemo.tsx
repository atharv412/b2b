"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Bell, 
  Plus, 
  Settings, 
  RefreshCw,
  Zap,
  MessageCircle,
  ShoppingCart,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  NotificationBell,
  NotificationsCenterPage,
  NotificationSettingsPanel,
  ToastContainer,
  useNotifications,
  useRealtimeNotifications,
  useToastNotifications
} from './index'
import { Notification, NotificationType, NotificationPriority } from '@/types/notifications'

export function NotificationDemo() {
  const [showSettings, setShowSettings] = useState(false)
  const [showCenter, setShowCenter] = useState(false)
  const { notifications, unreadCount } = useNotifications()
  const { subscribe, unsubscribe } = useRealtimeNotifications()
  const { toasts, showToast, removeToast } = useToastNotifications()

  // Demo notification types
  const demoNotifications: Partial<Notification>[] = [
    {
      type: 'post',
      priority: 'medium',
      title: 'New comment on your post',
      message: 'John Doe commented on "Building Better APIs"',
      source: { id: 'user1', name: 'John Doe', type: 'user' }
    },
    {
      type: 'chat',
      priority: 'high',
      title: 'New message in Design Team',
      message: 'Sarah: "Can we review the new mockups?"',
      source: { id: 'user2', name: 'Sarah Wilson', type: 'user' }
    },
    {
      type: 'marketplace',
      priority: 'low',
      title: 'New product listing',
      message: 'Check out the new "Project Management Tool" in marketplace',
      source: { id: 'system', name: 'Marketplace', type: 'system' }
    },
    {
      type: 'connection',
      priority: 'medium',
      title: 'New connection request',
      message: 'Mike Johnson wants to connect with you',
      source: { id: 'user3', name: 'Mike Johnson', type: 'user' }
    },
    {
      type: 'system',
      priority: 'urgent',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will begin in 30 minutes',
      source: { id: 'system', name: 'System', type: 'system' }
    }
  ]

  const generateDemoNotification = () => {
    const randomNotification = demoNotifications[Math.floor(Math.random() * demoNotifications.length)]
    const notification: Notification = {
      id: `demo-${Date.now()}`,
      type: randomNotification.type!,
      priority: randomNotification.priority!,
      title: randomNotification.title!,
      message: randomNotification.message!,
      createdAt: new Date().toISOString(),
      status: 'unread',
      source: randomNotification.source!
    }

    // Show as toast for high priority
    if (notification.priority === 'urgent' || notification.priority === 'high') {
      showToast({
        id: `toast-${notification.id}`,
        notification,
        action: {
          label: 'View',
          onClick: () => console.log('View notification')
        }
      })
    }
  }

  const generateUrgentNotification = () => {
    const urgentNotification: Notification = {
      id: `urgent-${Date.now()}`,
      type: 'system',
      priority: 'urgent',
      title: '🚨 Urgent Alert',
      message: 'This is a high-priority notification that will show as a toast',
      createdAt: new Date().toISOString(),
      status: 'unread',
      source: { id: 'system', name: 'System Alert', type: 'system' }
    }

    showToast({
      id: `toast-${urgentNotification.id}`,
      notification: urgentNotification,
      action: {
        label: 'Take Action',
        onClick: () => console.log('Urgent action taken')
      },
      duration: 10000 // 10 seconds
    })
  }

  useEffect(() => {
    // Subscribe to real-time notifications for demo
    const subscription = subscribe('demo-user', (notification) => {
      console.log('Real-time notification received:', notification)
    })

    return () => subscription.unsubscribe()
  }, [subscribe])

  if (showCenter) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Notification Demo</h1>
              <Button
                variant="outline"
                onClick={() => setShowCenter(false)}
              >
                Back to Demo
              </Button>
            </div>
          </div>
        </div>
        <NotificationsCenterPage />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Notification System Demo</h1>
            <div className="flex items-center gap-4">
              <NotificationBell />
              <Button
                variant="outline"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demo Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Demo Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={generateDemoNotification} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Notification
                </Button>
                <Button onClick={generateUrgentNotification} variant="destructive" className="w-full">
                  <Bell className="h-4 w-4 mr-2" />
                  Urgent Alert
                </Button>
              </div>
              
              <Button 
                onClick={() => setShowCenter(true)} 
                variant="outline" 
                className="w-full"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Open Notifications Center
              </Button>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Notification Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Total Notifications</span>
                  <Badge variant="secondary">{notifications.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Unread Count</span>
                  <Badge variant="destructive">{unreadCount}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Active Toasts</span>
                  <Badge variant="outline">{toasts.length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Notification Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold">Real-time</h3>
                  <p className="text-sm text-muted-foreground">Instant notifications via WebSocket</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h3 className="font-semibold">Grouped</h3>
                  <p className="text-sm text-muted-foreground">Smart grouping by type and priority</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h3 className="font-semibold">Multi-channel</h3>
                  <p className="text-sm text-muted-foreground">Email, WhatsApp, Push, In-App</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Users className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <h3 className="font-semibold">Accessible</h3>
                  <p className="text-sm text-muted-foreground">ARIA labels and keyboard navigation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Settings Modal */}
      <NotificationSettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* Toast Container */}
      <ToastContainer
        toasts={toasts}
        onDismiss={removeToast}
      />
    </div>
  )
}
