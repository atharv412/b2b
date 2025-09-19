"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, 
  Reply, 
  MoreHorizontal,
  Send,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { postService } from '@/services/postService'
import { Comment } from '@/types/posts'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

interface CommentThreadProps {
  postId: string
  className?: string
}

export function CommentThread({ postId, className }: CommentThreadProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Mock comments data
  useEffect(() => {
    const mockComments: Comment[] = [
      {
        id: '1',
        postId,
        author: {
          id: 'user1',
          name: 'John Doe',
          email: 'john@example.com',
          avatar: '/avatars/john.jpg',
          role: 'professional',
          sellerEnabled: true,
          verified: true
        },
        content: 'Great post! This is exactly what we needed for our project.',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        isLiked: false,
        likes: 3,
        replies: [
          {
            id: '1-1',
            postId,
            author: {
              id: 'user2',
              name: 'Sarah Wilson',
              email: 'sarah@example.com',
              avatar: '/avatars/sarah.jpg',
              role: 'professional',
              sellerEnabled: false,
              verified: true
            },
            content: 'I agree! The implementation looks solid.',
            parentId: '1',
            createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            isLiked: true,
            likes: 1,
            replies: []
          }
        ]
      },
      {
        id: '2',
        postId,
        author: {
          id: 'user3',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          avatar: '/avatars/mike.jpg',
          role: 'professional',
          sellerEnabled: true,
          verified: false
        },
        content: 'Could you share more details about the technical implementation?',
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        isLiked: false,
        likes: 0,
        replies: []
      }
    ]

    setTimeout(() => {
      setComments(mockComments)
      setIsLoading(false)
    }, 500)
  }, [postId])

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      const comment = await postService.addComment(postId, newComment, replyingTo || undefined)
      
      if (replyingTo) {
        // Add as reply to existing comment
        setComments(prev => prev.map(c => 
          c.id === replyingTo 
            ? { ...c, replies: [...c.replies, comment] }
            : c
        ))
      } else {
        // Add as top-level comment
        setComments(prev => [comment, ...prev])
      }
      
      setNewComment('')
      setReplyingTo(null)
    } catch (error) {
      console.error('Failed to add comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmitComment()
    }
  }

  const renderComment = (comment: Comment, isReply = false) => (
    <motion.div
      key={comment.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "space-y-2",
        isReply && "ml-8 border-l-2 border-muted pl-4"
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback>
            {comment.author.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h5 className="font-medium text-sm">{comment.author.name}</h5>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mt-1">
            {comment.content}
          </p>

          <div className="flex items-center gap-4 mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
            >
              <Heart className="h-3 w-3 mr-1" />
              {comment.likes}
            </Button>
            
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setReplyingTo(comment.id)}
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Report</DropdownMenuItem>
                <DropdownMenuItem>Copy Link</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Render replies */}
      {comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map(reply => renderComment(reply, true))}
        </div>
      )}
    </motion.div>
  )

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Comment Input */}
      <div className="space-y-3">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
          className="min-h-[80px] resize-none"
        />
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Press Ctrl+Enter to post
          </div>
          
          <div className="flex items-center gap-2">
            {replyingTo && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReplyingTo(null)}
              >
                Cancel
              </Button>
            )}
            
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || isSubmitting}
              size="sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        <AnimatePresence>
          {comments.map(comment => renderComment(comment))}
        </AnimatePresence>
      </div>

      {/* Load More Comments */}
      {comments.length > 0 && (
        <div className="text-center">
          <Button variant="outline" size="sm">
            Load more comments
          </Button>
        </div>
      )}
    </div>
  )
}
