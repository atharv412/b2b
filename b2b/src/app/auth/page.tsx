"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { RegistrationForm } from '@/components/auth/RegistrationForm'
import { SignInForm } from '@/components/auth/SignInForm'
import { EmailVerificationNotice } from '@/components/auth/EmailVerificationNotice'
import { RoleSelectionOnboarding } from '@/components/onboarding/RoleSelectionOnboarding'
import { AuthProvider } from '@/context/AuthContext'
import { OnboardingProvider } from '@/context/OnboardingContext'
import { useAuth } from '@/context/AuthContext'
import { useOnboarding } from '@/context/OnboardingContext'
import { useRouter } from 'next/navigation'

function AuthContent() {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup')
  const [showVerification, setShowVerification] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const { user } = useAuth()
  const { showOnboarding: shouldShowOnboarding } = useOnboarding()
  const router = useRouter()

  const handleRegistrationSuccess = (email: string) => {
    setUserEmail(email)
    setShowVerification(true)
  }

  const handleSignInSuccess = () => {
    router.push('/platform')
  }

  const handleVerificationComplete = () => {
    setShowVerification(false)
    setShowOnboarding(true)
  }

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    router.push('/platform')
  }

  const handleSwitchToSignIn = () => {
    setMode('signin')
  }

  const handleSwitchToSignUp = () => {
    setMode('signup')
  }

  // Show onboarding if user is authenticated but hasn't completed onboarding
  React.useEffect(() => {
    if (user && shouldShowOnboarding) {
      setShowOnboarding(true)
    }
  }, [user, shouldShowOnboarding])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to B2B Platform
          </h1>
          <p className="text-gray-600">
            Connect, collaborate, and grow your business
          </p>
        </motion.div>

        {/* Auth Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {mode === 'signup' ? (
            <RegistrationForm
              onSuccess={() => handleRegistrationSuccess(user?.email || '')}
              onSwitchToSignIn={handleSwitchToSignIn}
            />
          ) : (
            <SignInForm
              onSuccess={handleSignInSuccess}
              onSwitchToSignUp={handleSwitchToSignUp}
            />
          )}
        </motion.div>

        {/* Email Verification Modal */}
        <EmailVerificationNotice
          isOpen={showVerification}
          onClose={() => setShowVerification(false)}
          email={userEmail}
          onVerified={handleVerificationComplete}
        />

        {/* Role Selection Onboarding */}
        <RoleSelectionOnboarding
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onComplete={handleOnboardingComplete}
        />
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <AuthContent />
      </OnboardingProvider>
    </AuthProvider>
  )
}
