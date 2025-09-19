"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar,
  MapPin,
  Building2,
  Award
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Experience } from '@/types/profile'
import { formatDistanceToNow } from 'date-fns'

interface ExperienceListProps {
  experiences: Experience[]
  onAddExperience: (experience: Omit<Experience, 'id'>) => void
  onUpdateExperience: (id: string, updates: Partial<Experience>) => void
  onRemoveExperience: (id: string) => void
  isOwnProfile?: boolean
  className?: string
}

export function ExperienceList({
  experiences,
  onAddExperience,
  onUpdateExperience,
  onRemoveExperience,
  isOwnProfile = false,
  className
}: ExperienceListProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newExperience, setNewExperience] = useState<Omit<Experience, 'id'>>({
    title: '',
    company: '',
    companyLogo: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    skills: [],
    achievements: []
  })

  const handleAddExperience = () => {
    if (newExperience.title && newExperience.company && newExperience.startDate) {
      onAddExperience(newExperience)
      setNewExperience({
        title: '',
        company: '',
        companyLogo: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: '',
        skills: [],
        achievements: []
      })
      setIsAdding(false)
    }
  }

  const handleUpdateExperience = (id: string, updates: Partial<Experience>) => {
    onUpdateExperience(id, updates)
    setEditingId(null)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    })
  }

  const getDuration = (startDate: string, endDate?: string) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const years = Math.floor(diffDays / 365)
    const months = Math.floor((diffDays % 365) / 30)
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}${months > 0 ? ` ${months} month${months > 1 ? 's' : ''}` : ''}`
    }
    return `${months} month${months > 1 ? 's' : ''}`
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Work Experience
          </CardTitle>
          {isOwnProfile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Experience Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 border rounded-lg bg-muted/50 space-y-4"
            >
              <h4 className="font-medium">Add New Experience</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Job Title</label>
                  <Input
                    value={newExperience.title}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Company</label>
                  <Input
                    value={newExperience.company}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="e.g. TechCorp Inc."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={newExperience.location}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="month"
                    value={newExperience.startDate}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">End Date</label>
                  <Input
                    type="month"
                    value={newExperience.endDate}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, endDate: e.target.value }))}
                    disabled={newExperience.isCurrent}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isCurrent"
                    checked={newExperience.isCurrent}
                    onChange={(e) => setNewExperience(prev => ({ 
                      ...prev, 
                      isCurrent: e.target.checked,
                      endDate: e.target.checked ? '' : prev.endDate
                    }))}
                  />
                  <label htmlFor="isCurrent" className="text-sm font-medium">
                    I currently work here
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newExperience.description}
                  onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your role and responsibilities..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddExperience} size="sm">
                  Add Experience
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAdding(false)
                    setNewExperience({
                      title: '',
                      company: '',
                      companyLogo: '',
                      location: '',
                      startDate: '',
                      endDate: '',
                      isCurrent: false,
                      description: '',
                      skills: [],
                      achievements: []
                    })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Experience List */}
        <div className="space-y-4">
          {experiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                {/* Company Logo */}
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  {experience.companyLogo ? (
                    <img
                      src={experience.companyLogo}
                      alt={experience.company}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>

                {/* Experience Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-lg">{experience.title}</h4>
                      <p className="text-muted-foreground">{experience.company}</p>
                      
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(experience.startDate)} - {experience.isCurrent ? 'Present' : formatDate(experience.endDate || '')}
                          </span>
                        </div>
                        {experience.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{experience.location}</span>
                          </div>
                        )}
                        <span className="text-muted-foreground">
                          {getDuration(experience.startDate, experience.endDate)}
                        </span>
                      </div>

                      {experience.description && (
                        <p className="mt-3 text-sm leading-relaxed">{experience.description}</p>
                      )}

                      {/* Skills */}
                      {experience.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {experience.skills.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Achievements */}
                      {experience.achievements.length > 0 && (
                        <div className="mt-3">
                          <h5 className="text-sm font-medium flex items-center gap-1 mb-2">
                            <Award className="h-4 w-4" />
                            Key Achievements
                          </h5>
                          <ul className="text-sm space-y-1">
                            {experience.achievements.map((achievement, achievementIndex) => (
                              <li key={achievementIndex} className="flex items-start gap-2">
                                <span className="text-muted-foreground">•</span>
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {isOwnProfile && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingId(experience.id)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveExperience(experience.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {experiences.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No work experience added yet</p>
            {isOwnProfile && (
              <p className="text-sm">Click "Add Experience" to get started</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
