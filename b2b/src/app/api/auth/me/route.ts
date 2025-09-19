import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'No valid token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
    // TODO: Validate JWT token and get user from database
    // For now, return null to indicate no authenticated user
    
    return NextResponse.json(null)

  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 