"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Post } from '@/types/feed'
import { useFeed } from '@/context/FeedContext'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { PostCard } from './PostCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, AlertCircle } from 'lucide-react'

// Animation variants
const feedListVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06
    }
  }
}

const skeletonVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  }
}

// Skeleton component for loading states
function PostSkeleton() {
  return (
    <motion.div
      variants={skeletonVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="space-y-2 mb-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </Card>
    </motion.div>
  )
}

// Empty state component
function EmptyState() {
  return (
    <motion.div
      className="text-center py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md mx-auto">
        <div className="h-24 w-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <RefreshCw className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
        <p className="text-muted-foreground mb-4">
          Try following topics or connections to see posts in your feed.
        </p>
        <Button>
          Explore Trending
        </Button>
      </div>
    </motion.div>
  )
}

// Error state component
function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <motion.div
      className="text-center py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md mx-auto">
        <div className="h-24 w-24 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
        <p className="text-muted-foreground mb-4">
          {error}
        </p>
        <Button onClick={onRetry}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    </motion.div>
  )
}

interface FeedStreamProps {
  className?: string
}

export function FeedStream({ className }: FeedStreamProps) {
  const { state, actions } = useFeed()
  const { loadMoreRef } = useInfiniteScroll({
    hasMore: state.hasMore,
    loading: state.loading,
    onLoadMore: actions.loadMore
  })

  const handleRefresh = () => {
    actions.refresh()
  }

  // Show loading state on initial load
  if (state.loading && state.posts.length === 0) {
    return (
      <div className={className}>
        <motion.div
          className="space-y-4"
          variants={feedListVariants}
          initial="hidden"
          animate="visible"
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <PostSkeleton key={index} />
          ))}
        </motion.div>
      </div>
    )
  }

  // Show error state
  if (state.error && state.posts.length === 0) {
    return (
      <div className={className}>
        <ErrorState error={state.error} onRetry={handleRefresh} />
      </div>
    )
  }

  // Show empty state
  if (!state.loading && state.posts.length === 0) {
    return (
      <div className={className}>
        <EmptyState />
      </div>
    )
  }

  return (
    <div className={className}>
      <motion.div
        className="space-y-4"
        variants={feedListVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {state.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </AnimatePresence>

        {/* Loading more indicator */}
        {state.loading && state.posts.length > 0 && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 2 }).map((_, index) => (
              <PostSkeleton key={`loading-${index}`} />
            ))}
          </motion.div>
        )}

        {/* Load more trigger */}
        {state.hasMore && !state.loading && (
          <div ref={loadMoreRef} className="h-4" />
        )}

        {/* End of feed indicator */}
        {!state.hasMore && state.posts.length > 0 && (
          <motion.div
            className="text-center py-8 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm">You've reached the end of your feed</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
