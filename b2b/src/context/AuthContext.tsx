"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, RegistrationData, OnboardingData } from '@/types/user'
import { mockAuthService } from '@/services/authService'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signUp: (data: RegistrationData) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
  sendVerificationEmail: (userId: string) => Promise<void>
  checkVerificationStatus: (userId: string) => Promise<boolean>
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for existing session/token
        const token = localStorage.getItem('auth-token')
        if (token) {
          const userData = await mockAuthService.getCurrentUser()
          setUser(userData)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        // Clear invalid token
        localStorage.removeItem('auth-token')
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const signUp = async (data: RegistrationData) => {
    try {
      setIsLoading(true)
      const response = await mockAuthService.signUp(data)
      
      // Create user object from registration data
      const newUser: User = {
        id: response.userId,
        email: data.email,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        isEmailVerified: false,
        isPhoneVerified: false,
        sellerMode: false,
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setUser(newUser)
      
      // Store user ID for verification
      localStorage.setItem('user-id', response.userId)
      
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await mockAuthService.signIn(email, password)
      
      setUser(response.user)
      localStorage.setItem('auth-token', response.token)
      
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('auth-token')
    localStorage.removeItem('user-id')
  }

  const sendVerificationEmail = async (userId: string) => {
    try {
      await mockAuthService.sendVerificationEmail(userId)
    } catch (error) {
      console.error('Send verification email error:', error)
      throw error
    }
  }

  const checkVerificationStatus = async (userId: string): Promise<boolean> => {
    try {
      const response = await mockAuthService.checkVerificationStatus(userId)
      return response.verified
    } catch (error) {
      console.error('Check verification status error:', error)
      return false
    }
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates })
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    sendVerificationEmail,
    checkVerificationStatus,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
