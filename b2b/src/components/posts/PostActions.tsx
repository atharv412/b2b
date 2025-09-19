"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Repeat2 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PostInteractions } from '@/types/posts'
import { cn } from '@/lib/utils'

interface PostActionsProps {
  interactions: PostInteractions
  isLiked: boolean
  isSaved: boolean
  isReposted: boolean
  onLike: () => void
  onComment: () => void
  onSave: () => void
  onShare: () => void
  onRepost: () => void
  className?: string
}

export function PostActions({
  interactions,
  isLiked,
  isSaved,
  isReposted,
  onLike,
  onComment,
  onSave,
  onShare,
  onRepost,
  className
}: PostActionsProps) {
  return (
    <div className={cn("flex items-center justify-between pt-3 border-t", className)}>
      <div className="flex items-center gap-4">
        {/* Like Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onLike}
            className={cn(
              "gap-2 h-8 px-3",
              isLiked && "text-red-500 hover:text-red-600"
            )}
          >
            <motion.div
              animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
            </motion.div>
            <span className="text-sm">{interactions.likes}</span>
          </Button>
        </motion.div>

        {/* Comment Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onComment}
            className="gap-2 h-8 px-3"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm">{interactions.comments}</span>
          </Button>
        </motion.div>

        {/* Repost Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onRepost}
            className={cn(
              "gap-2 h-8 px-3",
              isReposted && "text-green-500 hover:text-green-600"
            )}
          >
            <Repeat2 className={cn("h-4 w-4", isReposted && "fill-current")} />
            <span className="text-sm">{interactions.reposts}</span>
          </Button>
        </motion.div>

        {/* Share Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onShare}
            className="gap-2 h-8 px-3"
          >
            <Share2 className="h-4 w-4" />
            <span className="text-sm">{interactions.shares}</span>
          </Button>
        </motion.div>
      </div>

      {/* Save Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          className={cn(
            "gap-2 h-8 px-3",
            isSaved && "text-blue-500 hover:text-blue-600"
          )}
        >
          <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
          <span className="text-sm">{interactions.saves}</span>
        </Button>
      </motion.div>
    </div>
  )
}
