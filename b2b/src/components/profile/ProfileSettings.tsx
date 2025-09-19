"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { UserProfile } from '@/types/profile'

interface ProfileSettingsProps {
  profile: UserProfile
  onUpdateProfile: (updates: Partial<UserProfile>) => void
  className?: string
}

export function ProfileSettings({ 
  profile, 
  onUpdateProfile, 
  className 
}: ProfileSettingsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localProfile, setLocalProfile] = useState<UserProfile>(profile)

  const handleSave = () => {
    onUpdateProfile(localProfile)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setLocalProfile(profile)
    setIsEditing(false)
  }

  const updateField = (field: keyof UserProfile, value: any) => {
    setLocalProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const updateSocialLink = (platform: string, value: string) => {
    setLocalProfile(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }))
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Profile Settings
          </CardTitle>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Edit Settings
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={localProfile.displayName}
                    onChange={(e) => updateField('displayName', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={localProfile.username}
                    onChange={(e) => updateField('username', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={localProfile.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={localProfile.website}
                    onChange={(e) => updateField('website', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={localProfile.bio}
                  onChange={(e) => updateField('bio', e.target.value)}
                  disabled={!isEditing}
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Social Links
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={localProfile.socialLinks.linkedin || ''}
                    onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={localProfile.socialLinks.twitter || ''}
                    onChange={(e) => updateSocialLink('twitter', e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://twitter.com/username"
                  />
                </div>
                <div>
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    value={localProfile.socialLinks.github || ''}
                    onChange={(e) => updateSocialLink('github', e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://github.com/username"
                  />
                </div>
                <div>
                  <Label htmlFor="portfolio">Portfolio</Label>
                  <Input
                    id="portfolio"
                    value={localProfile.socialLinks.portfolio || ''}
                    onChange={(e) => updateSocialLink('portfolio', e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Contact Settings */}
          <TabsContent value="contact" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={localProfile.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={localProfile.phone || ''}
                    onChange={(e) => updateField('phone', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Contact Preferences</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allowMessages">Allow Direct Messages</Label>
                      <p className="text-sm text-muted-foreground">
                        Let other users send you direct messages
                      </p>
                    </div>
                    <Switch
                      id="allowMessages"
                      checked={localProfile.allowMessages ?? true}
                      onCheckedChange={(checked) => updateField('allowMessages', checked)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allowConnections">Allow Connection Requests</Label>
                      <p className="text-sm text-muted-foreground">
                        Let other users send you connection requests
                      </p>
                    </div>
                    <Switch
                      id="allowConnections"
                      checked={localProfile.allowConnections ?? true}
                      onCheckedChange={(checked) => updateField('allowConnections', checked)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={localProfile.emailNotifications ?? true}
                    onCheckedChange={(checked) => updateField('emailNotifications', checked)}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications in your browser
                    </p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={localProfile.pushNotifications ?? true}
                    onCheckedChange={(checked) => updateField('pushNotifications', checked)}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="profileViews">Profile View Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone views your profile
                    </p>
                  </div>
                  <Switch
                    id="profileViews"
                    checked={localProfile.profileViewNotifications ?? true}
                    onCheckedChange={(checked) => updateField('profileViewNotifications', checked)}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="connectionRequests">Connection Request Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone sends you a connection request
                    </p>
                  </div>
                  <Switch
                    id="connectionRequests"
                    checked={localProfile.connectionRequestNotifications ?? true}
                    onCheckedChange={(checked) => updateField('connectionRequestNotifications', checked)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="profileVisibility">Profile Visibility</Label>
                    <p className="text-sm text-muted-foreground">
                      Control who can see your profile
                    </p>
                  </div>
                  <Select
                    value={localProfile.profileVisibility || 'public'}
                    onValueChange={(value) => updateField('profileVisibility', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="connections">Connections Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showOnlineStatus">Show Online Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Let others see when you're online
                    </p>
                  </div>
                  <Switch
                    id="showOnlineStatus"
                    checked={localProfile.showOnlineStatus ?? true}
                    onCheckedChange={(checked) => updateField('showOnlineStatus', checked)}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showLastSeen">Show Last Seen</Label>
                    <p className="text-sm text-muted-foreground">
                      Show when you were last active
                    </p>
                  </div>
                  <Switch
                    id="showLastSeen"
                    checked={localProfile.showLastSeen ?? true}
                    onCheckedChange={(checked) => updateField('showLastSeen', checked)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
