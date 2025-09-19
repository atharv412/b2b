import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const postId = id
    const body = await request.json()
    const { content, parentId } = body

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Mock comment creation
    const comment = {
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

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
