"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Users, 
  Star, 
  MessageCircle, 
  Heart,
  ExternalLink,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Post } from '@/types/feed'
import { formatDistanceToNow } from 'date-fns'

// Animation variants
const highlightVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  }
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

interface ConnectionHighlight {
  id: string
  type: 'post' | 'achievement' | 'milestone'
  user: {
    id: string
    fullName: string
    username: string
    avatarUrl?: string
    verified: boolean
  }
  content: string
  timestamp: string
  stats?: {
    likes: number
    comments: number
    shares: number
  }
  metadata?: {
    achievement?: string
    milestone?: string
    postType?: string
  }
}

interface ConnectionsHighlightsProps {
  highlights: ConnectionHighlight[]
  onHighlightClick: (highlight: ConnectionHighlight) => void
  className?: string
}

export function ConnectionsHighlights({
  highlights,
  onHighlightClick,
  className
}: ConnectionsHighlightsProps) {
  if (highlights.length === 0) {
    return null
  }

  const getHighlightIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Star className="h-4 w-4 text-yellow-500" />
      case 'milestone':
        return <Users className="h-4 w-4 text-blue-500" />
      default:
        return <MessageCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getHighlightBadge = (type: string, metadata?: any) => {
    switch (type) {
      case 'achievement':
        return (
          <Badge variant="secondary" className="text-xs">
            Achievement
          </Badge>
        )
      case 'milestone':
        return (
          <Badge variant="outline" className="text-xs">
            Milestone
          </Badge>
        )
      default:
        return metadata?.postType && (
          <Badge variant="default" className="text-xs">
            {metadata.postType}
          </Badge>
        )
    }
  }

  return (
    <motion.div
      variants={highlightVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            From Your Network
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="max-h-[400px]">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-0"
            >
              {highlights.map((highlight) => (
                <motion.div
                  key={highlight.id}
                  variants={itemVariants}
                  className="group cursor-pointer hover:bg-muted/50 transition-colors border-b last:border-b-0"
                  onClick={() => onHighlightClick(highlight)}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {/* User Avatar */}
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={highlight.user.avatarUrl} />
                        <AvatarFallback>
                          {highlight.user.fullName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {highlight.user.fullName}
                            </span>
                            {highlight.user.verified && (
                              <Badge variant="secondary" className="text-xs px-1 py-0">
                                ✓
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {getHighlightIcon(highlight.type)}
                            {getHighlightBadge(highlight.type, highlight.metadata)}
                          </div>
                        </div>

                        {/* Content */}
                        <p className="text-sm text-foreground mb-3 line-clamp-2">
                          {highlight.content}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(new Date(highlight.timestamp), { addSuffix: true })}
                            </div>
                            {highlight.stats && (
                              <>
                                <div className="flex items-center gap-1">
                                  <Heart className="h-3 w-3" />
                                  {highlight.stats.likes}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageCircle className="h-3 w-3" />
                                  {highlight.stats.comments}
                                </div>
                              </>
                            )}
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  )
}
