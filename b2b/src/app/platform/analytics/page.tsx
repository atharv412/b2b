"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PlatformLayout } from "@/components/layout/PlatformLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  MessageCircle,
  Share2,
  ShoppingBag,
  DollarSign,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
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

const kpiData: Array<{ title: string; value: string; change: string; trend: 'up' | 'down'; icon: React.ComponentType<any>; color: string }> = [
  {
    title: "Total Views",
    value: "24,531",
    change: "+12.5%",
    trend: "up",
    icon: Eye,
    color: "blue"
  },
  {
    title: "Engagement Rate",
    value: "8.2%",
    change: "+2.1%",
    trend: "up",
    icon: MessageCircle,
    color: "green"
  },
  {
    title: "Profile Visits",
    value: "1,847",
    change: "-3.2%",
    trend: "down",
    icon: Users,
    color: "purple"
  },
  {
    title: "Revenue",
    value: "$12,450",
    change: "+18.7%",
    trend: "up",
    icon: DollarSign,
    color: "emerald"
  }
]

const postAnalytics = [
  {
    id: 1,
    title: "AI-Powered Analytics Dashboard Launch",
    views: 1250,
    likes: 89,
    comments: 23,
    shares: 15,
    reach: 3400,
    date: "2024-01-15"
  },
  {
    id: 2,
    title: "Team Collaboration Best Practices",
    views: 987,
    likes: 67,
    comments: 18,
    shares: 12,
    reach: 2800,
    date: "2024-01-12"
  },
  {
    id: 3,
    title: "Future of Remote Work Technology",
    views: 2340,
    likes: 156,
    comments: 45,
    shares: 34,
    reach: 5200,
    date: "2024-01-10"
  }
]

const marketplaceMetrics = [
  {
    product: "Analytics Dashboard",
    views: 2340,
    quotations: 45,
    sales: 12,
    revenue: 3588,
    conversion: 1.9
  },
  {
    product: "Video Conferencing System",
    views: 1870,
    quotations: 23,
    sales: 8,
    revenue: 10392,
    conversion: 1.2
  },
  {
    product: "Cloud Storage Solution",
    views: 3450,
    quotations: 89,
    sales: 34,
    revenue: 1666,
    conversion: 2.6
  }
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [activeTab, setActiveTab] = useState("overview")

  const KPICard = ({ kpi }: { kpi: { title: string; value: string; change: string; trend: 'up' | 'down'; icon: React.ComponentType<any>; color: string } }) => (
    <motion.div variants={itemVariants}>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
              <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
              <div className="flex items-center space-x-1 mt-2">
                {kpi.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={`text-sm font-medium ${
                    kpi.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {kpi.change}
                </span>
                <span className="text-sm text-gray-500">vs last month</span>
              </div>
            </div>
            <div className={`p-3 rounded-full bg-${kpi.color}-100`}>
              <kpi.icon className={`h-6 w-6 text-${kpi.color}-600`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <PlatformLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Track your performance and engagement metrics</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 3 months</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {kpiData.map((kpi, index) => (
                <KPICard key={index} kpi={kpi} />
              ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Chart */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <LineChart className="h-5 w-5 mr-2 text-blue-600" />
                      Engagement Trends
                    </CardTitle>
                    <CardDescription>Views, likes, and comments over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <LineChart className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                        <p className="text-gray-600">Interactive chart would be displayed here</p>
                        <p className="text-sm text-gray-500">Connect your analytics service</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Content */}
              <div>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                      Top Performing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">AI Dashboard Post</p>
                          <p className="text-sm text-gray-600">2.3K views</p>
                        </div>
                        <Badge className="bg-green-500">+89%</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Remote Work Guide</p>
                          <p className="text-sm text-gray-600">1.8K views</p>
                        </div>
                        <Badge variant="secondary">+45%</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Tech Trends 2024</p>
                          <p className="text-sm text-gray-600">1.2K views</p>
                        </div>
                        <Badge variant="outline">+23%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Audience Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-purple-600" />
                    Audience Demographics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Professionals</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={65} className="w-24" />
                        <span className="text-sm font-medium">65%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Students</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={25} className="w-24" />
                        <span className="text-sm font-medium">25%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Companies</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={10} className="w-24" />
                        <span className="text-sm font-medium">10%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-orange-600" />
                    Activity Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">New post published</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Product viewed 50+ times</p>
                        <p className="text-xs text-gray-500">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">New connection request</p>
                        <p className="text-xs text-gray-500">6 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="posts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Performance</CardTitle>
                <CardDescription>Detailed analytics for your content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {postAnalytics.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{post.title}</h3>
                        <span className="text-sm text-gray-500">{post.date}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="text-center">
                          <Eye className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                          <p className="text-lg font-semibold">{post.views}</p>
                          <p className="text-xs text-gray-600">Views</p>
                        </div>
                        <div className="text-center">
                          <MessageCircle className="h-5 w-5 mx-auto mb-1 text-green-600" />
                          <p className="text-lg font-semibold">{post.likes}</p>
                          <p className="text-xs text-gray-600">Likes</p>
                        </div>
                        <div className="text-center">
                          <MessageCircle className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                          <p className="text-lg font-semibold">{post.comments}</p>
                          <p className="text-xs text-gray-600">Comments</p>
                        </div>
                        <div className="text-center">
                          <Share2 className="h-5 w-5 mx-auto mb-1 text-orange-600" />
                          <p className="text-lg font-semibold">{post.shares}</p>
                          <p className="text-xs text-gray-600">Shares</p>
                        </div>
                        <div className="text-center">
                          <Users className="h-5 w-5 mx-auto mb-1 text-indigo-600" />
                          <p className="text-lg font-semibold">{post.reach}</p>
                          <p className="text-xs text-gray-600">Reach</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Marketplace Performance</CardTitle>
                <CardDescription>Sales and engagement metrics for your products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Product</th>
                        <th className="text-left py-3 px-4">Views</th>
                        <th className="text-left py-3 px-4">Quotations</th>
                        <th className="text-left py-3 px-4">Sales</th>
                        <th className="text-left py-3 px-4">Revenue</th>
                        <th className="text-left py-3 px-4">Conversion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marketplaceMetrics.map((metric, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 px-4 font-medium">{metric.product}</td>
                          <td className="py-3 px-4">{metric.views.toLocaleString()}</td>
                          <td className="py-3 px-4">{metric.quotations}</td>
                          <td className="py-3 px-4">{metric.sales}</td>
                          <td className="py-3 px-4">${metric.revenue.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <Badge variant={metric.conversion > 2 ? "default" : "secondary"}>
                              {metric.conversion}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="network" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <p className="text-3xl font-bold text-gray-900">1,247</p>
                  <p className="text-sm text-gray-600">Total Connections</p>
                  <p className="text-sm text-green-600 mt-1">+156 this month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Eye className="h-12 w-12 mx-auto mb-4 text-green-600" />
                  <p className="text-3xl font-bold text-gray-900">24,531</p>
                  <p className="text-sm text-gray-600">Profile Views</p>
                  <p className="text-sm text-green-600 mt-1">+12.5% increase</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                  <p className="text-3xl font-bold text-gray-900">89</p>
                  <p className="text-sm text-gray-600">Messages Sent</p>
                  <p className="text-sm text-blue-600 mt-1">This week</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PlatformLayout>
  )
} 