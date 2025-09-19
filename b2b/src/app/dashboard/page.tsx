"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Building2, 
  Users, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  FileText, 
  Bell,
  Search,
  Settings,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    icon: DollarSign,
    positive: true
  },
  {
    title: "Active Clients",
    value: "2,350",
    change: "+12.5%",
    icon: Users,
    positive: true
  },
  {
    title: "Total Orders",
    value: "12,234",
    change: "+5.2%",
    icon: ShoppingCart,
    positive: true
  },
  {
    title: "Growth Rate",
    value: "23.1%",
    change: "-2.1%",
    icon: TrendingUp,
    positive: false
  }
]

const recentActivities = [
  {
    id: 1,
    user: "John Doe",
    action: "Created new order",
    time: "2 minutes ago",
    avatar: "JD"
  },
  {
    id: 2,
    user: "Sarah Johnson",
    action: "Updated client profile",
    time: "1 hour ago",
    avatar: "SJ"
  },
  {
    id: 3,
    user: "Mike Chen",
    action: "Generated report",
    time: "3 hours ago",
    avatar: "MC"
  },
  {
    id: 4,
    user: "Emily Rodriguez",
    action: "Approved invoice",
    time: "5 hours ago",
    avatar: "ER"
  }
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header 
        className="bg-white border-b shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">B2B Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <Button variant="outline" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Avatar>
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Admin</h2>
          <p className="text-gray-600">Here&apos;s what&apos;s happening with your business today.</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <Badge 
                    variant={stat.positive ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {stat.change} from last month
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Charts Section */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                  Revenue Overview
                </CardTitle>
                <CardDescription>Monthly revenue for the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                    <p className="text-gray-600">Chart visualization would go here</p>
                    <p className="text-sm text-gray-500">Connect your analytics service</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-green-600" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <p className="text-gray-600">Performance chart placeholder</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Add New Client
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Create Order
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Activity className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest team actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <motion.div 
                      key={activity.id}
                      className="flex items-center space-x-3"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {activity.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.user}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {activity.action}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400">
                        {activity.time}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current system health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Status</span>
                    <Badge className="bg-green-500">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database</span>
                    <Badge className="bg-green-500">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Storage</span>
                    <Badge variant="secondary">85% Used</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Backup</span>
                    <span className="text-sm text-gray-500">2 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 