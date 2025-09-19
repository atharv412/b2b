"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Star, 
  Users, 
  ThumbsUp,
  X,
  Edit3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Skill, Endorsement } from '@/types/profile'

const skillCategories = [
  'Programming Languages',
  'Frameworks & Libraries',
  'Tools & Technologies',
  'Design & UI/UX',
  'Data & Analytics',
  'Cloud & DevOps',
  'Soft Skills',
  'Languages',
  'Other'
]

const skillLevels = [
  { value: 'beginner', label: 'Beginner', color: 'bg-blue-100 text-blue-800' },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'advanced', label: 'Advanced', color: 'bg-orange-100 text-orange-800' },
  { value: 'expert', label: 'Expert', color: 'bg-green-100 text-green-800' }
]

interface SkillsChipsProps {
  skills: Skill[]
  onAddSkill: (skill: Omit<Skill, 'id'>) => void
  onUpdateSkill: (skillId: string, updates: Partial<Skill>) => void
  onRemoveSkill: (skillId: string) => void
  onEndorseSkill: (skillId: string, endorsement: Omit<Endorsement, 'id'>) => void
  isOwnProfile?: boolean
  className?: string
}

export function SkillsChips({
  skills,
  onAddSkill,
  onUpdateSkill,
  onRemoveSkill,
  onEndorseSkill,
  isOwnProfile = false,
  className
}: SkillsChipsProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: '',
    level: 'intermediate' as const
  })
  const [endorsingSkill, setEndorsingSkill] = useState<string | null>(null)

  const handleAddSkill = () => {
    if (newSkill.name.trim() && newSkill.category) {
      onAddSkill({
        name: newSkill.name.trim(),
        category: newSkill.category,
        level: newSkill.level,
        endorsements: [],
        isVerified: false
      })
      setNewSkill({ name: '', category: '', level: 'intermediate' })
      setIsAdding(false)
    }
  }

  const handleEndorse = (skillId: string) => {
    if (isOwnProfile) return

    const endorsement: Omit<Endorsement, 'id'> = {
      endorserId: 'current-user',
      endorserName: 'You',
      endorserAvatar: '/placeholder.jpg',
      message: '',
      createdAt: new Date().toISOString()
    }

    onEndorseSkill(skillId, endorsement)
    setEndorsingSkill(null)

    // Trigger animation
    setTimeout(() => {
      setEndorsingSkill(null)
    }, 2000)
  }

  const getSkillLevelColor = (level: string) => {
    return skillLevels.find(l => l.value === level)?.color || 'bg-gray-100 text-gray-800'
  }

  const getEndorsementCount = (skill: Skill) => {
    return skill.endorsements.length
  }

  const isEndorsedByUser = (skill: Skill) => {
    return skill.endorsements.some(e => e.endorserId === 'current-user')
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Skills & Endorsements
          </CardTitle>
          {isOwnProfile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Skill Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 border rounded-lg bg-muted/50 space-y-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder="Skill name"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                />
                <Select
                  value={newSkill.category}
                  onValueChange={(value) => setNewSkill(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {skillCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={newSkill.level}
                  onValueChange={(value: any) => setNewSkill(prev => ({ ...prev, level: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {skillLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddSkill} size="sm">
                  Add Skill
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAdding(false)
                    setNewSkill({ name: '', category: '', level: 'intermediate' })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {skills.map((skill) => (
            <motion.div
              key={skill.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative group"
            >
              <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{skill.name}</h4>
                    <p className="text-xs text-muted-foreground">{skill.category}</p>
                  </div>
                  {isOwnProfile && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => onRemoveSkill(skill.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={cn('text-xs', getSkillLevelColor(skill.level))}>
                    {skillLevels.find(l => l.value === skill.level)?.label}
                  </Badge>

                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {getEndorsementCount(skill)}
                    </span>
                  </div>
                </div>

                {/* Endorsement Button */}
                {!isOwnProfile && (
                  <motion.div
                    className="mt-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant={isEndorsedByUser(skill) ? "default" : "outline"}
                      size="sm"
                      className="w-full h-7 text-xs"
                      onClick={() => handleEndorse(skill.id)}
                      disabled={isEndorsedByUser(skill)}
                    >
                      {isEndorsedByUser(skill) ? (
                        <>
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          Endorsed
                        </>
                      ) : (
                        <>
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          Endorse
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}

                {/* Endorsement Animation */}
                <AnimatePresence>
                  {endorsingSkill === skill.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0],
                        scale: [0, 1.2, 0],
                        y: [0, -20, -40]
                      }}
                      transition={{ duration: 1 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <div className="text-2xl">🎉</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {skills.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No skills added yet</p>
            {isOwnProfile && (
              <p className="text-sm">Click "Add Skill" to get started</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
