"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  Calendar,
  Eye,
  ThumbsUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface Post {
  id: string
  title: string
  content: string
  image?: string
  createdAt: string
  updatedAt: string
  likes: number
  comments: number
  shares: number
  views: number
  tags: string[]
  visibility: 'public' | 'connections' | 'private'
  author: {
    id: string
    name: string
    avatar?: string
    role: string
  }
}

interface PostsSectionProps {
  posts: Post[]
  onAddPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'comments' | 'shares' | 'views' | 'author'>) => void
  onUpdatePost: (id: string, updates: Partial<Post>) => void
  onRemovePost: (id: string) => void
  onLikePost: (id: string) => void
  onCommentPost: (id: string, comment: string) => void
  onSharePost: (id: string) => void
  isOwnProfile?: boolean
  className?: string
}

export function PostsSection({
  posts,
  onAddPost,
  onUpdatePost,
  onRemovePost,
  onLikePost,
  onCommentPost,
  onSharePost,
  isOwnProfile = false,
  className
}: PostsSectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newPost, setNewPost] = useState<Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'comments' | 'shares' | 'views' | 'author'>>({
    title: '',
    content: '',
    image: '',
    tags: [],
    visibility: 'public'
  })
  const [commentText, setCommentText] = useState('')
  const [showComments, setShowComments] = useState<string | null>(null)

  const handleAddPost = () => {
    if (newPost.title && newPost.content) {
      onAddPost(newPost)
      setNewPost({
        title: '',
        content: '',
        image: '',
        tags: [],
        visibility: 'public'
      })
      setIsAdding(false)
    }
  }

  const handleUpdatePost = (id: string, updates: Partial<Post>) => {
    onUpdatePost(id, updates)
    setEditingId(null)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short',
      day: 'numeric'
    })
  }

  const getTimeAgo = (date: string) => {
    const now = new Date()
    const postDate = new Date(date)
    const diffTime = Math.abs(now.getTime() - postDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Posts
          </CardTitle>
          {isOwnProfile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Post Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 border rounded-lg bg-muted/50 space-y-4"
            >
              <h4 className="font-medium">Create New Post</h4>
              
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="What's on your mind?"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Share your thoughts..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Image URL (Optional)</label>
                  <Input
                    value={newPost.image}
                    onChange={(e) => setNewPost(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Visibility</label>
                  <Select
                    value={newPost.visibility}
                    onValueChange={(value: 'public' | 'connections' | 'private') => setNewPost(prev => ({ ...prev, visibility: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="connections">Connections Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Tags</label>
                <Input
                  value={newPost.tags.join(', ')}
                  onChange={(e) => setNewPost(prev => ({ 
                    ...prev, 
                    tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                  }))}
                  placeholder="e.g. technology, business, innovation"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddPost} size="sm">
                  Create Post
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAdding(false)
                    setNewPost({
                      title: '',
                      content: '',
                      image: '',
                      tags: [],
                      visibility: 'public'
                    })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts List */}
        <div className="space-y-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>
                          {post.author.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{post.author.name}</h4>
                        <p className="text-sm text-muted-foreground">{post.author.role}</p>
                        <p className="text-xs text-muted-foreground">{getTimeAgo(post.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {post.visibility}
                      </Badge>
                      {isOwnProfile && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingId(post.id)}>
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onRemovePost(post.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{post.content}</p>
                  </div>

                  {post.image && (
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Post Stats */}
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.views} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{post.likes} likes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments} comments</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share className="h-4 w-4" />
                      <span>{post.shares} shares</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onLikePost(post.id)}
                      className="flex-1"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Like
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                      className="flex-1"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Comment
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSharePost(post.id)}
                      className="flex-1"
                    >
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>

                  {/* Comments Section */}
                  <AnimatePresence>
                    {showComments === post.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 pt-4 border-t"
                      >
                        <div className="flex gap-2">
                          <Input
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && commentText.trim()) {
                                onCommentPost(post.id, commentText)
                                setCommentText('')
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={() => {
                              if (commentText.trim()) {
                                onCommentPost(post.id, commentText)
                                setCommentText('')
                              }
                            }}
                          >
                            Post
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No posts yet</p>
            {isOwnProfile && (
              <p className="text-sm">Click "Create Post" to share your thoughts</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
