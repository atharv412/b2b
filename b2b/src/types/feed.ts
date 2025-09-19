export interface User {
  id: string
  fullName: string
  username: string
  avatar?: string
  verified: boolean
}

export interface Post {
  id: string
  content: string
  author: User
  createdAt: string
  updatedAt: string
  type: 'text' | 'image' | 'video' | 'product'
  media: MediaItem[]
  hashtags: string[]
  mentions: string[]
  stats: {
    likes: number
    comments: number
    shares: number
    reposts: number
  }
  userInteractions: {
    liked: boolean
    saved: boolean
    reposted: boolean
  }
  visibility: 'public' | 'followers' | 'private'
  location?: string
}

export interface Comment {
  id: string
  content: string
  author: User
  createdAt: string
  updatedAt: string
  postId: string
  parentId?: string
  replies?: Comment[]
  stats: {
    likes: number
  }
  userInteractions: {
    liked: boolean
  }
}

export interface MediaItem {
  id: string
  type: 'image' | 'video'
  url: string
  alt?: string
  thumbnail?: string
}

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  imageUrl: string
  rating: number
  reviewCount: number
  seller: {
    id: string
    name: string
    verified: boolean
  }
  badge?: string
  userInteractions: {
    liked: boolean
    saved: boolean
  }
}

export interface FeedState {
  posts: Post[]
  loading: boolean
  error: string | null
  hasMore: boolean
  filters: {
    search: string
    postType: 'all' | 'media' | 'text' | 'product'
    connectionsOnly: boolean
    marketplaceResults: boolean
    sort: 'trending' | 'recent' | 'relevant'
  }
  pagination: {
    page: number
    limit: number
    total: number
  }
}

export interface FeedActions {
  loadMore: () => void
  refresh: () => void
  setFilters: (filters: Partial<FeedState['filters']>) => void
  likePost: (postId: string) => void
  savePost: (postId: string) => void
  repost: (postId: string) => void
  sharePost: (postId: string) => void
  addComment: (postId: string, content: string) => void
  likeComment: (commentId: string) => void
}
