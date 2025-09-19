"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { z } from 'zod'
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
})

type SignInFormData = z.infer<typeof signInSchema>

interface SignInFormProps {
  onSuccess?: () => void
  onSwitchToSignUp?: () => void
  className?: string
}

export function SignInForm({ onSuccess, onSwitchToSignUp, className }: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { signIn } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange'
  })

  const onSubmit = async (data: SignInFormData) => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)

      await signIn(data.email, data.password)
      onSuccess?.()
    } catch (error) {
      console.error('Sign in error:', error)
      setSubmitError(error instanceof Error ? error.message : 'Sign in failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("w-full max-w-md mx-auto", className)}
    >
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                className={cn(
                  errors.email && "border-red-500 focus-visible:ring-red-500"
                )}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  id="email-error"
                  className="text-sm text-red-500 flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4" />
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register('password')}
                  className={cn(
                    "pr-10",
                    errors.password && "border-red-500 focus-visible:ring-red-500"
                  )}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  id="password-error"
                  className="text-sm text-red-500 flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4" />
                  {errors.password.message}
                </motion.p>
              )}
            </div>

            {/* Submit Error */}
            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md flex items-center gap-2"
                role="alert"
              >
                <AlertCircle className="h-4 w-4" />
                {submitError}
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
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
                  Signing in...
                </motion.div>
              ) : (
                <motion.div
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CheckCircle className="h-4 w-4" />
                  Sign in
                </motion.div>
              )}
            </Button>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                DonDonDon't have an account?apos;t have an account?apos;t have an account?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal"
                  onClick={onSwitchToSignUp}
                >
                  Sign up
                </Button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
