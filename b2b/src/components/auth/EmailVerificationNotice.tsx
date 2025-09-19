"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Mail, RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useResendCooldown } from '@/hooks/useResendCooldown'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

interface EmailVerificationNoticeProps {
  isOpen: boolean
  onClose: () => void
  email: string
  onVerified?: () => void
  className?: string
}

export function EmailVerificationNotice({ 
  isOpen, 
  onClose, 
  email, 
  onVerified,
  className 
}: EmailVerificationNoticeProps) {
  const [isChecking, setIsChecking] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { sendVerificationEmail, checkVerificationStatus, updateUser } = useAuth()
  const { isCooldown, remainingSeconds, startCooldown } = useResendCooldown(60)

  const handleCheckVerification = async () => {
    try {
      setIsChecking(true)
      setError(null)
      
      // Get user ID from localStorage or use a default for development
      const userId = localStorage.getItem('user-id') || 'mock-user-id'
      
      const verified = await checkVerificationStatus(userId)
      
      if (verified) {
        setIsVerified(true)
        // Update user's email verification status
        updateUser({ isEmailVerified: true })
        
        setTimeout(() => {
          onVerified?.()
          onClose()
        }, 2000)
      } else {
        setError('Email not yet verified. Please check your inbox and try again.')
      }
    } catch (error) {
      console.error('Check verification error:', error)
      setError(error instanceof Error ? error.message : 'Failed to check verification status')
    } finally {
      setIsChecking(false)
    }
  }

  const handleResendEmail = async () => {
    try {
      setIsResending(true)
      setError(null)
      
      const userId = localStorage.getItem('user-id') || 'mock-user-id'
      await sendVerificationEmail(userId)
      startCooldown()
    } catch (error) {
      console.error('Resend email error:', error)
      setError(error instanceof Error ? error.message : 'Failed to resend verification email')
    } finally {
      setIsResending(false)
    }
  }

  const handleGoToFeed = () => {
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-md", className)}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Verify your email
          </DialogTitle>
          <DialogDescription>
            We sent a verification link to <strong>{email}</strong>. Please check your inbox and spam folder.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Success Animation */}
          <AnimatePresence>
            {isVerified && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center py-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 15,
                    delay: 0.2 
                  }}
                  className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <motion.div
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </motion.div>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-green-600 font-medium"
                >
                  Email verified successfully!
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md flex items-center gap-2"
              role="alert"
            >
              <AlertCircle className="h-4 w-4" />
              {error}
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleCheckVerification}
              disabled={isChecking || isVerified}
              className="w-full"
            >
              {isChecking ? (
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Checking...
                </motion.div>
              ) : (
                <motion.div
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RefreshCw className="h-4 w-4" />
                  I verified — Refresh status
                </motion.div>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleResendEmail}
              disabled={isCooldown || isResending || isVerified}
              className="w-full"
            >
              {isResending ? (
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Sending...
                </motion.div>
              ) : isCooldown ? (
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Mail className="h-4 w-4" />
                  Resend email ({remainingSeconds}s)
                </motion.div>
              ) : (
                <motion.div
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Mail className="h-4 w-4" />
                  Resend email
                </motion.div>
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={handleGoToFeed}
              className="w-full"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Go to Feed
              </motion.div>
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={handleResendEmail}
                disabled={isCooldown || isResending}
                className="text-primary hover:underline disabled:opacity-50"
              >
                try again
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
