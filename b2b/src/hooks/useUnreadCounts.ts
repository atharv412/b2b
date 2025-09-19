import { useEffect, useState } from 'react'
import { useNav } from '@/context/NavContext'
import { UnreadCounts } from '@/types/navigation'

export function useUnreadCounts() {
  const { unreadCounts, updateUnreadCounts } = useNav()
  const [isLoading, setIsLoading] = useState(false)

  const fetchUnreadCounts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/notifications/unread-counts')
      if (response.ok) {
        const counts: UnreadCounts = await response.json()
        updateUnreadCounts(counts)
      }
    } catch (error) {
      console.error('Failed to fetch unread counts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = (type: 'notifications' | 'chat', id?: string) => {
    if (type === 'notifications') {
      updateUnreadCounts({ 
        notifications: Math.max(0, unreadCounts.notifications - 1) 
      })
    } else if (type === 'chat') {
      updateUnreadCounts({ 
        chat: Math.max(0, unreadCounts.chat - 1) 
      })
    }
  }

  const markAllAsRead = (type: 'notifications' | 'chat') => {
    if (type === 'notifications') {
      updateUnreadCounts({ notifications: 0 })
    } else if (type === 'chat') {
      updateUnreadCounts({ chat: 0 })
    }
  }

  // Subscribe to real-time updates (stub for websocket integration)
  useEffect(() => {
    // In a real app, you would subscribe to websocket events here
    // Example:
    // const unsubscribe = subscribeToUnreadCounts((counts) => {
    //   updateUnreadCounts(counts)
    // })
    // return unsubscribe
  }, [updateUnreadCounts])

  return {
    unreadCounts,
    isLoading,
    fetchUnreadCounts,
    markAsRead,
    markAllAsRead
  }
}

// Stub function for websocket subscription
export function subscribeToUnreadCounts(
  callback: (counts: UnreadCounts) => void
): () => void {
  // This would be implemented with actual websocket connection
  console.log('Subscribing to unread counts updates...')
  
  // Return unsubscribe function
  return () => {
    console.log('Unsubscribing from unread counts updates...')
  }
}
