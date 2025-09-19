import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, fullName, phoneNumber, password } = body

    // Basic validation
    if (!email || !fullName || !phoneNumber || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    // TODO: Add actual user creation logic here
    // - Hash password
    // - Save to database
    // - Send verification email

    // Mock response for now
    const mockUser = {
      id: `user_${Date.now()}`,
      email,
      fullName,
      phoneNumber,
      emailVerified: false,
      sellerEnabled: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      userId: mockUser.id,
      emailSent: true,
      user: mockUser,
      message: 'Account created successfully! Please check your email for verification.',
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 