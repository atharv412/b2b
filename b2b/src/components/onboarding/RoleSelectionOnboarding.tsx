"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Building2, 
  GraduationCap, 
  Briefcase, 
  ShoppingBag, 
  CheckCircle,
  X,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { useOnboarding } from '@/context/OnboardingContext'
import { UserRole, IndividualType } from '@/types/user'
import { cn } from '@/lib/utils'

interface RoleSelectionOnboardingProps {
  isOpen: boolean
  onClose: () => void
  onComplete?: () => void
  className?: string
}

const roleOptions = [
  {
    id: 'individual',
    title: 'Individual',
    description: 'Join as a student or professional',
    icon: User,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'company',
    title: 'Company',
    description: 'Represent your business or organization',
    icon: Building2,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  }
]

const individualTypes = [
  {
    id: 'student',
    title: 'Student',
    description: 'Currently studying or in education',
    icon: GraduationCap,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  {
    id: 'professional',
    title: 'Professional',
    description: 'Working in your field of expertise',
    icon: Briefcase,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  }
]

export function RoleSelectionOnboarding({ 
  isOpen, 
  onClose, 
  onComplete,
  className 
}: RoleSelectionOnboardingProps) {
  const { submitOnboarding } = useOnboarding()
  const [selectedRole, setSelectedRole] = useState<UserRole>('individual')
  const [selectedIndividualType, setSelectedIndividualType] = useState<IndividualType>('student')
  const [sellerMode, setSellerMode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRoleChange = (value: string) => {
    setSelectedRole(value as UserRole)
    setError(null)
  }

  const handleIndividualTypeChange = (value: string) => {
    setSelectedIndividualType(value as IndividualType)
    setError(null)
  }

  const handleSellerModeChange = (checked: boolean) => {
    setSellerMode(checked)
    setError(null)
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      await submitOnboarding({
        role: selectedRole,
        individualType: selectedRole === 'individual' ? selectedIndividualType : undefined,
        sellerMode
      })

      onComplete?.()
    } catch (error) {
      console.error('Onboarding error:', error)
      setError(error instanceof Error ? error.message : 'Failed to save onboarding data')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    onComplete?.()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-2xl max-h-[90vh] flex flex-col", className)}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-center">
            Set up your profile
          </DialogTitle>
          <DialogDescription className="text-center">
            Tell us about yourself to personalize your experience
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-1">
          <div className="space-y-6 py-4">
            {/* Role Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Label className="text-lg font-semibold">Choose your role</Label>
              <RadioGroup
                value={selectedRole}
                onValueChange={handleRoleChange}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {roleOptions.map((role) => {
                  const Icon = role.icon
                  const isSelected = selectedRole === role.id
                  
                  return (
                    <motion.div
                      key={role.id}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative"
                    >
                      <Label
                        htmlFor={role.id}
                        className={cn(
                          "block cursor-pointer",
                          isSelected && "ring-2 ring-primary ring-offset-2"
                        )}
                      >
                        <Card className={cn(
                          "transition-all duration-200",
                          isSelected 
                            ? `${role.bgColor} ${role.borderColor} border-2` 
                            : "hover:shadow-md"
                        )}>
                          <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                              <RadioGroupItem
                                value={role.id}
                                id={role.id}
                                className="sr-only"
                              />
                              <div className={cn(
                                "w-12 h-12 rounded-lg flex items-center justify-center",
                                role.bgColor
                              )}>
                                <Icon className={cn("h-6 w-6", role.color)} />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">{role.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {role.description}
                                </p>
                              </div>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                >
                                  <Badge variant="default" className="bg-primary">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Selected
                                  </Badge>
                                </motion.div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Label>
                    </motion.div>
                  )
                })}
              </RadioGroup>
            </motion.div>

            {/* Individual Type Selection */}
            <AnimatePresence>
              {selectedRole === 'individual' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <Label className="text-lg font-semibold">What describes you best?</Label>
                  <RadioGroup
                    value={selectedIndividualType}
                    onValueChange={(value) => handleIndividualTypeChange(value as IndividualType)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {individualTypes.map((type) => {
                      const Icon = type.icon
                      const isSelected = selectedIndividualType === type.id
                      
                      return (
                        <motion.div
                          key={type.id}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className="relative"
                        >
                          <Label
                            htmlFor={type.id}
                            className={cn(
                              "block cursor-pointer",
                              isSelected && "ring-2 ring-primary ring-offset-2"
                            )}
                          >
                            <Card className={cn(
                              "transition-all duration-200",
                              isSelected 
                                ? `${type.bgColor} ${type.borderColor} border-2` 
                                : "hover:shadow-md"
                            )}>
                              <CardContent className="p-6">
                                <div className="flex items-center space-x-4">
                                  <RadioGroupItem
                                    value={type.id}
                                    id={type.id}
                                    className="sr-only"
                                  />
                                  <div className={cn(
                                    "w-12 h-12 rounded-lg flex items-center justify-center",
                                    type.bgColor
                                  )}>
                                    <Icon className={cn("h-6 w-6", type.color)} />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{type.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      {type.description}
                                    </p>
                                  </div>
                                  {isSelected && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                    >
                                      <Badge variant="default" className="bg-primary">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Selected
                                      </Badge>
                                    </motion.div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </Label>
                        </motion.div>
                      )
                    })}
                  </RadioGroup>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Seller Mode Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Enable Seller Mode</h3>
                      <p className="text-sm text-muted-foreground">
                        Turn on to list and manage products in the marketplace
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={sellerMode}
                    onCheckedChange={handleSellerModeChange}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                
                {/* Seller Mode Benefits */}
                <AnimatePresence>
                  {sellerMode && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t"
                    >
                      <p className="text-sm text-muted-foreground mb-3">
                        Next steps to get started:
                      </p>
                      <ul className="space-y-2">
                        {[
                          'Add your business details',
                          'Set up bank account for payouts',
                          'Create your first product listing',
                          'All settings can be changed later'
                        ].map((step, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-2 text-sm"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {step}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md"
                role="alert"
              >
                {error}
              </motion.div>
            )}
          </div>
        </div>

        {/* Fixed Action Buttons */}
        <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3 pt-4 border-t bg-background">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="flex-1"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Skip for now
            </motion.div>
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1"
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
                Saving...
              </motion.div>
            ) : (
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Save & Continue
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
