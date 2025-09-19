"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Users, 
  Lock,
  Globe,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { PrivacySettings, PrivacyLevel } from '@/types/profile'

interface PrivacyControlsPanelProps {
  privacy: PrivacySettings
  onUpdatePrivacy: (privacy: Partial<PrivacySettings>) => void
  className?: string
}

const privacyLevels: { value: PrivacyLevel; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'public',
    label: 'Public',
    description: 'Visible to everyone',
    icon: <Globe className="h-4 w-4" />
  },
  {
    value: 'connections',
    label: 'Connections Only',
    description: 'Visible to your connections',
    icon: <Users className="h-4 w-4" />
  },
  {
    value: 'private',
    label: 'Private',
    description: 'Only visible to you',
    icon: <Lock className="h-4 w-4" />
  }
]

const privacySections = [
  {
    key: 'profile' as keyof PrivacySettings,
    label: 'Profile Information',
    description: 'Basic profile details like name, bio, and location'
  },
  {
    key: 'contact' as keyof PrivacySettings,
    label: 'Contact Information',
    description: 'Email, phone, and other contact details'
  },
  {
    key: 'experience' as keyof PrivacySettings,
    label: 'Work Experience',
    description: 'Your professional work history'
  },
  {
    key: 'education' as keyof PrivacySettings,
    label: 'Education',
    description: 'Academic background and qualifications'
  },
  {
    key: 'projects' as keyof PrivacySettings,
    label: 'Projects',
    description: 'Portfolio projects and achievements'
  },
  {
    key: 'skills' as keyof PrivacySettings,
    label: 'Skills',
    description: 'Technical and soft skills with endorsements'
  },
  {
    key: 'resume' as keyof PrivacySettings,
    label: 'Resume',
    description: 'Downloadable resume file'
  },
  {
    key: 'videoProfile' as keyof PrivacySettings,
    label: 'Video Profile',
    description: 'Personal introduction video'
  },
  {
    key: 'analytics' as keyof PrivacySettings,
    label: 'Analytics',
    description: 'Profile view and engagement statistics'
  }
]

export function PrivacyControlsPanel({ 
  privacy, 
  onUpdatePrivacy, 
  className 
}: PrivacyControlsPanelProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localPrivacy, setLocalPrivacy] = useState<PrivacySettings>(privacy)

  const handleSave = () => {
    onUpdatePrivacy(localPrivacy)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setLocalPrivacy(privacy)
    setIsEditing(false)
  }

  const updatePrivacyLevel = (section: keyof PrivacySettings, level: PrivacyLevel) => {
    setLocalPrivacy(prev => ({
      ...prev,
      [section]: level
    }))
  }

  const getPrivacyLevel = (level: PrivacyLevel) => {
    return privacyLevels.find(p => p.value === level) || privacyLevels[0]
  }

  const getPrivacyIcon = (level: PrivacyLevel) => {
    const privacyLevel = getPrivacyLevel(level)
    return privacyLevel.icon
  }

  const getPrivacyColor = (level: PrivacyLevel) => {
    switch (level) {
      case 'public': return 'text-green-600 bg-green-100'
      case 'connections': return 'text-blue-600 bg-blue-100'
      case 'private': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Controls
          </CardTitle>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Edit Privacy
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Privacy Overview */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Privacy Overview</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Control who can see different parts of your profile. You can make sections public, 
            visible only to your connections, or completely private.
          </p>
        </div>

        {/* Privacy Settings */}
        <div className="space-y-4">
          {privacySections.map((section, index) => (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{section.label}</h4>
                  <Badge 
                    variant="secondary" 
                    className={cn('text-xs', getPrivacyColor(localPrivacy[section.key]))}
                  >
                    <div className="flex items-center gap-1">
                      {getPrivacyIcon(localPrivacy[section.key])}
                      {getPrivacyLevel(localPrivacy[section.key]).label}
                    </div>
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>

              {isEditing ? (
                <Select
                  value={localPrivacy[section.key]}
                  onValueChange={(value: PrivacyLevel) => updatePrivacyLevel(section.key, value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {privacyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex items-center gap-2">
                          {level.icon}
                          {level.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {getPrivacyIcon(localPrivacy[section.key])}
                  {getPrivacyLevel(localPrivacy[section.key]).label}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Privacy Tips */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-blue-900">Privacy Tips</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Public sections are visible to everyone on the platform</li>
                <li>• Connections-only sections require users to connect with you first</li>
                <li>• Private sections are only visible to you</li>
                <li>• You can change these settings at any time</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
