"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Bookmark, Share2, Repeat2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Post } from '@/types/feed'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Animation variants
const actionVariants = {
  idle: { scale: 1 },
  hover: { 
    scale: 1.1,
    transition: { type: 'spring' as const, stiffness: 400, damping: 25 }
  },
  tap: { 
    scale: 0.95,
    transition: { type: 'spring' as const, stiffness: 400, damping: 25 }
  }
}

const likeVariants = {
  liked: { 
    scale: [1, 1.3, 1],
    color: '#ef4444',
    transition: { duration: 0.3 }
  },
  unliked: { 
    scale: 1,
    color: 'currentColor',
    transition: { duration: 0.2 }
  }
}

interface PostActionsProps {
  post: Post
  onLike: () => void
  onSave: () => void
  onRepost: () => void
  onShare: () => void
  onComment: () => void
  className?: string
}

export function PostActions({
  post,
  onLike,
  onSave,
  onRepost,
  onShare,
  onComment,
  className
}: PostActionsProps) {
  const { stats, userInteractions } = post

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex items-center gap-4">
        {/* Like Button */}
        <motion.div
          variants={actionVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onLike}
            className={cn(
              'h-8 px-2 gap-1 text-muted-foreground hover:text-red-500',
              userInteractions.liked && 'text-red-500'
            )}
            aria-label={userInteractions.liked ? 'Unlike post' : 'Like post'}
          >
            <motion.div
              variants={likeVariants}
              animate={userInteractions.liked ? 'liked' : 'unliked'}
            >
              <Heart 
                className={cn(
                  'h-4 w-4',
                  userInteractions.liked && 'fill-current'
                )} 
              />
            </motion.div>
            {stats.likes > 0 && (
              <motion.span
                key={stats.likes}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className="text-xs"
              >
                {stats.likes > 999 ? '999+' : stats.likes}
              </motion.span>
            )}
          </Button>
        </motion.div>

        {/* Comment Button */}
        <motion.div
          variants={actionVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onComment}
            className="h-8 px-2 gap-1 text-muted-foreground hover:text-blue-500"
            aria-label="Comment on post"
          >
            <MessageCircle className="h-4 w-4" />
            {stats.comments > 0 && (
              <span className="text-xs">
                {stats.comments > 999 ? '999+' : stats.comments}
              </span>
            )}
          </Button>
        </motion.div>

        {/* Repost Button */}
        <motion.div
          variants={actionVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onRepost}
            className={cn(
              'h-8 px-2 gap-1 text-muted-foreground hover:text-green-500',
              userInteractions.reposted && 'text-green-500'
            )}
            aria-label={userInteractions.reposted ? 'Undo repost' : 'Repost'}
          >
            <Repeat2 className="h-4 w-4" />
            {stats.reposts > 0 && (
              <span className="text-xs">
                {stats.reposts > 999 ? '999+' : stats.reposts}
              </span>
            )}
          </Button>
        </motion.div>

        {/* Share Button */}
        <motion.div
          variants={actionVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onShare}
            className="h-8 px-2 gap-1 text-muted-foreground hover:text-purple-500"
            aria-label="Share post"
          >
            <Share2 className="h-4 w-4" />
            {stats.shares > 0 && (
              <span className="text-xs">
                {stats.shares > 999 ? '999+' : stats.shares}
              </span>
            )}
          </Button>
        </motion.div>
      </div>

      {/* Save Button */}
      <motion.div
        variants={actionVariants}
        initial="idle"
        whileHover="hover"
        whileTap="tap"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          className={cn(
            'h-8 px-2 text-muted-foreground hover:text-yellow-500',
            userInteractions.saved && 'text-yellow-500'
          )}
          aria-label={userInteractions.saved ? 'Unsave post' : 'Save post'}
        >
          <Bookmark 
            className={cn(
              'h-4 w-4',
              userInteractions.saved && 'fill-current'
            )} 
          />
        </Button>
      </motion.div>
    </div>
  )
}
