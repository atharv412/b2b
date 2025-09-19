"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink,
  Github,
  Calendar,
  Tag,
  Award,
  Eye,
  EyeOff
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
import { Project } from '@/types/profile'

interface ProjectGalleryProps {
  projects: Project[]
  onAddProject: (project: Omit<Project, 'id'>) => void
  onUpdateProject: (id: string, updates: Partial<Project>) => void
  onRemoveProject: (id: string) => void
  isOwnProfile?: boolean
  className?: string
}

export function ProjectGallery({
  projects,
  onAddProject,
  onUpdateProject,
  onRemoveProject,
  isOwnProfile = false,
  className
}: ProjectGalleryProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({
    title: '',
    description: '',
    image: '',
    technologies: [],
    liveUrl: '',
    githubUrl: '',
    startDate: '',
    endDate: '',
    isOngoing: false,
    achievements: [],
    teamSize: 1,
    role: '',
    visibility: 'public'
  })

  const handleAddProject = () => {
    if (newProject.title && newProject.description) {
      onAddProject(newProject)
      setNewProject({
        title: '',
        description: '',
        image: '',
        technologies: [],
        liveUrl: '',
        githubUrl: '',
        startDate: '',
        endDate: '',
        isOngoing: false,
        achievements: [],
        teamSize: 1,
        role: '',
        visibility: 'public'
      })
      setIsAdding(false)
    }
  }

  const handleUpdateProject = (id: string, updates: Partial<Project>) => {
    onUpdateProject(id, updates)
    setEditingId(null)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    })
  }

  const getProjectDuration = (startDate: string, endDate?: string) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const months = Math.floor(diffDays / 30)
    
    if (months > 12) {
      const years = Math.floor(months / 12)
      const remainingMonths = months % 12
      return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`
    }
    return `${months} month${months > 1 ? 's' : ''}`
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Projects
          </CardTitle>
          {isOwnProfile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Project Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 border rounded-lg bg-muted/50 space-y-4"
            >
              <h4 className="font-medium">Add New Project</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Project Title</label>
                  <Input
                    value={newProject.title}
                    onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. E-commerce Platform"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Your Role</label>
                  <Input
                    value={newProject.role}
                    onChange={(e) => setNewProject(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="e.g. Full Stack Developer"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Team Size</label>
                  <Input
                    type="number"
                    min="1"
                    value={newProject.teamSize}
                    onChange={(e) => setNewProject(prev => ({ ...prev, teamSize: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Visibility</label>
                  <Select
                    value={newProject.visibility}
                    onValueChange={(value: 'public' | 'private') => setNewProject(prev => ({ ...prev, visibility: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="month"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">End Date</label>
                  <Input
                    type="month"
                    value={newProject.endDate}
                    onChange={(e) => setNewProject(prev => ({ ...prev, endDate: e.target.value }))}
                    disabled={newProject.isOngoing}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isOngoing"
                    checked={newProject.isOngoing}
                    onChange={(e) => setNewProject(prev => ({ 
                      ...prev, 
                      isOngoing: e.target.checked,
                      endDate: e.target.checked ? '' : prev.endDate
                    }))}
                  />
                  <label htmlFor="isOngoing" className="text-sm font-medium">
                    Ongoing project
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your project..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Live URL</label>
                  <Input
                    value={newProject.liveUrl}
                    onChange={(e) => setNewProject(prev => ({ ...prev, liveUrl: e.target.value }))}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">GitHub URL</label>
                  <Input
                    value={newProject.githubUrl}
                    onChange={(e) => setNewProject(prev => ({ ...prev, githubUrl: e.target.value }))}
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Technologies</label>
                <Input
                  value={newProject.technologies.join(', ')}
                  onChange={(e) => setNewProject(prev => ({ 
                    ...prev, 
                    technologies: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                  }))}
                  placeholder="React, Node.js, MongoDB, AWS"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddProject} size="sm">
                  Add Project
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAdding(false)
                    setNewProject({
                      title: '',
                      description: '',
                      image: '',
                      technologies: [],
                      liveUrl: '',
                      githubUrl: '',
                      startDate: '',
                      endDate: '',
                      isOngoing: false,
                      achievements: [],
                      teamSize: 1,
                      role: '',
                      visibility: 'public'
                    })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                {/* Project Image */}
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Award className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  {isOwnProfile && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditingId(project.id)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onRemoveProject(project.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Visibility Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge variant={project.visibility === 'public' ? 'default' : 'secondary'}>
                      {project.visibility === 'public' ? (
                        <Eye className="h-3 w-3 mr-1" />
                      ) : (
                        <EyeOff className="h-3 w-3 mr-1" />
                      )}
                      {project.visibility}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-lg line-clamp-1">{project.title}</h4>
                      {project.role && (
                        <p className="text-sm text-muted-foreground">{project.role}</p>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>

                    {/* Project Meta */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatDate(project.startDate)} - {project.isOngoing ? 'Present' : formatDate(project.endDate || '')}
                        </span>
                      </div>
                      <span>{getProjectDuration(project.startDate, project.endDate)}</span>
                    </div>

                    {/* Technologies */}
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((tech, techIndex) => (
                          <Badge key={techIndex} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.technologies.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Action Links */}
                    <div className="flex gap-2 pt-2">
                      {project.liveUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => window.open(project.liveUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Live Demo
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => window.open(project.githubUrl, '_blank')}
                        >
                          <Github className="h-4 w-4 mr-1" />
                          Code
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No projects added yet</p>
            {isOwnProfile && (
              <p className="text-sm">Click "Add Project" to showcase your work</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
