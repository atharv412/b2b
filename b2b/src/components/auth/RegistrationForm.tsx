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
import { Checkbox } from '@/components/ui/checkbox'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { PasswordStrengthMeter } from '@/components/ui/PasswordStrengthMeter'
import { usePasswordStrength } from '@/hooks/usePasswordStrength'
import { useAuth } from '@/context/AuthContext'
import { RegistrationData } from '@/types/user'
import { cn } from '@/lib/utils'

const registrationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phoneNumber: z.string().optional()
})

type RegistrationFormData = z.infer<typeof registrationSchema>

interface RegistrationFormProps {
  onSuccess?: () => void
  onSwitchToSignIn?: () => void
  className?: string
}

export function RegistrationForm({ onSuccess, onSwitchToSignIn, className }: RegistrationFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const { signUp } = useAuth()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
      phoneNumber: ''
    }
  })

  const password = watch('password', '')
  const email = watch('email', '')
  const fullName = watch('fullName', '')
  const passwordStrength = usePasswordStrength(password)

  // Manual validation check
  const isFormValid = email.length > 0 && 
                     fullName.length >= 2 && 
                     password.length >= 8 && 
                     acceptTerms === true

  const handleAcceptTermsChange = (checked: boolean) => {
    setAcceptTerms(checked)
  }

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)

      const registrationData: RegistrationData = {
        email: data.email,
        fullName: data.fullName,
        password: data.password,
        phoneNumber: data.phoneNumber || undefined,
        acceptTerms: acceptTerms
      }

      await signUp(registrationData)
      onSuccess?.()
    } catch (error) {
      console.error('Registration error:', error)
      setSubmitError(error instanceof Error ? error.message : 'Registration failed. Please try again.')
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
          <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
          <CardDescription>
            Join our professional network and marketplace
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

            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                {...register('fullName')}
                className={cn(
                  errors.fullName && "border-red-500 focus-visible:ring-red-500"
                )}
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? "fullName-error" : undefined}
              />
              {errors.fullName && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  id="fullName-error"
                  className="text-sm text-red-500 flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4" />
                  {errors.fullName.message}
                </motion.p>
              )}
            </div>

            {/* Phone Number Field */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="phoneNumber">Phone number (optional)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <AlertCircle className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">We use this for account security and 2FA</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+1 (555) 123-4567"
                {...register('phoneNumber')}
                className={cn(
                  errors.phoneNumber && "border-red-500 focus-visible:ring-red-500"
                )}
                aria-invalid={!!errors.phoneNumber}
                aria-describedby={errors.phoneNumber ? "phoneNumber-error" : undefined}
              />
              {errors.phoneNumber && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  id="phoneNumber-error"
                  className="text-sm text-red-500 flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4" />
                  {errors.phoneNumber.message}
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
                  placeholder="Create a strong password"
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
              
              {/* Password Strength Meter */}
              {password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <PasswordStrengthMeter strength={passwordStrength} />
                </motion.div>
              )}

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

            {/* Terms and Conditions */}
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="acceptTerms"
                  checked={acceptTerms}
                  onCheckedChange={handleAcceptTermsChange}
                  className="mt-1"
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="acceptTerms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{' '}
                    <a href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </Label>
                </div>
              </div>
              {!acceptTerms && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4" />
                  You must accept the terms and conditions
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
              disabled={!isFormValid || isSubmitting}
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
                  Creating account...
                </motion.div>
              ) : (
                <motion.div
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CheckCircle className="h-4 w-4" />
                  Create account
                </motion.div>
              )}
            </Button>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal"
                  onClick={onSwitchToSignIn}
                >
                  Sign in
                </Button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
