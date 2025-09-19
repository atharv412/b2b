"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Settings, 
  Mail, 
  MessageCircle, 
  Bell, 
  Clock, 
  Volume2, 
  VolumeX,
  X,
  Save,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useNotificationPreferences } from '@/hooks/useNotifications'
import { NotificationType, NotificationPriority } from '@/types/notifications'
import { cn } from '@/lib/utils'

interface NotificationSettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

const notificationTypes: { value: NotificationType; label: string; description: string }[] = [
  { value: 'post', label: 'Posts', description: 'Comments, likes, and mentions on your posts' },
  { value: 'chat', label: 'Messages', description: 'Direct messages and group chats' },
  { value: 'marketplace', label: 'Marketplace', description: 'New products, orders, and marketplace updates' },
  { value: 'connection', label: 'Connections', description: 'Connection requests and network updates' },
  { value: 'message', label: 'Messages', description: 'General messages and communications' },
  { value: 'system', label: 'System', description: 'System updates and maintenance notifications' }
]

const priorityLevels: { value: NotificationPriority; label: string; description: string }[] = [
  { value: 'low', label: 'Low', description: 'Non-urgent updates' },
  { value: 'medium', label: 'Medium', description: 'Important but not urgent' },
  { value: 'high', label: 'High', description: 'Important and time-sensitive' },
  { value: 'urgent', label: 'Urgent', description: 'Critical and immediate attention required' }
]

export function NotificationSettingsPanel({ 
  isOpen, 
  onClose, 
  className 
}: NotificationSettingsPanelProps) {
  const { preferences, updatePreference, toggleDeliveryMethod, updateTypes, isLoading } = useNotificationPreferences()
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  if (!preferences) {
    return null
  }

  const handleToggle = async (method: keyof typeof preferences, enabled: boolean) => {
    await toggleDeliveryMethod(method, enabled)
    setHasChanges(true)
  }

  const handleTypesChange = async (method: keyof typeof preferences, types: string[]) => {
    await updateTypes(method, types)
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000))
      setHasChanges(false)
      onClose()
    } catch (error) {
      console.error('Failed to save preferences:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setHasChanges(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Enable all notifications
                    Object.keys(preferences).forEach(method => {
                      if (typeof preferences[method as keyof typeof preferences] === 'object' && 'enabled' in preferences[method as keyof typeof preferences]) {
                        toggleDeliveryMethod(method as keyof typeof preferences, true)
                      }
                    })
                  }}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Enable All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Disable all notifications
                    Object.keys(preferences).forEach(method => {
                      if (typeof preferences[method as keyof typeof preferences] === 'object' && 'enabled' in preferences[method as keyof typeof preferences]) {
                        toggleDeliveryMethod(method as keyof typeof preferences, false)
                      }
                    })
                  }}
                >
                  <VolumeX className="h-4 w-4 mr-2" />
                  Disable All
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Methods */}
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
              <TabsTrigger value="push">Push</TabsTrigger>
              <TabsTrigger value="inApp">In-App</TabsTrigger>
            </TabsList>

            {/* Email Settings */}
            <TabsContent value="email" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Email Notifications
                    </CardTitle>
                    <Switch
                      checked={preferences.email.enabled}
                      onCheckedChange={(checked) => handleToggle('email', checked)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {preferences.email.enabled && (
                    <>
                      <div>
                        <Label htmlFor="email-frequency">Frequency</Label>
                        <Select
                          value={preferences.email.frequency}
                          onValueChange={(value) => updatePreference('email', { frequency: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immediate</SelectItem>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Notification Types</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {notificationTypes.map((type) => (
                            <div key={type.value} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`email-${type.value}`}
                                checked={preferences.email.types.includes(type.value)}
                                onChange={(e) => {
                                  const newTypes = e.target.checked
                                    ? [...preferences.email.types, type.value]
                                    : preferences.email.types.filter(t => t !== type.value)
                                  handleTypesChange('email', newTypes)
                                }}
                              />
                              <Label htmlFor={`email-${type.value}`} className="text-sm">
                                {type.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={preferences.email.quietHours.enabled}
                            onCheckedChange={(checked) => 
                              updatePreference('email', { 
                                quietHours: { ...preferences.email.quietHours, enabled: checked }
                              })
                            }
                          />
                          <Label>Quiet Hours</Label>
                        </div>
                        
                        {preferences.email.quietHours.enabled && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="quiet-start">Start Time</Label>
                              <Input
                                id="quiet-start"
                                type="time"
                                value={preferences.email.quietHours.start}
                                onChange={(e) => 
                                  updatePreference('email', { 
                                    quietHours: { ...preferences.email.quietHours, start: e.target.value }
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="quiet-end">End Time</Label>
                              <Input
                                id="quiet-end"
                                type="time"
                                value={preferences.email.quietHours.end}
                                onChange={(e) => 
                                  updatePreference('email', { 
                                    quietHours: { ...preferences.email.quietHours, end: e.target.value }
                                  })
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* WhatsApp Settings */}
            <TabsContent value="whatsapp" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      WhatsApp Notifications
                    </CardTitle>
                    <Switch
                      checked={preferences.whatsapp.enabled}
                      onCheckedChange={(checked) => handleToggle('whatsapp', checked)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {preferences.whatsapp.enabled && (
                    <>
                      <div>
                        <Label htmlFor="whatsapp-frequency">Frequency</Label>
                        <Select
                          value={preferences.whatsapp.frequency}
                          onValueChange={(value) => updatePreference('whatsapp', { frequency: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immediate</SelectItem>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Notification Types</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {notificationTypes.map((type) => (
                            <div key={type.value} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`whatsapp-${type.value}`}
                                checked={preferences.whatsapp.types.includes(type.value)}
                                onChange={(e) => {
                                  const newTypes = e.target.checked
                                    ? [...preferences.whatsapp.types, type.value]
                                    : preferences.whatsapp.types.filter(t => t !== type.value)
                                  handleTypesChange('whatsapp', newTypes)
                                }}
                              />
                              <Label htmlFor={`whatsapp-${type.value}`} className="text-sm">
                                {type.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Push Settings */}
            <TabsContent value="push" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Push Notifications
                    </CardTitle>
                    <Switch
                      checked={preferences.push.enabled}
                      onCheckedChange={(checked) => handleToggle('push', checked)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {preferences.push.enabled && (
                    <>
                      <div>
                        <Label>Notification Types</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {notificationTypes.map((type) => (
                            <div key={type.value} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`push-${type.value}`}
                                checked={preferences.push.types.includes(type.value)}
                                onChange={(e) => {
                                  const newTypes = e.target.checked
                                    ? [...preferences.push.types, type.value]
                                    : preferences.push.types.filter(t => t !== type.value)
                                  handleTypesChange('push', newTypes)
                                }}
                              />
                              <Label htmlFor={`push-${type.value}`} className="text-sm">
                                {type.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>Priority Levels</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {priorityLevels.map((priority) => (
                            <div key={priority.value} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`push-priority-${priority.value}`}
                                checked={preferences.push.priority.includes(priority.value)}
                                onChange={(e) => {
                                  const newPriorities = e.target.checked
                                    ? [...preferences.push.priority, priority.value]
                                    : preferences.push.priority.filter(p => p !== priority.value)
                                  updatePreference('push', { priority: newPriorities })
                                }}
                              />
                              <Label htmlFor={`push-priority-${priority.value}`} className="text-sm">
                                {priority.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* In-App Settings */}
            <TabsContent value="inApp" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      In-App Notifications
                    </CardTitle>
                    <Switch
                      checked={preferences.inApp.enabled}
                      onCheckedChange={(checked) => handleToggle('inApp', checked)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {preferences.inApp.enabled && (
                    <>
                      <div>
                        <Label>Notification Types</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {notificationTypes.map((type) => (
                            <div key={type.value} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`inapp-${type.value}`}
                                checked={preferences.inApp.types.includes(type.value)}
                                onChange={(e) => {
                                  const newTypes = e.target.checked
                                    ? [...preferences.inApp.types, type.value]
                                    : preferences.inApp.types.filter(t => t !== type.value)
                                  handleTypesChange('inApp', newTypes)
                                }}
                              />
                              <Label htmlFor={`inapp-${type.value}`} className="text-sm">
                                {type.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Show Banner</Label>
                            <p className="text-sm text-muted-foreground">
                              Display notification banners at the top of the screen
                            </p>
                          </div>
                          <Switch
                            checked={preferences.inApp.showBanner}
                            onCheckedChange={(checked) => 
                              updatePreference('inApp', { showBanner: checked })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Sound</Label>
                            <p className="text-sm text-muted-foreground">
                              Play sound when new notifications arrive
                            </p>
                          </div>
                          <Switch
                            checked={preferences.inApp.sound}
                            onCheckedChange={(checked) => 
                              updatePreference('inApp', { sound: checked })
                            }
                          />
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
