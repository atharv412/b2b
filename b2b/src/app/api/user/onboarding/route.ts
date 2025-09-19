import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, userType, role, sellerEnabled } = body

    // Basic validation
    if (!userId || !userType) {
      return NextResponse.json(
        { message: 'User ID and user type are required' },
        { status: 400 }
      )
    }

    // Validate userType
    if (!['individual', 'company'].includes(userType)) {
      return NextResponse.json(
        { message: 'Invalid user type' },
        { status: 400 }
      )
    }

    // Validate role for individual users
    if (userType === 'individual' && !role) {
      return NextResponse.json(
        { message: 'Role is required for individual users' },
        { status: 400 }
      )
    }

    if (userType === 'individual' && !['student', 'professional'].includes(role)) {
      return NextResponse.json(
        { message: 'Invalid role for individual user' },
        { status: 400 }
      )
    }

    // TODO: Update user in database
    // - Find user by userId
    // - Update role, userType, sellerEnabled
    // - Save changes

    // Mock updated user for now
    const updatedUser = {
      id: userId,
      email: 'user@example.com', // TODO: Get from database
      fullName: 'John Doe', // TODO: Get from database
      phoneNumber: '+1234567890', // TODO: Get from database
      emailVerified: false, // TODO: Get from database
      role: userType === 'company' ? 'company' : role,
      sellerEnabled: sellerEnabled || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      ok: true,
      role: userType === 'company' ? 'company' : role,
      userType,
      sellerEnabled: sellerEnabled || false,
      user: updatedUser,
      message: 'Onboarding completed successfully!',
    })

  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 