"use client"

import React, { createContext, useContext, useReducer, useCallback } from 'react'
import { Post, FeedState, FeedActions } from '@/types/feed'

// Initial state
const initialState: FeedState = {
  posts: [],
  loading: false,
  error: null,
  hasMore: true,
  filters: {
    search: '',
    postType: 'all',
    connectionsOnly: false,
    marketplaceResults: false,
    sort: 'recent'
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0
  }
}

// Action types
type FeedAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_POSTS'; payload: Post[] }
  | { type: 'ADD_POSTS'; payload: Post[] }
  | { type: 'SET_HAS_MORE'; payload: boolean }
  | { type: 'SET_FILTERS'; payload: Partial<FeedState['filters']> }
  | { type: 'SET_PAGINATION'; payload: Partial<FeedState['pagination']> }
  | { type: 'UPDATE_POST'; payload: { id: string; updates: Partial<Post> } }
  | { type: 'LIKE_POST'; payload: string }
  | { type: 'SAVE_POST'; payload: string }
  | { type: 'REPOST'; payload: string }

// Reducer
function feedReducer(state: FeedState, action: FeedAction): FeedState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'SET_POSTS':
      return { ...state, posts: action.payload }
    
    case 'ADD_POSTS':
      return { ...state, posts: [...state.posts, ...action.payload] }
    
    case 'SET_HAS_MORE':
      return { ...state, hasMore: action.payload }
    
    case 'SET_FILTERS':
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, page: 1 }
      }
    
    case 'SET_PAGINATION':
      return { ...state, pagination: { ...state.pagination, ...action.payload } }
    
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.id
            ? { ...post, ...action.payload.updates }
            : post
        )
      }
    
    case 'LIKE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload
            ? {
                ...post,
                userInteractions: {
                  ...post.userInteractions,
                  liked: !post.userInteractions.liked
                },
                stats: {
                  ...post.stats,
                  likes: post.userInteractions.liked 
                    ? post.stats.likes - 1 
                    : post.stats.likes + 1
                }
              }
            : post
        )
      }
    
    case 'SAVE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload
            ? {
                ...post,
                userInteractions: {
                  ...post.userInteractions,
                  saved: !post.userInteractions.saved
                }
              }
            : post
        )
      }
    
    case 'REPOST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload
            ? {
                ...post,
                userInteractions: {
                  ...post.userInteractions,
                  reposted: !post.userInteractions.reposted
                },
                stats: {
                  ...post.stats,
                  reposts: post.userInteractions.reposted 
                    ? post.stats.reposts - 1 
                    : post.stats.reposts + 1
                }
              }
            : post
        )
      }
    
    default:
      return state
  }
}

// Context
const FeedContext = createContext<{
  state: FeedState
  actions: FeedActions
} | null>(null)

// Provider
export function FeedProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(feedReducer, initialState)

  const fetchPosts = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })

      const { filters, pagination } = state
      const params = new URLSearchParams()
      
      // Add filter parameters
      if (filters.search) params.append('search', filters.search)
      if (filters.postType !== 'all') params.append('postType', filters.postType)
      if (filters.connectionsOnly) params.append('connectionsOnly', 'true')
      if (filters.marketplaceResults) params.append('marketplaceResults', 'true')
      if (filters.sort !== 'recent') params.append('sort', filters.sort)
      
      // Add pagination parameters
      params.append('page', page.toString())
      params.append('limit', pagination.limit.toString())

      const response = await fetch(`/api/feed?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }

      const data = await response.json()
      
      if (append) {
        dispatch({ type: 'ADD_POSTS', payload: data.posts })
      } else {
        dispatch({ type: 'SET_POSTS', payload: data.posts })
      }
      
      dispatch({ type: 'SET_HAS_MORE', payload: data.pagination.hasMore })
      dispatch({ type: 'SET_PAGINATION', payload: { page: data.pagination.page, total: data.pagination.total } })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [state.filters, state.pagination.limit])

  const loadMore = useCallback(() => {
    if (!state.loading && state.hasMore) {
      fetchPosts(state.pagination.page + 1, true)
    }
  }, [state.loading, state.hasMore, state.pagination.page, fetchPosts])

  const refresh = useCallback(() => {
    fetchPosts(1, false)
  }, [fetchPosts])

  const setFilters = useCallback((filters: Partial<FeedState['filters']>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters })
    // Refetch posts with new filters
    setTimeout(() => fetchPosts(1, false), 0)
  }, [fetchPosts])

  const likePost = useCallback((postId: string) => {
    dispatch({ type: 'LIKE_POST', payload: postId })
    // TODO: Make API call to like post
  }, [])

  const savePost = useCallback((postId: string) => {
    dispatch({ type: 'SAVE_POST', payload: postId })
    // TODO: Make API call to save post
  }, [])

  const repost = useCallback((postId: string) => {
    dispatch({ type: 'REPOST', payload: postId })
    // TODO: Make API call to repost
  }, [])

  const sharePost = useCallback((postId: string) => {
    // TODO: Implement share functionality
    console.log('Sharing post:', postId)
  }, [])

  const addComment = useCallback((postId: string, content: string) => {
    // TODO: Make API call to add comment
    console.log('Adding comment to post:', postId, content)
  }, [])

  const likeComment = useCallback((commentId: string) => {
    // TODO: Make API call to like comment
    console.log('Liking comment:', commentId)
  }, [])

  const actions: FeedActions = {
    loadMore,
    refresh,
    setFilters,
    likePost,
    savePost,
    repost,
    sharePost,
    addComment,
    likeComment
  }

  return (
    <FeedContext.Provider value={{ state, actions }}>
      {children}
    </FeedContext.Provider>
  )
}

// Hook
export function useFeed() {
  const context = useContext(FeedContext)
  if (!context) {
    throw new Error('useFeed must be used within a FeedProvider')
  }
  return context
}
