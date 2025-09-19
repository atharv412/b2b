"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Post } from '@/types/feed'
import { useFeed } from '@/context/FeedContext'
import { PostActions } from './PostActions'
import { CommentThread } from './CommentThread'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MoreHorizontal, 
  MapPin, 
  Calendar,
  ExternalLink,
  Play,
  Image as ImageIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
}

interface PostCardProps {
  post: Post
  onMediaClick?: (media: any[], index: number) => void
  className?: string
}

export function PostCard({ post, onMediaClick, className }: PostCardProps) {
  const { actions } = useFeed()
  const [showComments, setShowComments] = useState(false)

  const handleLike = () => {
    actions.likePost(post.id)
  }

  const handleSave = () => {
    actions.savePost(post.id)
  }

  const handleRepost = () => {
    actions.repost(post.id)
  }

  const handleShare = () => {
    actions.sharePost(post.id)
  }

  const handleComment = () => {
    setShowComments(!showComments)
  }

  const handleMediaClick = (index: number) => {
    if (onMediaClick && post.media.length > 0) {
      onMediaClick(post.media, index)
    }
  }

  const renderMedia = () => {
    if (post.media.length === 0) return null

    return (
      <div className="mt-3 space-y-2">
        {post.media.map((media, index) => (
          <div
            key={media.id}
            className="relative group cursor-pointer rounded-lg overflow-hidden bg-muted"
            onClick={() => handleMediaClick(index)}
          >
            <div className="aspect-video flex items-center justify-center">
              {media.type === 'image' ? (
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                    <Play className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Play
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.avatar} alt={post.author.fullName} />
                <AvatarFallback>
                  {post.author.fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">
                    {post.author.fullName}
                  </span>
                  {post.author.verified && (
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      ✓
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{post.author.username}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>

            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Post Content */}
          <div className="space-y-3">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>

            {/* Hashtags */}
            {post.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {post.hashtags.map((hashtag, index) => (
                  <span
                    key={index}
                    className="text-blue-500 hover:text-blue-600 cursor-pointer text-sm"
                  >
                    {hashtag}
                  </span>
                ))}
              </div>
            )}

            {/* Media */}
            {renderMedia()}

            {/* Location */}
            {post.location && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{post.location}</span>
              </div>
            )}
          </div>

          {/* Post Actions */}
          <div className="mt-4 pt-3 border-t">
            <PostActions
              post={post}
              onLike={handleLike}
              onSave={handleSave}
              onRepost={handleRepost}
              onShare={handleShare}
              onComment={handleComment}
            />
          </div>

          {/* Comments */}
          {showComments && (
            <div className="mt-4 pt-3 border-t">
              <CommentThread
                comments={[]} // TODO: Fetch comments from API
                onLike={() => {}} // TODO: Implement comment like
                onReply={() => {}} // TODO: Implement comment reply
              />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
