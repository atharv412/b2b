"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Comment } from '@/types/feed'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Heart, 
  Reply, 
  MoreHorizontal, 
  Send, 
  ChevronDown, 
  ChevronUp,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

// Animation variants
const commentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.2 }
  }
}

const threadVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { 
    height: 'auto', 
    opacity: 1
  },
  exit: { 
    height: 0, 
    opacity: 0
  }
}

interface CommentItemProps {
  comment: Comment
  onLike: (commentId: string) => void
  onReply: (commentId: string, content: string) => void
  onDelete?: (commentId: string) => void
  depth?: number
}

function CommentItem({ 
  comment, 
  onLike, 
  onReply, 
  onDelete, 
  depth = 0 
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [showReplies, setShowReplies] = useState(depth < 2) // Auto-expand first 2 levels

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent.trim())
      setReplyContent('')
      setIsReplying(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleReply()
    }
  }

  return (
    <motion.div
      variants={commentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        'border-l-2 border-muted pl-4',
        depth > 0 && 'ml-4'
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback>
            {comment.author.fullName.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">
              {comment.author.fullName}
            </span>
            {comment.author.verified && (
              <Badge variant="secondary" className="text-xs px-1 py-0">
                ✓
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>

          <p className="text-sm text-foreground mb-2 whitespace-pre-wrap">
            {comment.content}
          </p>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(comment.id)}
              className={cn(
                'h-6 px-2 text-xs text-muted-foreground hover:text-red-500',
                comment.userInteractions.liked && 'text-red-500'
              )}
            >
              <Heart 
                className={cn(
                  'h-3 w-3 mr-1',
                  comment.userInteractions.liked && 'fill-current'
                )} 
              />
              {comment.stats.likes > 0 && comment.stats.likes}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsReplying(!isReplying)}
              className="h-6 px-2 text-xs text-muted-foreground hover:text-blue-500"
            >
              <Reply className="h-3 w-3 mr-1" />
              Reply
            </Button>

            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(comment.id)}
                className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Reply form */}
          <AnimatePresence>
            {isReplying && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3"
              >
                <div className="flex gap-2">
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Write a reply..."
                    className="min-h-[60px] resize-none"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={handleReply}
                    disabled={!replyContent.trim()}
                    className="self-end"
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nested replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplies(!showReplies)}
                className="h-6 px-2 text-xs text-muted-foreground mb-2"
              >
                {showReplies ? (
                  <ChevronUp className="h-3 w-3 mr-1" />
                ) : (
                  <ChevronDown className="h-3 w-3 mr-1" />
                )}
                {showReplies ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
              </Button>

              <AnimatePresence>
                {showReplies && (
                  <motion.div
                    variants={threadVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-3"
                  >
                    {comment.replies.map((reply) => (
                      <CommentItem
                        key={reply.id}
                        comment={reply}
                        onLike={onLike}
                        onReply={onReply}
                        onDelete={onDelete}
                        depth={depth + 1}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

interface CommentThreadProps {
  comments: Comment[]
  onLike: (commentId: string) => void
  onReply: (commentId: string, content: string) => void
  onDelete?: (commentId: string) => void
  className?: string
}

export function CommentThread({
  comments,
  onLike,
  onReply,
  onDelete,
  className
}: CommentThreadProps) {
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitComment = async () => {
    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onReply('', newComment.trim()) // Empty string for top-level comment
      setNewComment('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmitComment()
    }
  }

  return (
    <div className={className}>
      {/* Comment composer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Write a comment..."
              className="min-h-[80px] resize-none"
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                Press Cmd+Enter to post
              </p>
              <Button
                size="sm"
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <Clock className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Send className="h-3 w-3 mr-1" />
                )}
                Post
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Comments list */}
      <ScrollArea className="max-h-[400px]">
        <motion.div
          className="space-y-4"
          variants={commentVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onLike={onLike}
                onReply={onReply}
                onDelete={onDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </ScrollArea>
    </div>
  )
}
