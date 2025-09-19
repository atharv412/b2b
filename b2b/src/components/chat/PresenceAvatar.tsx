"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { User, PresenceStatus } from '@/types/chat'
import { cn } from '@/lib/utils'

interface PresenceAvatarProps {
  user: User
  size?: 'sm' | 'md' | 'lg'
  showStatus?: boolean
  showName?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12'
}

const statusColors = {
  online: 'bg-green-500',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
  offline: 'bg-gray-400'
}

const statusLabels = {
  online: 'Online',
  away: 'Away',
  busy: 'Busy',
  offline: 'Offline'
}

export function PresenceAvatar({ 
  user, 
  size = 'md', 
  showStatus = true, 
  showName = false,
  className 
}: PresenceAvatarProps) {
  const getStatusColor = (status: PresenceStatus) => {
    return statusColors[status] || statusColors.offline
  }

  const getStatusLabel = (status: PresenceStatus) => {
    return statusLabels[status] || statusLabels.offline
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <Avatar className={cn(sizeClasses[size])}>
          <AvatarImage src={user.avatar} />
          <AvatarFallback className="text-xs">
            {user.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        {showStatus && (
          <motion.div
            className={cn(
              "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background",
              getStatusColor(user.status)
            )}
            animate={user.status === 'online' ? {
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1]
            } : {}}
            transition={{
              duration: 2,
              repeat: user.status === 'online' ? Infinity : 0,
              ease: "easeInOut"
            }}
            title={getStatusLabel(user.status)}
          />
        )}
      </div>
      
      {showName && (
        <div className="min-w-0">
          <div className="font-medium text-sm truncate">
            {user.name}
          </div>
          {showStatus && (
            <div className="text-xs text-muted-foreground">
              {getStatusLabel(user.status)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
