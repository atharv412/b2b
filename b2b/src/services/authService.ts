import { RegistrationData, VerificationStatus, OnboardingData, User } from '@/types/user'

// API Base URL - replace with your actual API endpoint
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

export interface SignUpResponse {
  userId: string
  emailSent: boolean
  message: string
}

export interface SignInResponse {
  user: User
  token: string
  message: string
}

export interface ResendVerificationResponse {
  ok: boolean
  message: string
}

export interface VerifyStatusResponse {
  verified: boolean
  lastVerifiedAt?: string
}

export interface OnboardingResponse {
  ok: boolean
  message: string
}

// Registration API
export async function signUp(data: RegistrationData): Promise<SignUpResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Registration failed')
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Sign up error:', error)
    throw error
  }
}

// Sign in API
export async function signIn(email: string, password: string): Promise<SignInResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Sign in failed')
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Sign in error:', error)
    throw error
  }
}

// Send verification email
export async function sendVerificationEmail(userId: string): Promise<ResendVerificationResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to send verification email')
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Send verification error:', error)
    throw error
  }
}

// Check verification status
export async function checkVerificationStatus(userId: string): Promise<VerifyStatusResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-status?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to check verification status')
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Check verification status error:', error)
    throw error
  }
}

// Submit onboarding data
export async function submitOnboarding(data: OnboardingData): Promise<OnboardingResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/onboarding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to save onboarding data')
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Submit onboarding error:', error)
    throw error
  }
}

// Get current user
export async function getCurrentUser(): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to get user data')
    }

    const result = await response.json()
    return result.user
  } catch (error) {
    console.error('Get current user error:', error)
    throw error
  }
}

// Mock implementations for development
export const mockAuthService = {
  signUp: async (data: RegistrationData): Promise<SignUpResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      userId: 'mock-user-id',
      emailSent: true,
      message: 'Registration successful! Please check your email for verification.'
    }
  },

  signIn: async (email: string, password: string): Promise<SignInResponse> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    return {
      user: {
        id: 'mock-user-id',
        email,
        fullName: 'Mock User',
        isEmailVerified: false,
        isPhoneVerified: false,
        sellerMode: false,
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      token: 'mock-jwt-token',
      message: 'Sign in successful'
    }
  },

  sendVerificationEmail: async (userId: string): Promise<ResendVerificationResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      ok: true,
      message: 'Verification email sent successfully'
    }
  },

  checkVerificationStatus: async (userId: string): Promise<VerifyStatusResponse> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // For development: Always return verified=true to bypass email verification
    return {
      verified: true,
      lastVerifiedAt: new Date().toISOString()
    }
  },

  submitOnboarding: async (data: OnboardingData): Promise<OnboardingResponse> => {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    return {
      ok: true,
      message: 'Onboarding data saved successfully'
    }
  },

  getCurrentUser: async (): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    return {
      id: 'mock-user-id',
      email: 'user@example.com',
      fullName: 'Mock User',
      isEmailVerified: true, // Set to true for development
      isPhoneVerified: false,
      sellerMode: false,
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
}
