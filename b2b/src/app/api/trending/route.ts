import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'hashtags'
    const limit = parseInt(searchParams.get('limit') || '10')

    // Mock trending data
    const trendingData = {
      hashtags: [
        { id: '1', name: 'AI', posts: 12500, growth: 15.2 },
        { id: '2', name: 'Web3', posts: 8900, growth: 8.7 },
        { id: '3', name: 'StartupLife', posts: 6700, growth: 12.1 },
        { id: '4', name: 'RemoteWork', posts: 5400, growth: -2.3 },
        { id: '5', name: 'Sustainability', posts: 4200, growth: 18.9 }
      ],
      users: [
        {
          id: '1',
          fullName: 'Sarah Chen',
          username: '@sarahchen',
          avatarUrl: '/placeholder.jpg',
          verified: true,
          followers: 12500,
          mutualConnections: 3
        },
        {
          id: '2',
          fullName: 'Alex Rodriguez',
          username: '@alexrod',
          avatarUrl: '/placeholder.jpg',
          verified: false,
          followers: 8900,
          mutualConnections: 1
        }
      ],
      products: [
        {
          id: '1',
          name: 'Wireless Earbuds Pro',
          price: 199.99,
          imageUrl: '/placeholder.jpg',
          rating: 4.8,
          sales: 1250
        },
        {
          id: '2',
          name: 'Smart Watch Series 5',
          price: 399.99,
          imageUrl: '/placeholder.jpg',
          rating: 4.6,
          sales: 890
        }
      ]
    }

    const data = trendingData[type as keyof typeof trendingData] || trendingData.hashtags
    const limitedData = data.slice(0, limit)

    return NextResponse.json({
      type,
      data: limitedData,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching trending data:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
