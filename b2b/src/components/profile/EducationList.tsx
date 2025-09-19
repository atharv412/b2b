"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar,
  MapPin,
  GraduationCap,
  Award,
  BookOpen
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
import { Education } from '@/types/profile'

interface EducationListProps {
  education: Education[]
  onAddEducation: (education: Omit<Education, 'id'>) => void
  onUpdateEducation: (id: string, updates: Partial<Education>) => void
  onRemoveEducation: (id: string) => void
  isOwnProfile?: boolean
  className?: string
}

export function EducationList({
  education,
  onAddEducation,
  onUpdateEducation,
  onRemoveEducation,
  isOwnProfile = false,
  className
}: EducationListProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newEducation, setNewEducation] = useState<Omit<Education, 'id'>>({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    gpa: '',
    description: '',
    activities: [],
    achievements: []
  })

  const handleAddEducation = () => {
    if (newEducation.institution && newEducation.degree && newEducation.startDate) {
      onAddEducation(newEducation)
      setNewEducation({
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        gpa: '',
        description: '',
        activities: [],
        achievements: []
      })
      setIsAdding(false)
    }
  }

  const handleUpdateEducation = (id: string, updates: Partial<Education>) => {
    onUpdateEducation(id, updates)
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

  const getDegreeIcon = (degree: string) => {
    const lowerDegree = degree.toLowerCase()
    if (lowerDegree.includes('phd') || lowerDegree.includes('doctorate')) {
      return <GraduationCap className="h-5 w-5 text-purple-600" />
    } else if (lowerDegree.includes('master')) {
      return <GraduationCap className="h-5 w-5 text-blue-600" />
    } else if (lowerDegree.includes('bachelor')) {
      return <GraduationCap className="h-5 w-5 text-green-600" />
    } else if (lowerDegree.includes('associate')) {
      return <BookOpen className="h-5 w-5 text-orange-600" />
    } else {
      return <BookOpen className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Education
          </CardTitle>
          {isOwnProfile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Education Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 border rounded-lg bg-muted/50 space-y-4"
            >
              <h4 className="font-medium">Add New Education</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Institution</label>
                  <Input
                    value={newEducation.institution}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, institution: e.target.value }))}
                    placeholder="e.g. Stanford University"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Degree</label>
                  <Select
                    value={newEducation.degree}
                    onValueChange={(value) => setNewEducation(prev => ({ ...prev, degree: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select degree" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High School">High School</SelectItem>
                      <SelectItem value="Associate">Associate Degree</SelectItem>
                      <SelectItem value="Bachelor">Bachelor's Degree</SelectItem>
                      <SelectItem value="Master">Master's Degree</SelectItem>
                      <SelectItem value="PhD">PhD/Doctorate</SelectItem>
                      <SelectItem value="Certificate">Certificate</SelectItem>
                      <SelectItem value="Diploma">Diploma</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Field of Study</label>
                  <Input
                    value={newEducation.fieldOfStudy}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, fieldOfStudy: e.target.value }))}
                    placeholder="e.g. Computer Science"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">GPA (Optional)</label>
                  <Input
                    value={newEducation.gpa}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, gpa: e.target.value }))}
                    placeholder="e.g. 3.8"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="month"
                    value={newEducation.startDate}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">End Date</label>
                  <Input
                    type="month"
                    value={newEducation.endDate}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, endDate: e.target.value }))}
                    disabled={newEducation.isCurrent}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isCurrent"
                    checked={newEducation.isCurrent}
                    onChange={(e) => setNewEducation(prev => ({ 
                      ...prev, 
                      isCurrent: e.target.checked,
                      endDate: e.target.checked ? '' : prev.endDate
                    }))}
                  />
                  <label htmlFor="isCurrent" className="text-sm font-medium">
                    Currently studying here
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newEducation.description}
                  onChange={(e) => setNewEducation(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your academic experience, relevant coursework, or achievements..."
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Activities & Societies</label>
                <Input
                  value={newEducation.activities.join(', ')}
                  onChange={(e) => setNewEducation(prev => ({ 
                    ...prev, 
                    activities: e.target.value.split(',').map(a => a.trim()).filter(a => a)
                  }))}
                  placeholder="e.g. Student Council, Debate Team, Computer Science Club"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Achievements</label>
                <Input
                  value={newEducation.achievements.join(', ')}
                  onChange={(e) => setNewEducation(prev => ({ 
                    ...prev, 
                    achievements: e.target.value.split(',').map(a => a.trim()).filter(a => a)
                  }))}
                  placeholder="e.g. Dean's List, Academic Excellence Award, Research Publication"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddEducation} size="sm">
                  Add Education
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAdding(false)
                    setNewEducation({
                      institution: '',
                      degree: '',
                      fieldOfStudy: '',
                      startDate: '',
                      endDate: '',
                      isCurrent: false,
                      gpa: '',
                      description: '',
                      activities: [],
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

        {/* Education List */}
        <div className="space-y-4">
          {education.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                {/* Institution Logo/Icon */}
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  {getDegreeIcon(edu.degree)}
                </div>

                {/* Education Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-lg">{edu.degree}</h4>
                      <p className="text-muted-foreground">{edu.institution}</p>
                      {edu.fieldOfStudy && (
                        <p className="text-sm text-muted-foreground">{edu.fieldOfStudy}</p>
                      )}
                      
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(edu.startDate)} - {edu.isCurrent ? 'Present' : formatDate(edu.endDate || '')}
                          </span>
                        </div>
                        {edu.gpa && (
                          <Badge variant="secondary" className="text-xs">
                            GPA: {edu.gpa}
                          </Badge>
                        )}
                        <span className="text-muted-foreground">
                          {getDuration(edu.startDate, edu.endDate)}
                        </span>
                      </div>

                      {edu.description && (
                        <p className="mt-3 text-sm leading-relaxed">{edu.description}</p>
                      )}

                      {/* Activities */}
                      {edu.activities.length > 0 && (
                        <div className="mt-3">
                          <h5 className="text-sm font-medium flex items-center gap-1 mb-2">
                            <BookOpen className="h-4 w-4" />
                            Activities & Societies
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {edu.activities.map((activity, activityIndex) => (
                              <Badge key={activityIndex} variant="outline" className="text-xs">
                                {activity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Achievements */}
                      {edu.achievements.length > 0 && (
                        <div className="mt-3">
                          <h5 className="text-sm font-medium flex items-center gap-1 mb-2">
                            <Award className="h-4 w-4" />
                            Achievements
                          </h5>
                          <ul className="text-sm space-y-1">
                            {edu.achievements.map((achievement, achievementIndex) => (
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
                          onClick={() => setEditingId(edu.id)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveEducation(edu.id)}
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

        {education.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No education added yet</p>
            {isOwnProfile && (
              <p className="text-sm">Click "Add Education" to get started</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
