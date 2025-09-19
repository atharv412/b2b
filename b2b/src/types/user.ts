export interface User {
  id: string
  email: string
  fullName: string
  phoneNumber?: string
  isEmailVerified: boolean
  isPhoneVerified: boolean
  role?: UserRole
  sellerMode: boolean
  twoFactorEnabled: boolean
  createdAt: string
  updatedAt: string
}

export type UserRole = 'individual' | 'company'
export type IndividualType = 'student' | 'professional'

export interface UserProfile {
  role: UserRole
  individualType?: IndividualType
  sellerMode: boolean
  companyName?: string
  businessDetails?: BusinessDetails
}

export interface BusinessDetails {
  companyName: string
  businessType: string
  taxId?: string
  address?: string
  website?: string
}

export interface RegistrationData {
  email: string
  fullName: string
  password: string
  phoneNumber?: string
  acceptTerms: boolean
}

export interface PasswordStrength {
  score: number // 0-4
  suggestions: string[]
  feedback: string
}

export interface VerificationStatus {
  verified: boolean
  emailSent: boolean
  lastSentAt?: string
}

export interface OnboardingData {
  role: UserRole
  individualType?: IndividualType
  sellerMode: boolean
  completed: boolean
}
