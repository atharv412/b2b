"use client"

import { useState, useEffect, useRef, useCallback } from 'react'

interface UseVirtualizedListOptions {
  itemHeight: number
  containerHeight: number
  overscan?: number
}

interface VirtualizedItem {
  index: number
  top: number
  height: number
}

export function useVirtualizedList<T>(
  items: T[],
  options: UseVirtualizedListOptions
) {
  const { itemHeight, containerHeight, overscan = 5 } = options
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const visibleRange = {
    start: Math.max(0, Math.floor(scrollTop / itemHeight) - overscan),
    end: Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    )
  }

  const visibleItems: VirtualizedItem[] = []
  for (let i = visibleRange.start; i <= visibleRange.end; i++) {
    visibleItems.push({
      index: i,
      top: i * itemHeight,
      height: itemHeight
    })
  }

  const totalHeight = items.length * itemHeight

  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLDivElement
    setScrollTop(target.scrollTop)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true })
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return {
    containerRef,
    visibleItems,
    totalHeight,
    scrollTop
  }
}
