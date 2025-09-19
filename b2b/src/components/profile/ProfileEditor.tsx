"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  Edit3, 
  Save, 
  X, 
  Plus,
  Trash2,
  Link as LinkIcon,
  Globe,
  MapPin,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ProfileFormData, SocialLink } from '@/types/profile'

const socialPlatforms = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'github', label: 'GitHub' },
  { value: 'website', label: 'Website' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'youtube', label: 'YouTube' }
]

const profileSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  location: z.string().optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  socialLinks: z.array(z.object({
    id: z.string(),
    platform: z.enum(['linkedin', 'twitter', 'github', 'website', 'instagram', 'facebook', 'youtube']),
    url: z.string().url('Must be a valid URL'),
    label: z.string().optional()
  })).optional()
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface ProfileEditorProps {
  initialData: ProfileFormData
  onSave: (data: ProfileFormData) => void
  onCancel: () => void
  className?: string
}

export function ProfileEditor({ 
  initialData, 
  onSave, 
  onCancel, 
  className 
}: ProfileEditorProps) {
  const [editingField, setEditingField] = useState<string | null>(null)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initialData.socialLinks || [])

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: initialData.displayName,
      bio: initialData.bio || '',
      location: initialData.location || '',
      website: initialData.website || '',
      socialLinks: socialLinks
    }
  })

  const { register, handleSubmit, formState: { errors }, watch, setValue } = form

  const handleSave = (data: ProfileFormValues) => {
    onSave({
      ...initialData,
      ...data,
      socialLinks
    })
  }

  const addSocialLink = () => {
    const newLink: SocialLink = {
      id: Date.now().toString(),
      platform: 'website',
      url: '',
      label: ''
    }
    setSocialLinks(prev => [...prev, newLink])
  }

  const updateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    setSocialLinks(prev => 
      prev.map(link => 
        link.id === id ? { ...link, ...updates } : link
      )
    )
  }

  const removeSocialLink = (id: string) => {
    setSocialLinks(prev => prev.filter(link => link.id !== id))
  }

  const InlineEditField = ({ 
    field, 
    label, 
    value, 
    type = 'text',
    multiline = false,
    options
  }: {
    field: string
    label: string
    value: string
    type?: 'text' | 'select' | 'textarea'
    multiline?: boolean
    options?: { value: string; label: string }[]
  }) => {
    const isEditing = editingField === field

    if (isEditing) {
      return (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-2"
        >
          {type === 'textarea' ? (
            <Textarea
              {...register(field as any)}
              placeholder={`Enter ${label.toLowerCase()}`}
              className="min-h-[100px]"
              autoFocus
            />
          ) : type === 'select' && options ? (
            <Select
              value={watch(field as any)}
              onValueChange={(value) => setValue(field as any, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              {...register(field as any)}
              type={type}
              placeholder={`Enter ${label.toLowerCase()}`}
              autoFocus
            />
          )}
          
          {errors[field as keyof ProfileFormValues] && (
            <p className="text-sm text-destructive">
              {errors[field as keyof ProfileFormValues]?.message}
            </p>
          )}

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                setEditingField(null)
                handleSubmit(handleSave)()
              }}
            >
              <Save className="h-3 w-3 mr-1" />
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditingField(null)}
            >
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
          </div>
        </motion.div>
      )
    }

    return (
      <motion.div
        className="group cursor-pointer hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors"
        onClick={() => setEditingField(field)}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-sm">
              {value || <span className="text-muted-foreground italic">Click to add {label.toLowerCase()}</span>}
            </p>
          </div>
          <Edit3 className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </motion.div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Edit Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <InlineEditField
              field="displayName"
              label="Display Name"
              value={watch('displayName')}
            />

            <InlineEditField
              field="bio"
              label="Bio"
              value={watch('bio')}
              type="textarea"
              multiline
            />

            <InlineEditField
              field="location"
              label="Location"
              value={watch('location')}
            />

            <InlineEditField
              field="website"
              label="Website"
              value={watch('website')}
            />
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Social Links</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSocialLink}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>

            <div className="space-y-3">
              {socialLinks.map((link, index) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <Select
                    value={link.platform}
                    onValueChange={(value) => updateSocialLink(link.id, { platform: value as any })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {socialPlatforms.map((platform) => (
                        <SelectItem key={platform.value} value={platform.value}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    value={link.url}
                    onChange={(e) => updateSocialLink(link.id, { url: e.target.value })}
                    placeholder="Enter URL"
                    className="flex-1"
                  />

                  <Input
                    value={link.label || ''}
                    onChange={(e) => updateSocialLink(link.id, { label: e.target.value })}
                    placeholder="Label (optional)"
                    className="w-32"
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSocialLink(link.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}

              {socialLinks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <LinkIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No social links added yet</p>
                  <p className="text-sm">Click "Add Link" to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
