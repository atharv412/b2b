"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { OnboardingData, UserRole, IndividualType } from '@/types/user'
import { mockAuthService } from '@/services/authService'

interface OnboardingContextType {
  onboardingData: OnboardingData | null
  isOnboardingComplete: boolean
  showOnboarding: boolean
  submitOnboarding: (data: OnboardingData) => Promise<void>
  updateOnboarding: (updates: Partial<OnboardingData>) => void
  hideOnboarding: () => void
  showOnboardingModal: () => void
  setRole: (role: UserRole, individualType?: IndividualType) => void
  setSellerMode: (enabled: boolean) => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

interface OnboardingProviderProps {
  children: ReactNode
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null)
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  // Initialize onboarding state
  useEffect(() => {
    const initializeOnboarding = () => {
      // Check if user has completed onboarding
      const savedOnboarding = localStorage.getItem('onboarding-data')
      if (savedOnboarding) {
        try {
          const data = JSON.parse(savedOnboarding)
          setOnboardingData(data)
          setIsOnboardingComplete(data.completed)
        } catch (error) {
          console.error('Error parsing saved onboarding data:', error)
        }
      }
    }

    initializeOnboarding()
  }, [])

  // Show onboarding for new users
  useEffect(() => {
    const userId = localStorage.getItem('user-id')
    const hasSeenOnboarding = localStorage.getItem('has-seen-onboarding')
    
    if (userId && !hasSeenOnboarding && !isOnboardingComplete) {
      setShowOnboarding(true)
    }
  }, [isOnboardingComplete])

  const submitOnboarding = async (data: OnboardingData) => {
    try {
      // Submit to backend
      await mockAuthService.submitOnboarding(data)
      
      // Update local state
      const completedData = { ...data, completed: true }
      setOnboardingData(completedData)
      setIsOnboardingComplete(true)
      setShowOnboarding(false)
      
      // Save to localStorage
      localStorage.setItem('onboarding-data', JSON.stringify(completedData))
      localStorage.setItem('has-seen-onboarding', 'true')
      
    } catch (error) {
      console.error('Submit onboarding error:', error)
      throw error
    }
  }

  const updateOnboarding = (updates: Partial<OnboardingData>) => {
    const newData = { ...onboardingData, ...updates }
    setOnboardingData(newData)
    
    // Save to localStorage
    localStorage.setItem('onboarding-data', JSON.stringify(newData))
  }

  const hideOnboarding = () => {
    setShowOnboarding(false)
    localStorage.setItem('has-seen-onboarding', 'true')
  }

  const showOnboardingModal = () => {
    setShowOnboarding(true)
  }

  const setRole = (role: UserRole, individualType?: IndividualType) => {
    updateOnboarding({
      role,
      individualType: role === 'individual' ? individualType : undefined
    })
  }

  const setSellerMode = (enabled: boolean) => {
    updateOnboarding({ sellerMode: enabled })
  }

  const value: OnboardingContextType = {
    onboardingData,
    isOnboardingComplete,
    showOnboarding,
    submitOnboarding,
    updateOnboarding,
    hideOnboarding,
    showOnboardingModal,
    setRole,
    setSellerMode
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}
