"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  User, 
  Building2, 
  Briefcase, 
  GraduationCap, 
  Award, 
  FileText,
  Video,
  Settings,
  BarChart3
} from 'lucide-react'
import { ProfileProvider, useProfile } from '@/context/ProfileContext'
import { ProfileHeader } from './ProfileHeader'
import { ProfileEditor } from './ProfileEditor'
import { ResumeUploader } from './ResumeUploader'
import { VideoRecorderModal } from './VideoRecorderModal'
import { SkillsChips } from './SkillsChips'
import { ProfileAnalyticsPanel } from './ProfileAnalyticsPanel'
import { IndividualProfile, CompanyProfile } from '@/types/profile'

// Mock data for demonstration
const mockIndividualProfile: IndividualProfile = {
  id: '1',
  type: 'individual',
  userId: 'user-1',
  displayName: 'Sarah Chen',
  username: 'sarahchen',
  firstName: 'Sarah',
  lastName: 'Chen',
  email: 'sarah@example.com',
  avatar: '/placeholder.jpg',
  banner: '/placeholder.jpg',
  bio: 'Full-stack developer passionate about creating innovative solutions. 5+ years of experience in React, Node.js, and cloud technologies.',
  location: 'San Francisco, CA',
  website: 'https://sarahchen.dev',
  socialLinks: [
    { id: '1', platform: 'linkedin', url: 'https://linkedin.com/in/sarahchen', label: 'LinkedIn' },
    { id: '2', platform: 'github', url: 'https://github.com/sarahchen', label: 'GitHub' },
    { id: '3', platform: 'twitter', url: 'https://twitter.com/sarahchen', label: 'Twitter' }
  ],
  privacy: {
    profile: 'public',
    contact: 'connections',
    experience: 'public',
    education: 'public',
    projects: 'public',
    skills: 'public',
    resume: 'public',
    videoProfile: 'public',
    analytics: 'private'
  },
  isVerified: true,
  createdAt: '2023-01-15T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
  experience: [
    {
      id: '1',
      title: 'Senior Full-Stack Developer',
      company: 'TechCorp Inc.',
      companyLogo: '/placeholder.jpg',
      location: 'San Francisco, CA',
      startDate: '2022-01-01',
      endDate: '2024-01-01',
      isCurrent: false,
      description: 'Led development of scalable web applications using React, Node.js, and AWS.',
      skills: ['React', 'Node.js', 'AWS', 'TypeScript'],
      achievements: ['Improved performance by 40%', 'Led team of 5 developers']
    }
  ],
  education: [
    {
      id: '1',
      institution: 'Stanford University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2018-09-01',
      endDate: '2022-06-01',
      gpa: 3.8,
      description: 'Focused on software engineering and machine learning.',
      activities: ['Computer Science Society', 'Hackathon Winner 2021']
    }
  ],
  projects: [
    {
      id: '1',
      title: 'E-commerce Platform',
      description: 'Built a full-stack e-commerce platform with React and Node.js.',
      image: '/placeholder.jpg',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      startDate: '2023-01-01',
      endDate: '2023-06-01',
      url: 'https://example.com',
      githubUrl: 'https://github.com/sarahchen/ecommerce',
      collaborators: ['John Doe', 'Jane Smith'],
      isPublic: true
    }
  ],
  skills: [
    {
      id: '1',
      name: 'React',
      category: 'Frameworks & Libraries',
      level: 'expert',
      endorsements: [
        {
          id: '1',
          endorserId: 'user-2',
          endorserName: 'John Doe',
          endorserAvatar: '/placeholder.jpg',
          message: 'Excellent React skills!',
          createdAt: '2024-01-01T00:00:00Z'
        }
      ],
      isVerified: true
    }
  ],
  certifications: [
    {
      id: '1',
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      issueDate: '2023-06-01',
      expiryDate: '2026-06-01',
      credentialId: 'AWS-SAA-123456',
      credentialUrl: 'https://aws.amazon.com/verification',
      image: '/placeholder.jpg'
    }
  ],
  awards: [
    {
      id: '1',
      title: 'Best Developer Award 2023',
      issuer: 'TechCorp Inc.',
      date: '2023-12-01',
      description: 'Recognized for outstanding contribution to the team.',
      image: '/placeholder.jpg'
    }
  ],
  resume: {
    id: '1',
    fileName: 'sarah-chen-resume.pdf',
    fileUrl: '/placeholder.pdf',
    fileSize: 1024000,
    uploadedAt: '2024-01-01T00:00:00Z',
    parsedData: {
      personalInfo: {
        name: 'Sarah Chen',
        email: 'sarah@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA'
      },
      experience: [],
      education: [],
      skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
      certifications: []
    },
    downloadCount: 15,
    isPublic: true
  },
  videoProfile: {
    id: '1',
    url: '/placeholder-video.mp4',
    thumbnail: '/placeholder.jpg',
    duration: 120,
    uploadedAt: '2024-01-01T00:00:00Z',
    isPublic: true
  },
  analytics: {
    views: {
      total: 1250,
      thisMonth: 45,
      thisWeek: 12,
      today: 3
    },
    downloads: {
      resume: 15,
      thisMonth: 3
    },
    engagement: {
      profileCompleteness: 85,
      lastActive: '2024-01-15T10:30:00Z',
      connectionsCount: 150
    },
    sections: {
      experience: { views: 450, lastViewed: '2024-01-14T15:30:00Z' },
      projects: { views: 320, lastViewed: '2024-01-13T09:15:00Z' },
      skills: { views: 280, lastViewed: '2024-01-12T14:20:00Z' }
    }
  }
}

function ProfileContent() {
  const { state, actions } = useProfile()
  const [activeTab, setActiveTab] = useState('about')
  const [isEditing, setIsEditing] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [isOwnProfile, setIsOwnProfile] = useState(true) // In real app, check if current user

  // Mock profile loading
  useEffect(() => {
    actions.loadProfile('1')
    actions.loadAnalytics('1')
  }, [actions])

  const profile = state.profile || mockIndividualProfile
  const isCompany = profile.type === 'company'

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = (data: any) => {
    actions.updateProfile(data)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleResumeUpload = (resume: any) => {
    actions.updateProfile({ resume })
  }

  const handleResumeParse = (parsedData: any) => {
    // Auto-fill profile with parsed data
    actions.updateProfile({
      firstName: parsedData.personalInfo.name.split(' ')[0],
      lastName: parsedData.personalInfo.name.split(' ').slice(1).join(' '),
      email: parsedData.personalInfo.email,
      location: parsedData.personalInfo.location,
      skills: parsedData.skills.map((skill: string) => ({
        id: Date.now().toString(),
        name: skill,
        category: 'Other',
        level: 'intermediate',
        endorsements: [],
        isVerified: false
      }))
    })
  }

  const handleVideoUpload = (video: any) => {
    actions.updateProfile({ videoProfile: video })
  }

  const handleSkillAdd = (skill: any) => {
    const newSkills = [...(profile.skills || []), { ...skill, id: Date.now().toString() }]
    actions.updateProfile({ skills: newSkills })
  }

  const handleSkillUpdate = (skillId: string, updates: any) => {
    const updatedSkills = profile.skills?.map(skill =>
      skill.id === skillId ? { ...skill, ...updates } : skill
    )
    actions.updateProfile({ skills: updatedSkills })
  }

  const handleSkillRemove = (skillId: string) => {
    const filteredSkills = profile.skills?.filter(skill => skill.id !== skillId)
    actions.updateProfile({ skills: filteredSkills })
  }

  const handleSkillEndorse = (skillId: string, endorsement: any) => {
    const updatedSkills = profile.skills?.map(skill => {
      if (skill.id === skillId) {
        return {
          ...skill,
          endorsements: [...skill.endorsements, { ...endorsement, id: Date.now().toString() }]
        }
      }
      return skill
    })
    actions.updateProfile({ skills: updatedSkills })
  }

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Error</h2>
          <p className="text-muted-foreground">{state.error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Profile Header */}
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        onEdit={handleEdit}
        onMessage={() => console.log('Message clicked')}
        onFollow={() => console.log('Follow clicked')}
        onAvatarEdit={() => console.log('Avatar edit clicked')}
        onBannerEdit={() => console.log('Banner edit clicked')}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {isEditing ? (
              <ProfileEditor
                initialData={profile}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                  <TabsTrigger value="about" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    About
                  </TabsTrigger>
                  <TabsTrigger value="experience" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Experience
                  </TabsTrigger>
                  <TabsTrigger value="projects" className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Projects
                  </TabsTrigger>
                  <TabsTrigger value="skills" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Skills
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="space-y-6">
                  {/* Resume Upload */}
                  <ResumeUploader
                    currentResume={profile.resume}
                    onUpload={handleResumeUpload}
                    onParse={handleResumeParse}
                    onDelete={() => actions.updateProfile({ resume: undefined })}
                  />

                  {/* Video Profile */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Video className="h-5 w-5" />
                          Video Profile
                        </h3>
                        <Button
                          variant="outline"
                          onClick={() => setShowVideoModal(true)}
                        >
                          {profile.videoProfile ? 'Update Video' : 'Record Video'}
                        </Button>
                      </div>
                      {profile.videoProfile ? (
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <video
                            src={profile.videoProfile.url}
                            controls
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-muted-foreground">No video profile yet</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="experience" className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Work Experience</h3>
                      {profile.experience?.map((exp) => (
                        <div key={exp.id} className="border-l-2 border-primary pl-4 mb-6">
                          <h4 className="font-semibold">{exp.title}</h4>
                          <p className="text-muted-foreground">{exp.company}</p>
                          <p className="text-sm text-muted-foreground">
                            {exp.startDate} - {exp.endDate || 'Present'}
                          </p>
                          <p className="mt-2">{exp.description}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="projects" className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Projects</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profile.projects?.map((project) => (
                          <div key={project.id} className="border rounded-lg p-4">
                            <h4 className="font-semibold">{project.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {project.technologies.map((tech) => (
                                <span key={tech} className="px-2 py-1 bg-muted text-xs rounded">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="skills" className="space-y-6">
                  <SkillsChips
                    skills={profile.skills || []}
                    onAddSkill={handleSkillAdd}
                    onUpdateSkill={handleSkillUpdate}
                    onRemoveSkill={handleSkillRemove}
                    onEndorseSkill={handleSkillEndorse}
                    isOwnProfile={isOwnProfile}
                  />
                </TabsContent>
              </Tabs>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Analytics Panel */}
            {isOwnProfile && profile.analytics && (
              <ProfileAnalyticsPanel analytics={profile.analytics} />
            )}

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Privacy Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Video Recorder Modal */}
      <VideoRecorderModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        onUpload={handleVideoUpload}
        currentVideo={profile.videoProfile}
      />
    </div>
  )
}

export function ProfilePage() {
  return (
    <ProfileProvider>
      <ProfileContent />
    </ProfileProvider>
  )
}
