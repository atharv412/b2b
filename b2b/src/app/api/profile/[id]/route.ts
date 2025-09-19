import { NextRequest, NextResponse } from 'next/server'
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
  experience: [],
  education: [],
  projects: [],
  skills: [],
  certifications: [],
  awards: [],
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

const mockCompanyProfile: CompanyProfile = {
  id: '2',
  type: 'company',
  userId: 'company-1',
  displayName: 'TechCorp Inc.',
  username: 'techcorp',
  companyName: 'TechCorp Inc.',
  industry: 'Technology',
  companySize: '51-200 employees',
  foundedYear: 2015,
  headquarters: 'San Francisco, CA',
  avatar: '/placeholder.jpg',
  banner: '/placeholder.jpg',
  bio: 'Leading provider of innovative software solutions for enterprise clients.',
  location: 'San Francisco, CA',
  website: 'https://techcorp.com',
  socialLinks: [
    { id: '1', platform: 'linkedin', url: 'https://linkedin.com/company/techcorp', label: 'LinkedIn' },
    { id: '2', platform: 'twitter', url: 'https://twitter.com/techcorp', label: 'Twitter' }
  ],
  privacy: {
    profile: 'public',
    contact: 'public',
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
  domains: ['Software Development', 'Cloud Computing', 'AI/ML'],
  majorProjects: [],
  contracts: [],
  partners: [],
  teamMembers: [],
  productListings: [],
  licenses: [],
  analytics: {
    views: {
      total: 2500,
      thisMonth: 120,
      thisWeek: 35,
      today: 8
    },
    downloads: {
      resume: 0,
      thisMonth: 0
    },
    engagement: {
      profileCompleteness: 90,
      lastActive: '2024-01-15T14:20:00Z',
      connectionsCount: 500
    },
    sections: {
      projects: { views: 800, lastViewed: '2024-01-14T16:45:00Z' },
      team: { views: 600, lastViewed: '2024-01-13T11:30:00Z' },
      products: { views: 450, lastViewed: '2024-01-12T09:15:00Z' }
    }
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // In real app, fetch from database
    let profile: IndividualProfile | CompanyProfile | null = null

    if (id === '1') {
      profile = mockIndividualProfile
    } else if (id === '2') {
      profile = mockCompanyProfile
    }

    if (!profile) {
      return NextResponse.json(
        { message: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updates = await request.json()

    // In real app, update in database
    console.log('Updating profile:', id, updates)

    // Mock response
    const updatedProfile = {
      id,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
