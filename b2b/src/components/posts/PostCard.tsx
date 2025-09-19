"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Repeat2, 
  MoreHorizontal,
  ExternalLink,
  ShoppingBag,
  CheckCircle,
  AlertCircle,
  Flag,
  Eye,
  FileText,
  Video
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { PostActions } from './PostActions'
import { CommentThread } from './CommentThread'
import { usePosts } from '@/hooks/usePosts'
import { Post } from '@/types/posts'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

interface PostCardProps {
  post: Post
  onPostUpdate?: (post: Post) => void
  className?: string
}

export function PostCard({ post, onPostUpdate, className }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [isSaved, setIsSaved] = useState(post.isSaved)
  const [isReposted, setIsReposted] = useState(post.isReposted)
  const [interactions, setInteractions] = useState(post.interactions)

  const { toggleLike, toggleSave, toggleRepost, sharePost } = usePosts()

  const handleLike = async () => {
    try {
      const response = await toggleLike(post.id)
      setIsLiked(!isLiked)
      setInteractions(response.interactions)
      onPostUpdate?.({
        ...post,
        isLiked: !isLiked,
        interactions: response.interactions
      })
    } catch (error) {
      console.error('Failed to toggle like:', error)
    }
  }

  const handleSave = async () => {
    try {
      const response = await toggleSave(post.id)
      setIsSaved(!isSaved)
      setInteractions(response.interactions)
      onPostUpdate?.({
        ...post,
        isSaved: !isSaved,
        interactions: response.interactions
      })
    } catch (error) {
      console.error('Failed to toggle save:', error)
    }
  }

  const handleRepost = async () => {
    try {
      const response = await toggleRepost(post.id)
      setIsReposted(!isReposted)
      setInteractions(response.interactions)
      onPostUpdate?.({
        ...post,
        isReposted: !isReposted,
        interactions: response.interactions
      })
    } catch (error) {
      console.error('Failed to toggle repost:', error)
    }
  }

  const handleShare = async () => {
    try {
      const response = await sharePost(post.id)
      setInteractions(response.interactions)
      onPostUpdate?.({
        ...post,
        interactions: response.interactions
      })
    } catch (error) {
      console.error('Failed to share:', error)
    }
  }

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case 'public': return <ExternalLink className="h-3 w-3" />
      case 'connections': return <MessageCircle className="h-3 w-3" />
      case 'specific': return <CheckCircle className="h-3 w-3" />
      case 'groups': return <MoreHorizontal className="h-3 w-3" />
      case 'product': return <ShoppingBag className="h-3 w-3" />
      default: return null
    }
  }

  const getAudienceColor = (audience: string) => {
    switch (audience) {
      case 'public': return 'text-blue-600'
      case 'connections': return 'text-green-600'
      case 'specific': return 'text-purple-600'
      case 'groups': return 'text-orange-600'
      case 'product': return 'text-pink-600'
      default: return 'text-muted-foreground'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-background border rounded-lg p-4 space-y-4",
        post.moderation?.isHidden && "opacity-50",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.author.avatar} />
          <AvatarFallback>
            {post.author.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold truncate">{post.author.name}</h4>
            {post.author.verified && (
              <CheckCircle className="h-4 w-4 text-blue-500" />
            )}
            <Badge variant="secondary" className="text-xs">
              {post.author.role}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
            <span>•</span>
            <div className={cn("flex items-center gap-1", getAudienceColor(post.audience))}>
              {getAudienceIcon(post.audience)}
              <span className="capitalize">{post.audience}</span>
            </div>
            {post.type !== 'text' && (
              <>
                <span>•</span>
                <Badge variant="outline" className="text-xs capitalize">
                  {post.type}
                </Badge>
              </>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bookmark className="h-4 w-4 mr-2" />
              {isSaved ? 'Unsave' : 'Save'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Flag className="h-4 w-4 mr-2" />
              Report
            </DropdownMenuItem>
            {post.moderation?.isHidden && (
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                Show Post
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div className="prose prose-sm max-w-none">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Hashtags and Mentions */}
        {(post.hashtags.length > 0 || post.mentions.length > 0) && (
          <div className="flex flex-wrap gap-1">
            {post.hashtags.map((hashtag) => (
              <Badge key={hashtag} variant="secondary" className="text-xs">
                #{hashtag}
              </Badge>
            ))}
            {post.mentions.map((mention) => (
              <Badge key={mention} variant="outline" className="text-xs">
                @{mention}
              </Badge>
            ))}
          </div>
        )}

        {/* Attachments */}
        {post.attachments.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {post.attachments.map((attachment) => (
              <div key={attachment.id} className="relative group">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  {attachment.type === 'image' ? (
                    <img
                      src={attachment.url}
                      alt={attachment.name}
                      className="w-full h-full object-cover"
                    />
                  ) : attachment.type === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="h-8 w-8 text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <PostActions
        interactions={interactions}
        isLiked={isLiked}
        isSaved={isSaved}
        isReposted={isReposted}
        onLike={handleLike}
        onComment={() => setShowComments(!showComments)}
        onSave={handleSave}
        onShare={handleShare}
        onRepost={handleRepost}
      />

      {/* Comments */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CommentThread postId={post.id} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Moderation Notice */}
      {post.moderation?.isFlagged && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <span className="text-sm text-yellow-800">
            This post has been flagged for review
          </span>
        </div>
      )}
    </motion.div>
  )
}
