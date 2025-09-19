import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    // Basic validation
    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      )
    }

    // TODO: Add actual verification status check here
    // - Find user by userId
    // - Check if email is verified
    // - Return user data if verified

    // Mock response - randomly return verified or not for demo
    const isVerified = Math.random() > 0.7 // 30% chance of being verified

    if (isVerified) {
      const verifiedUser = {
        id: userId,
        email: 'user@example.com',
        fullName: 'John Doe',
        phoneNumber: '+1234567890',
        emailVerified: true,
        sellerEnabled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      return NextResponse.json({
        verified: true,
        user: verifiedUser,
        message: 'Email verified successfully!',
      })
    } else {
      return NextResponse.json({
        verified: false,
        message: 'Email not yet verified',
      })
    }

  } catch (error) {
    console.error('Verify status error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 