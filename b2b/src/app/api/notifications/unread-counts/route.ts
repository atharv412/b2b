import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // TODO: Replace with actual database query
    // Get unread counts for the authenticated user
    
    // Mock data for now
    const unreadCounts = {
      notifications: Math.floor(Math.random() * 10), // 0-9 random notifications
      chat: Math.floor(Math.random() * 5), // 0-4 random chat messages
    }

    return NextResponse.json(unreadCounts)

  } catch (error) {
    console.error('Get unread counts error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
