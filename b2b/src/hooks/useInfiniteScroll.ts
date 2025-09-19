import { useEffect, useCallback, useRef } from 'react'

interface UseInfiniteScrollOptions {
  hasMore: boolean
  loading: boolean
  onLoadMore: () => void
  threshold?: number
  rootMargin?: string
}

export function useInfiniteScroll({
  hasMore,
  loading,
  onLoadMore,
  threshold = 0.1,
  rootMargin = '100px'
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const loadMoreCallback = useCallback(() => {
    if (hasMore && !loading) {
      onLoadMore()
    }
  }, [hasMore, loading, onLoadMore])

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && hasMore && !loading) {
          loadMoreCallback()
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [loadMoreCallback, hasMore, loading, threshold, rootMargin])

  return { loadMoreRef }
}
