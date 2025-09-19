import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const type = searchParams.get('type')
    const audience = searchParams.get('audience')
    const hashtags = searchParams.get('hashtags')?.split(',')
    const author = searchParams.get('author')
    const sortBy = searchParams.get('sortBy') || 'recent'

    // Mock posts data
    const mockPosts = [
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
      },
      {
        id: '3',
        author: {
          id: 'user3',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          avatar: '/avatars/mike.jpg',
          role: 'professional',
          sellerEnabled: true,
          verified: false
        },
        content: 'Looking for feedback on our new design system. What do you think about the color palette? #design #feedback',
        type: 'image',
        status: 'published',
        audience: 'public',
        attachments: [
          {
            id: 'att2',
            type: 'image',
            url: '/images/design-system.jpg',
            thumbnail: '/images/design-system-thumb.jpg',
            name: 'design-system.jpg',
            size: 2048000,
            mimeType: 'image/jpeg',
            dimensions: { width: 1600, height: 900 }
          }
        ],
        hashtags: ['design', 'feedback'],
        mentions: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        interactions: {
          likes: 15,
          comments: 12,
          saves: 3,
          shares: 1,
          reposts: 0
        },
        isLiked: false,
        isSaved: true,
        isReposted: false
      }
    ]

    // Apply filters
    let filteredPosts = mockPosts

    if (type && type !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.type === type)
    }

    if (audience && audience !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.audience === audience)
    }

    if (hashtags && hashtags.length > 0) {
      filteredPosts = filteredPosts.filter(post =>
        hashtags.some(tag => post.hashtags.includes(tag))
      )
    }

    if (author) {
      filteredPosts = filteredPosts.filter(post => post.author.id === author)
    }

    // Apply sorting
    if (sortBy === 'popular') {
      filteredPosts.sort((a, b) => b.interactions.likes - a.interactions.likes)
    } else if (sortBy === 'trending') {
      filteredPosts.sort((a, b) => (b.interactions.likes + b.interactions.comments) - (a.interactions.likes + a.interactions.comments))
    } else {
      filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    // Apply pagination
    const paginatedPosts = filteredPosts.slice(offset, offset + limit)

    return NextResponse.json({
      posts: paginatedPosts,
      total: filteredPosts.length,
      hasMore: offset + limit < filteredPosts.length
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const content = formData.get('content') as string
    const type = formData.get('type') as string
    const audience = formData.get('audience') as string

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Mock new post creation
    const newPost = {
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
      content,
      type: type || 'text',
      status: 'published',
      audience: audience || 'public',
      attachments: [],
      hashtags: [],
      mentions: [],
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

    return NextResponse.json({
      post: newPost,
      success: true
    })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
