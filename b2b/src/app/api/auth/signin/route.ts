import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log('Signin attempt:', { email, password: password ? '***' : 'missing' })

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Accept any email/password for demo purposes
    const user = {
      id: 'user_123',
      email: email,
      fullName: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      phoneNumber: '+1234567890',
      emailVerified: true,
      role: 'professional',
      sellerEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Mock JWT token
    const token = 'mock-jwt-token-' + Date.now()

    console.log('Signin successful for:', email)

    return NextResponse.json({
      user,
      token
    })
  } catch (error) {
    console.error('Signin error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
