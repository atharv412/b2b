"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  X,
  Hash,
  Users,
  ShoppingBag,
  Calendar,
  Image,
  Video,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { PostComposer } from './PostComposer'
import { PostCard } from './PostCard'
import { SavedPostsPanel } from './SavedPostsPanel'
import { usePosts } from '@/hooks/usePosts'
import { Post, PostFilters } from '@/types/posts'
import { cn } from '@/lib/utils'

interface FeedProps {
  className?: string
}

export function Feed({ className }: FeedProps) {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<PostFilters>({})
  const [showFilters, setShowFilters] = useState(false)
  const [showComposer, setShowComposer] = useState(false)

  const { 
    posts, 
    isLoading, 
    error, 
    hasMore, 
    loadPosts, 
    loadMorePosts, 
    addPost 
  } = usePosts()

  // Load posts on mount
  useEffect(() => {
    loadPosts({
      query: searchQuery,
      filters,
      sortBy: 'recent',
      limit: 20,
      offset: 0
    })
  }, [loadPosts, searchQuery, filters])

  const handlePostCreated = (post: Post) => {
    addPost(post)
    setShowComposer(false)
  }

  const handleFilterChange = (key: keyof PostFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({})
    setSearchQuery('')
  }

  const getFilterCount = () => {
    return Object.values(filters).filter(Boolean).length
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Feed</h1>
          <p className="text-muted-foreground">Stay updated with your network</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {getFilterCount() > 0 && (
              <Badge variant="secondary" className="ml-1">
                {getFilterCount()}
              </Badge>
            )}
          </Button>
          
          <PostComposer
            trigger={
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Post
              </Button>
            }
            onPostCreated={handlePostCreated}
          />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts, hashtags, or people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 p-4 border rounded-lg bg-muted/50"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Post Type</label>
                  <Select
                    value={filters.type || 'all'}
                    onValueChange={(value) => handleFilterChange('type', value === 'all' ? undefined : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="poll">Poll</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Audience</label>
                  <Select
                    value={filters.audience || 'all'}
                    onValueChange={(value) => handleFilterChange('audience', value === 'all' ? undefined : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All audiences" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Audiences</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="connections">Connections</SelectItem>
                      <SelectItem value="specific">Specific People</SelectItem>
                      <SelectItem value="groups">Groups</SelectItem>
                      <SelectItem value="product">Product-linked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Content</label>
                  <Select
                    value={filters.hasAttachments ? 'with' : filters.hasAttachments === false ? 'without' : 'all'}
                    onValueChange={(value) => handleFilterChange('hasAttachments', value === 'all' ? undefined : value === 'with')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All content" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Content</SelectItem>
                      <SelectItem value="with">With Attachments</SelectItem>
                      <SelectItem value="without">Text Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Feed Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <FeedContent 
            posts={posts}
            isLoading={isLoading}
            error={error}
            hasMore={hasMore}
            onLoadMore={() => loadMorePosts({
              query: searchQuery,
              filters,
              sortBy: 'recent',
              limit: 20,
              offset: posts.length
            })}
          />
        </TabsContent>

        <TabsContent value="following" className="space-y-4">
          <FeedContent 
            posts={posts.filter(post => post.audience === 'connections')}
            isLoading={isLoading}
            error={error}
            hasMore={false}
          />
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <FeedContent 
            posts={posts.filter(post => post.interactions.likes > 10)}
            isLoading={isLoading}
            error={error}
            hasMore={false}
          />
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <SavedPostsPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface FeedContentProps {
  posts: Post[]
  isLoading: boolean
  error: string | null
  hasMore: boolean
  onLoadMore?: () => void
}

function FeedContent({ posts, isLoading, error, hasMore, onLoadMore }: FeedContentProps) {
  if (isLoading && posts.length === 0) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-background border rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                <div className="h-3 w-24 bg-muted rounded animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-destructive mb-2">Error loading posts</div>
        <div className="text-sm text-muted-foreground">{error}</div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground mb-4">No posts found</div>
        <Button onClick={() => window.location.reload()}>
          Refresh Feed
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.05 }}
          >
            <PostCard post={post} />
          </motion.div>
        ))}
      </AnimatePresence>

      {hasMore && onLoadMore && (
        <div className="text-center">
          <Button variant="outline" onClick={onLoadMore} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Load More Posts'}
          </Button>
        </div>
      )}
    </div>
  )
}
