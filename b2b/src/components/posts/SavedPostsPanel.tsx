"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bookmark, Search, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { PostCard } from './PostCard'
import { Post } from '@/types/posts'
import { cn } from '@/lib/utils'

interface SavedPostsPanelProps {
  className?: string
}

export function SavedPostsPanel({ className }: SavedPostsPanelProps) {
  const [savedPosts, setSavedPosts] = useState<Post[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Mock saved posts data
  useEffect(() => {
    const mockSavedPosts: Post[] = [
      {
        id: 'saved1',
        author: {
          id: 'user1',
          name: 'John Doe',
          email: 'john@example.com',
          avatar: '/avatars/john.jpg',
          role: 'professional',
          sellerEnabled: true,
          verified: true
        },
        content: 'This is a really useful post about React best practices that I want to reference later.',
        type: 'text',
        status: 'published',
        audience: 'public',
        attachments: [],
        hashtags: ['react', 'bestpractices'],
        mentions: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        interactions: {
          likes: 15,
          comments: 3,
          saves: 8,
          shares: 2,
          reposts: 1
        },
        isLiked: false,
        isSaved: true,
        isReposted: false
      },
      {
        id: 'saved2',
        author: {
          id: 'user2',
          name: 'Sarah Wilson',
          email: 'sarah@example.com',
          avatar: '/avatars/sarah.jpg',
          role: 'professional',
          sellerEnabled: false,
          verified: true
        },
        content: 'Amazing conference presentation slides about modern web development trends.',
        type: 'document',
        status: 'published',
        audience: 'connections',
        attachments: [
          {
            id: 'att1',
            type: 'document',
            url: '/documents/conference-slides.pdf',
            name: 'conference-slides.pdf',
            size: 2048000,
            mimeType: 'application/pdf'
          }
        ],
        hashtags: ['webdev', 'conference', 'trends'],
        mentions: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        interactions: {
          likes: 42,
          comments: 7,
          saves: 12,
          shares: 5,
          reposts: 2
        },
        isLiked: true,
        isSaved: true,
        isReposted: false
      }
    ]

    setTimeout(() => {
      setSavedPosts(mockSavedPosts)
      setIsLoading(false)
    }, 500)
  }, [])

  const filteredPosts = savedPosts.filter(post =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleUnsave = (postId: string) => {
    setSavedPosts(prev => prev.filter(post => post.id !== postId))
  }

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-muted-foreground">Loading saved posts...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bookmark className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Saved Posts</h2>
          <Badge variant="secondary">{savedPosts.length}</Badge>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search saved posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Posts */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-8">
          <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <div className="text-muted-foreground mb-2">
            {searchQuery ? 'No saved posts match your search' : 'No saved posts yet'}
          </div>
          <div className="text-sm text-muted-foreground">
            {searchQuery ? 'Try a different search term' : 'Save posts by clicking the bookmark icon'}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <PostCard 
                post={post} 
                onPostUpdate={(updatedPost) => {
                  if (!updatedPost.isSaved) {
                    handleUnsave(updatedPost.id)
                  }
                }}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
