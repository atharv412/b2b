"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Eye, 
  Download, 
  Users, 
  TrendingUp,
  Calendar,
  BarChart3,
  Activity
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { ProfileAnalytics } from '@/types/profile'
import { formatDistanceToNow } from 'date-fns'

interface ProfileAnalyticsPanelProps {
  analytics: ProfileAnalytics
  className?: string
}

export function ProfileAnalyticsPanel({ analytics, className }: ProfileAnalyticsPanelProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const getTrendDirection = (current: number, previous: number) => {
    if (current > previous) return 'up'
    if (current < previous) return 'down'
    return 'stable'
  }

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return '↗'
      case 'down': return '↘'
      default: return '→'
    }
  }

  const viewsTrend = getTrendDirection(analytics.views.thisMonth, analytics.views.thisWeek)
  const downloadsTrend = getTrendDirection(analytics.downloads.thisMonth, analytics.downloads.thisMonth)

  return (
    <div className={cn('space-y-6', className)}>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Profile Views */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Profile Views</p>
                  <motion.p
                    className="text-2xl font-bold"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  >
                    {formatNumber(analytics.views.total)}
                  </motion.p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={cn('text-xs', getTrendColor(viewsTrend))}>
                      {getTrendIcon(viewsTrend)} {analytics.views.thisMonth}
                    </span>
                    <span className="text-xs text-muted-foreground">this month</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resume Downloads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resume Downloads</p>
                  <motion.p
                    className="text-2xl font-bold"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  >
                    {formatNumber(analytics.downloads.resume)}
                  </motion.p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={cn('text-xs', getTrendColor(downloadsTrend))}>
                      {getTrendIcon(downloadsTrend)} {analytics.downloads.thisMonth}
                    </span>
                    <span className="text-xs text-muted-foreground">this month</span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Download className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Connections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Connections</p>
                  <motion.p
                    className="text-2xl font-bold"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                  >
                    {formatNumber(analytics.engagement.connectionsCount)}
                  </motion.p>
                  <p className="text-xs text-muted-foreground mt-1">Professional network</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Completeness */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Profile Complete</p>
                  <motion.p
                    className="text-2xl font-bold"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                  >
                    {analytics.engagement.profileCompleteness}%
                  </motion.p>
                  <div className="mt-2">
                    <Progress value={analytics.engagement.profileCompleteness} className="h-2" />
                  </div>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Activity className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Detailed Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* View Statistics */}
            <div className="space-y-3">
              <h4 className="font-semibold">Profile Views</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">{analytics.views.today}</p>
                  <p className="text-sm text-muted-foreground">Today</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">{analytics.views.thisWeek}</p>
                  <p className="text-sm text-muted-foreground">This Week</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">{analytics.views.thisMonth}</p>
                  <p className="text-sm text-muted-foreground">This Month</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">{analytics.views.total}</p>
                  <p className="text-sm text-muted-foreground">All Time</p>
                </div>
              </div>
            </div>

            {/* Section Views */}
            <div className="space-y-3">
              <h4 className="font-semibold">Section Popularity</h4>
              <div className="space-y-2">
                {Object.entries(analytics.sections).map(([section, data], index) => (
                  <motion.div
                    key={section}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium capitalize">{section.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="text-sm text-muted-foreground">
                        Last viewed {formatDistanceToNow(new Date(data.lastViewed), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{data.views} views</Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Activity Summary */}
            <div className="space-y-3">
              <h4 className="font-semibold">Activity Summary</h4>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Last Active</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(analytics.engagement.lastActive), { addSuffix: true })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
