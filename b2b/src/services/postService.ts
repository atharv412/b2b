import type {
  PostsResponse,
  CreatePostRequest,
  CreatePostResponse,
  InteractionRequest,
  InteractionResponse,
  Post,
  Comment,
  MentionSuggestion,
  HashtagSuggestion,
  DraftPost
} from '@/types/posts'

// Simulated delay for realistic UX testing
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

class PostService {
  private baseUrl = '/api/posts'

  /**
   * Get posts feed
   * GET /api/posts
   */
  async getPosts(params: {
    limit?: number
    offset?: number
    type?: string
    audience?: string
    hashtags?: string[]
    author?: string
    sortBy?: 'recent' | 'popular' | 'trending'
  } = {}): Promise<PostsResponse> {
    await delay(800)

    try {
      const queryParams = new URLSearchParams()
      if (params.limit) queryParams.set('limit', params.limit.toString())
      if (params.offset) queryParams.set('offset', params.offset.toString())
      if (params.type) queryParams.set('type', params.type)
      if (params.audience) queryParams.set('audience', params.audience)
      if (params.author) queryParams.set('author', params.author)
      if (params.sortBy) queryParams.set('sortBy', params.sortBy)
      if (params.hashtags) queryParams.set('hashtags', params.hashtags.join(','))

      const response = await fetch(`${this.baseUrl}?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }

      return await response.json()
    } catch (error) {
      // Return mock data for demo
      return this.getMockPosts(params)
    }
  }

  /**
   * Create a new post
   * POST /api/posts
   */
  async createPost(data: CreatePostRequest): Promise<CreatePostResponse> {
    await delay(1200)

    try {
      const formData = new FormData()
      formData.append('content', data.content)
      formData.append('type', data.type)
      formData.append('audience', data.audience)
      
      if (data.audienceDetails) {
        formData.append('audienceDetails', JSON.stringify(data.audienceDetails))
      }
      
      if (data.hashtags) {
        formData.append('hashtags', JSON.stringify(data.hashtags))
      }
      
      if (data.mentions) {
        formData.append('mentions', JSON.stringify(data.mentions))
      }

      if (data.attachments) {
        data.attachments.forEach((file, index) => {
          formData.append(`attachment_${index}`, file)
        })
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to create post')
      }

      return await response.json()
    } catch (error) {
      // Return mock response for demo
      return this.getMockCreatePostResponse(data)
    }
  }

  /**
   * Like/unlike a post
   * POST /api/posts/:id/like
   */
  async toggleLike(postId: string): Promise<InteractionResponse> {
    await delay(300)

    try {
      const response = await fetch(`${this.baseUrl}/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to toggle like')
      }

      return await response.json()
    } catch (error) {
      // Return mock response
      return {
        success: true,
        interactions: {
          likes: Math.floor(Math.random() * 100) + 1,
          comments: Math.floor(Math.random() * 20),
          saves: Math.floor(Math.random() * 10),
          shares: Math.floor(Math.random() * 5),
          reposts: Math.floor(Math.random() * 3)
        }
      }
    }
  }

  /**
   * Add a comment
   * POST /api/posts/:id/comment
   */
  async addComment(postId: string, content: string, parentId?: string): Promise<Comment> {
    await delay(500)

    try {
      const response = await fetch(`${this.baseUrl}/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, parentId }),
      })

      if (!response.ok) {
        throw new Error('Failed to add comment')
      }

      return await response.json()
    } catch (error) {
      // Return mock comment
      return this.getMockComment(postId, content, parentId)
    }
  }

  /**
   * Save/unsave a post
   * POST /api/posts/:id/save
   */
  async toggleSave(postId: string): Promise<InteractionResponse> {
    await delay(300)

    try {
      const response = await fetch(`${this.baseUrl}/${postId}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to toggle save')
      }

      return await response.json()
    } catch (error) {
      return {
        success: true,
        interactions: {
          likes: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 20),
          saves: Math.floor(Math.random() * 10) + 1,
          shares: Math.floor(Math.random() * 5),
          reposts: Math.floor(Math.random() * 3)
        }
      }
    }
  }

  /**
   * Share a post
   * POST /api/posts/:id/share
   */
  async sharePost(postId: string): Promise<InteractionResponse> {
    await delay(300)

    try {
      const response = await fetch(`${this.baseUrl}/${postId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to share post')
      }

      return await response.json()
    } catch (error) {
      return {
        success: true,
        interactions: {
          likes: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 20),
          saves: Math.floor(Math.random() * 10),
          shares: Math.floor(Math.random() * 5) + 1,
          reposts: Math.floor(Math.random() * 3)
        }
      }
    }
  }

  /**
   * Repost a post
   * POST /api/posts/:id/repost
   */
  async repostPost(postId: string): Promise<InteractionResponse> {
    await delay(500)

    try {
      const response = await fetch(`${this.baseUrl}/${postId}/repost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to repost')
      }

      return await response.json()
    } catch (error) {
      return {
        success: true,
        interactions: {
          likes: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 20),
          saves: Math.floor(Math.random() * 10),
          shares: Math.floor(Math.random() * 5),
          reposts: Math.floor(Math.random() * 3) + 1
        }
      }
    }
  }

  /**
   * Get mention suggestions
   * GET /api/posts/mentions?q=...
   */
  async getMentionSuggestions(query: string): Promise<MentionSuggestion[]> {
    await delay(200)

    try {
      const response = await fetch(`${this.baseUrl}/mentions?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to get mention suggestions')
      }

      return await response.json()
    } catch (error) {
      // Return mock suggestions
      return this.getMockMentionSuggestions(query)
    }
  }

  /**
   * Get hashtag suggestions
   * GET /api/posts/hashtags?q=...
   */
  async getHashtagSuggestions(query: string): Promise<HashtagSuggestion[]> {
    await delay(200)

    try {
      const response = await fetch(`${this.baseUrl}/hashtags?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to get hashtag suggestions')
      }

      return await response.json()
    } catch (error) {
      // Return mock suggestions
      return this.getMockHashtagSuggestions(query)
    }
  }

  /**
   * Save draft
   */
  async saveDraft(draft: DraftPost): Promise<void> {
    await delay(300)
    const drafts = this.getDrafts()
    const existingIndex = drafts.findIndex(d => d.id === draft.id)
    
    if (existingIndex >= 0) {
      drafts[existingIndex] = draft
    } else {
      drafts.push(draft)
    }
    
    localStorage.setItem('post_drafts', JSON.stringify(drafts))
  }

  /**
   * Get drafts
   */
  getDrafts(): DraftPost[] {
    try {
      const drafts = localStorage.getItem('post_drafts')
      return drafts ? JSON.parse(drafts) : []
    } catch {
      return []
    }
  }

  /**
   * Delete draft
   */
  async deleteDraft(draftId: string): Promise<void> {
    await delay(200)
    const drafts = this.getDrafts()
    const filteredDrafts = drafts.filter(d => d.id !== draftId)
    localStorage.setItem('post_drafts', JSON.stringify(filteredDrafts))
  }

  // Mock data methods
  private getMockPosts(params: any): PostsResponse {
    const mockPosts: Post[] = [
      {
        id: '1',
        author: {
          id: 'user1',
          name: 'John Doe',
          email: 'john@example.com',
          avatar: '/avatars/john.jpg',
          role: 'professional',
          sellerEnabled: true,
          verified: true
        },
        content: 'Just launched our new product! Check it out and let me know what you think. #innovation #productlaunch',
        type: 'product',
        status: 'published',
        audience: 'public',
        attachments: [],
        hashtags: ['innovation', 'productlaunch'],
        mentions: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        interactions: {
          likes: 42,
          comments: 8,
          saves: 12,
          shares: 5,
          reposts: 2
        },
        isLiked: false,
        isSaved: false,
        isReposted: false,
        product: {
          id: 'prod1',
          name: 'AI-Powered Analytics Dashboard',
          description: 'Revolutionary analytics platform for business intelligence',
          price: 299,
          currency: 'USD',
          image: '/products/analytics-dashboard.jpg',
          category: 'Software',
          inStock: true,
          sellerId: 'user1',
          sellerName: 'John Doe',
          sellerEnabled: true
        }
      },
      {
        id: '2',
        author: {
          id: 'user2',
          name: 'Sarah Wilson',
          email: 'sarah@example.com',
          avatar: '/avatars/sarah.jpg',
          role: 'professional',
          sellerEnabled: false,
          verified: true
        },
        content: 'Amazing conference today! Met so many inspiring entrepreneurs. The future of B2B is looking bright! 🚀',
        type: 'text',
        status: 'published',
        audience: 'connections',
        attachments: [
          {
            id: 'att1',
            type: 'image',
            url: '/images/conference.jpg',
            thumbnail: '/images/conference-thumb.jpg',
            name: 'conference.jpg',
            size: 1024000,
            mimeType: 'image/jpeg',
            dimensions: { width: 1200, height: 800 }
          }
        ],
        hashtags: ['conference', 'entrepreneurs', 'B2B'],
        mentions: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        interactions: {
          likes: 28,
          comments: 5,
          saves: 7,
          shares: 3,
          reposts: 1
        },
        isLiked: true,
        isSaved: false,
        isReposted: false
      }
    ]

    return {
      posts: mockPosts,
      total: mockPosts.length,
      hasMore: false
    }
  }

  private getMockCreatePostResponse(data: CreatePostRequest): CreatePostResponse {
    const mockPost: Post = {
      id: 'new_' + Date.now(),
      author: {
        id: 'current_user',
        name: 'You',
        email: 'you@example.com',
        avatar: '/avatars/you.jpg',
        role: 'professional',
        sellerEnabled: true,
        verified: true
      },
      content: data.content,
      type: data.type,
      status: 'published',
      audience: data.audience,
      audienceDetails: data.audienceDetails,
      attachments: [],
      hashtags: data.hashtags || [],
      mentions: data.mentions || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      interactions: {
        likes: 0,
        comments: 0,
        saves: 0,
        shares: 0,
        reposts: 0
      },
      isLiked: false,
      isSaved: false,
      isReposted: false
    }

    return {
      post: mockPost,
      success: true
    }
  }

  private getMockComment(postId: string, content: string, parentId?: string): Comment {
    return {
      id: 'comment_' + Date.now(),
      postId,
      author: {
        id: 'current_user',
        name: 'You',
        email: 'you@example.com',
        avatar: '/avatars/you.jpg',
        role: 'professional',
        sellerEnabled: true,
        verified: true
      },
      content,
      parentId,
      replies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isLiked: false,
      likes: 0
    }
  }

  private getMockMentionSuggestions(query: string): MentionSuggestion[] {
    const allSuggestions: MentionSuggestion[] = [
      { id: 'user1', name: 'John Doe', email: 'john@example.com', avatar: '/avatars/john.jpg', type: 'user' },
      { id: 'user2', name: 'Sarah Wilson', email: 'sarah@example.com', avatar: '/avatars/sarah.jpg', type: 'user' },
      { id: 'user3', name: 'Mike Johnson', email: 'mike@example.com', avatar: '/avatars/mike.jpg', type: 'user' },
      { id: 'group1', name: 'Design Team', email: 'design@company.com', type: 'group' },
      { id: 'group2', name: 'Marketing Team', email: 'marketing@company.com', type: 'group' }
    ]

    return allSuggestions.filter(suggestion =>
      suggestion.name.toLowerCase().includes(query.toLowerCase()) ||
      suggestion.email.toLowerCase().includes(query.toLowerCase())
    )
  }

  private getMockHashtagSuggestions(query: string): HashtagSuggestion[] {
    const allHashtags: HashtagSuggestion[] = [
      { tag: 'innovation', count: 1250, trending: true },
      { tag: 'productlaunch', count: 890, trending: false },
      { tag: 'B2B', count: 2100, trending: true },
      { tag: 'entrepreneurs', count: 1560, trending: false },
      { tag: 'conference', count: 980, trending: false },
      { tag: 'technology', count: 3200, trending: true },
      { tag: 'business', count: 4500, trending: false },
      { tag: 'networking', count: 1200, trending: false }
    ]

    return allHashtags.filter(hashtag =>
      hashtag.tag.toLowerCase().includes(query.toLowerCase())
    )
  }
}

export const postService = new PostService()
