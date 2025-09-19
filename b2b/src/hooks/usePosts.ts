"use client"

import { useState, useCallback } from 'react'
import { postService } from '@/services/postService'
import type { 
  PostsResponse, 
  Post, 
  PostFilters, 
  PostSearchParams,
  InteractionResponse 
} from '@/types/posts'

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)

  // Load posts
  const loadPosts = useCallback(async (params: PostSearchParams = {
    query: '',
    filters: {},
    sortBy: 'recent',
    limit: 20,
    offset: 0
  }) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await postService.getPosts({
        limit: params.limit,
        offset: params.offset,
        type: params.filters.type,
        audience: params.filters.audience,
        hashtags: params.filters.hashtags,
        author: params.filters.author,
        sortBy: params.sortBy
      })

      setPosts(response.posts)
      setHasMore(response.hasMore)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load posts')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load more posts
  const loadMorePosts = useCallback(async (params: PostSearchParams) => {
    if (!hasMore || isLoading) return

    setIsLoading(true)
    try {
      const response = await postService.getPosts({
        limit: params.limit,
        offset: posts.length,
        type: params.filters.type,
        audience: params.filters.audience,
        hashtags: params.filters.hashtags,
        author: params.filters.author,
        sortBy: params.sortBy
      })

      setPosts(prev => [...prev, ...response.posts])
      setHasMore(response.hasMore)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load more posts')
    } finally {
      setIsLoading(false)
    }
  }, [hasMore, isLoading, posts.length])

  // Toggle like
  const toggleLike = useCallback(async (postId: string): Promise<InteractionResponse> => {
    try {
      const response = await postService.toggleLike(postId)
      
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              interactions: response.interactions 
            }
          : post
      ))

      return response
    } catch (error) {
      throw new Error('Failed to toggle like')
    }
  }, [])

  // Toggle save
  const toggleSave = useCallback(async (postId: string): Promise<InteractionResponse> => {
    try {
      const response = await postService.toggleSave(postId)
      
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isSaved: !post.isSaved,
              interactions: response.interactions 
            }
          : post
      ))

      return response
    } catch (error) {
      throw new Error('Failed to toggle save')
    }
  }, [])

  // Toggle repost
  const toggleRepost = useCallback(async (postId: string): Promise<InteractionResponse> => {
    try {
      const response = await postService.toggleRepost(postId)
      
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isReposted: !post.isReposted,
              interactions: response.interactions 
            }
          : post
      ))

      return response
    } catch (error) {
      throw new Error('Failed to toggle repost')
    }
  }, [])

  // Share post
  const sharePost = useCallback(async (postId: string): Promise<InteractionResponse> => {
    try {
      const response = await postService.sharePost(postId)
      
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              interactions: response.interactions 
            }
          : post
      ))

      return response
    } catch (error) {
      throw new Error('Failed to share post')
    }
  }, [])

  // Add new post (optimistic update)
  const addPost = useCallback((post: Post) => {
    setPosts(prev => [post, ...prev])
  }, [])

  // Update post
  const updatePost = useCallback((postId: string, updates: Partial<Post>) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, ...updates }
        : post
    ))
  }, [])

  // Remove post
  const removePost = useCallback((postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId))
  }, [])

  return {
    posts,
    isLoading,
    error,
    hasMore,
    loadPosts,
    loadMorePosts,
    toggleLike,
    toggleSave,
    toggleRepost,
    sharePost,
    addPost,
    updatePost,
    removePost
  }
}
