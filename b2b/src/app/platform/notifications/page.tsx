"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PlatformLayout } from "@/components/layout/PlatformLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  ShoppingBag,
  Award,
  AlertTriangle,
  CheckCircle,
  Info,
  Trash2,
  Check,
  Settings,
  Filter
} from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3
    }
  }
}

const notifications = [
  {
    id: 1,
    type: "like",
    title: "Ananya Gupta liked your post",
    description: "Your post about 'AI-Powered Analytics Dashboard' received a new like",
    time: "2 minutes ago",
    read: false,
    avatar: "AG",
    icon: Heart,
    iconColor: "text-red-500"
  },
  {
    id: 2,
    type: "comment",
    title: "New comment on your post",
    description: "Arjun Mehta commented: 'Great insights! Would love to discuss this further.'",
    time: "15 minutes ago",
    read: false,
    avatar: "AM",
    icon: MessageCircle,
    iconColor: "text-blue-500"
  },
  {
    id: 3,
    type: "connection",
    title: "New connection request",
    description: "Priya Patel wants to connect with you",
    time: "1 hour ago",
    read: false,
    avatar: "PP",
    icon: UserPlus,
    iconColor: "text-green-500"
  },
  {
    id: 4,
    type: "marketplace",
    title: "Product inquiry received",
    description: "Microsoft Sales team is interested in your Analytics Dashboard",
    time: "2 hours ago",
    read: true,
    avatar: "MS",
    icon: ShoppingBag,
    iconColor: "text-purple-500"
  },
  {
    id: 5,
    type: "achievement",
    title: "Profile milestone reached!",
    description: "Your profile has been viewed 1,000 times this month",
    time: "3 hours ago",
    read: true,
    avatar: null,
    icon: Award,
    iconColor: "text-yellow-500"
  },
  {
    id: 6,
    type: "system",
    title: "Security alert",
    description: "New login detected from unknown device in New York",
    time: "1 day ago",
    read: false,
    avatar: null,
    icon: AlertTriangle,
    iconColor: "text-orange-500"
  },
  {
    id: 7,
    type: "system",
    title: "Account verification completed",
    description: "Your business account has been successfully verified",
    time: "2 days ago",
    read: true,
    avatar: null,
    icon: CheckCircle,
    iconColor: "text-green-500"
  }
]

const notificationStats = [
  { label: "All", count: 7, type: "all" },
  { label: "Unread", count: 4, type: "unread" },
  { label: "Posts", count: 3, type: "posts" },
  { label: "Network", count: 2, type: "network" },
  { label: "Marketplace", count: 1, type: "marketplace" },
  { label: "System", count: 2, type: "system" }
]

export default function NotificationsPage() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([])
  const [notificationList, setNotificationList] = useState(notifications)

  const filteredNotifications = notificationList.filter(notification => {
    switch (selectedTab) {
      case "unread":
        return !notification.read
      case "posts":
        return ["like", "comment"].includes(notification.type)
      case "network":
        return notification.type === "connection"
      case "marketplace":
        return notification.type === "marketplace"
      case "system":
        return notification.type === "system"
      default:
        return true
    }
  })

  const toggleNotificationSelection = (id: number) => {
    setSelectedNotifications(prev =>
      prev.includes(id)
        ? prev.filter(notifId => notifId !== id)
        : [...prev, id]
    )
  }

  const markAsRead = (ids: number[]) => {
    setNotificationList(prev =>
      prev.map(notification =>
        ids.includes(notification.id)
          ? { ...notification, read: true }
          : notification
      )
    )
    setSelectedNotifications([])
  }

  const deleteNotifications = (ids: number[]) => {
    setNotificationList(prev =>
      prev.filter(notification => !ids.includes(notification.id))
    )
    setSelectedNotifications([])
  }

  const NotificationItem = ({ notification }: { notification: any }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.01 }}
      className={`p-4 border-l-4 transition-all ${
        notification.read
          ? "border-gray-200 bg-white"
          : "border-blue-500 bg-blue-50"
      }`}
    >
      <div className="flex items-start space-x-4">
        <Checkbox
          checked={selectedNotifications.includes(notification.id)}
          onCheckedChange={() => toggleNotificationSelection(notification.id)}
        />
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {notification.avatar ? (
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{notification.avatar}</AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <notification.icon className={`h-5 w-5 ${notification.iconColor}`} />
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className={`font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                    {notification.title}
                  </h3>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <p className={`text-sm mt-1 ${notification.read ? 'text-gray-500' : 'text-gray-600'}`}>
                  {notification.description}
                </p>
                <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
              </div>
            </div>
            
            <notification.icon className={`h-5 w-5 ${notification.iconColor}`} />
          </div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <PlatformLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-600">Stay updated with your latest activities</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          {notificationStats.map((stat) => (
            <Card
              key={stat.type}
              className={`cursor-pointer transition-all ${
                selectedTab === stat.type ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedTab(stat.type)}
            >
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedNotifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4"
            >
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">
                      {selectedNotifications.length} notification(s) selected
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markAsRead(selectedNotifications)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Mark as Read
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteNotifications(selectedNotifications)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                {selectedTab === "all" ? "All Notifications" : 
                 selectedTab === "unread" ? "Unread Notifications" :
                 selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}
              </CardTitle>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAsRead(filteredNotifications.filter(n => !n.read).map(n => n.id))}
                >
                  Mark all as read
                </Button>
                <Button variant="ghost" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {filteredNotifications.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="divide-y divide-gray-200"
              >
                {filteredNotifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
              </motion.div>
            ) : (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-500">
                  {selectedTab === "unread" 
                    ? "You're all caught up! No unread notifications."
                    : "No notifications in this category yet."
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Load More */}
        {filteredNotifications.length > 0 && (
          <div className="text-center mt-6">
            <Button variant="outline">
              Load Earlier Notifications
            </Button>
          </div>
        )}
      </div>
    </PlatformLayout>
  )
} 