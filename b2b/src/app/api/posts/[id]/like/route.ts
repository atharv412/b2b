import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const postId = id

    // Mock like toggle response
    const response = {
      success: true,
      interactions: {
        likes: Math.floor(Math.random() * 100) + 1,
        comments: Math.floor(Math.random() * 20),
        saves: Math.floor(Math.random() * 10),
        shares: Math.floor(Math.random() * 5),
        reposts: Math.floor(Math.random() * 3)
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    )
  }
}
