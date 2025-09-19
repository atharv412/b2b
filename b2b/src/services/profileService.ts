import type {
  IndividualProfile,
  CompanyProfile,
  ProfileFormData,
  ResumeUploadResponse,
  VideoUploadResponse,
  TeamMemberLinkResponse,
  ProfileUpdateResponse,
  ParsedResumeData,
  PrivacySettings,
  ProfileAnalytics
} from '@/types/profile'

// Simulated delay for realistic UX testing
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

class ProfileService {
  private baseUrl = '/api/profile'

  /**
   * Get profile by ID
   * GET /api/profile/:id
   */
  async getProfile(profileId: string): Promise<IndividualProfile | CompanyProfile> {
    await delay(800)

    try {
      const response = await fetch(`${this.baseUrl}/${profileId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }
      return await response.json()
    } catch (error) {
      // Return mock data for development
      return this.getMockProfile(profileId)
    }
  }

  /**
   * Update profile
   * PUT /api/profile/:id
   */
  async updateProfile(profileId: string, updates: Partial<IndividualProfile | CompanyProfile>): Promise<ProfileUpdateResponse> {
    await delay(1000)

    try {
      const response = await fetch(`${this.baseUrl}/${profileId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update profile'
      }
    }
  }

  /**
   * Parse resume file
   * POST /api/profile/parse-resume
   */
  async parseResume(file: File): Promise<ResumeUploadResponse> {
    await delay(2000) // Simulate parsing time

    try {
      const formData = new FormData()
      formData.append('resume', file)

      const response = await fetch(`${this.baseUrl}/parse-resume`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to parse resume')
      }

      return await response.json()
    } catch (error) {
      // Return mock parsed data for development
      return {
        success: true,
        resume: {
          id: Date.now().toString(),
          fileName: file.name,
          fileUrl: URL.createObjectURL(file),
          fileSize: file.size,
          uploadedAt: new Date().toISOString(),
          downloadCount: 0,
          isPublic: true,
          parsedData: this.getMockParsedData()
        },
        parsedData: this.getMockParsedData()
      }
    }
  }

  /**
   * Upload video profile
   * POST /api/profile/upload-video
   */
  async uploadVideo(blob: Blob): Promise<VideoUploadResponse> {
    await delay(1500)

    try {
      const formData = new FormData()
      formData.append('video', blob, 'profile-video.webm')

      const response = await fetch(`${this.baseUrl}/upload-video`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload video')
      }

      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload video'
      }
    }
  }

  /**
   * Link team member to company profile
   * POST /api/profile/link-team-member
   */
  async linkTeamMember(profileId: string, userId: string, role: string): Promise<TeamMemberLinkResponse> {
    await delay(800)

    try {
      const response = await fetch(`${this.baseUrl}/link-team-member`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, userId, role })
      })

      if (!response.ok) {
        throw new Error('Failed to link team member')
      }

      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to link team member'
      }
    }
  }

  /**
   * Update privacy settings
   * PUT /api/profile/:id/privacy
   */
  async updatePrivacy(profileId: string, privacy: Partial<PrivacySettings>): Promise<ProfileUpdateResponse> {
    await delay(600)

    try {
      const response = await fetch(`${this.baseUrl}/${profileId}/privacy`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(privacy)
      })

      if (!response.ok) {
        throw new Error('Failed to update privacy settings')
      }

      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update privacy settings'
      }
    }
  }

  /**
   * Get profile analytics
   * GET /api/profile/:id/analytics
   */
  async getAnalytics(profileId: string): Promise<ProfileAnalytics> {
    await delay(500)

    try {
      const response = await fetch(`${this.baseUrl}/${profileId}/analytics`)
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      return await response.json()
    } catch (error) {
      // Return mock analytics for development
      return this.getMockAnalytics()
    }
  }

  /**
   * Search users for team member linking
   * GET /api/profile/search-users?q=query
   */
  async searchUsers(query: string): Promise<Array<{ id: string; name: string; avatar?: string; role: string }>> {
    await delay(300)

    try {
      const response = await fetch(`${this.baseUrl}/search-users?q=${encodeURIComponent(query)}`)
      if (!response.ok) {
        throw new Error('Failed to search users')
      }
      return await response.json()
    } catch (error) {
      // Return mock search results for development
      return this.getMockSearchResults(query)
    }
  }

  // Mock data methods for development
  private getMockProfile(profileId: string): IndividualProfile | CompanyProfile {
    if (profileId.includes('company')) {
      return {
        id: profileId,
        type: 'company',
        userId: 'company-user-1',
        displayName: 'TechCorp Solutions',
        username: 'techcorp',
        companyName: 'TechCorp Solutions',
        industry: 'Technology',
        companySize: '50-200',
        foundedYear: 2015,
        headquarters: 'San Francisco, CA',
        avatar: '/placeholder.jpg',
        banner: '/placeholder.jpg',
        bio: 'Leading provider of innovative technology solutions for businesses worldwide.',
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
          resume: 'connections',
          videoProfile: 'public',
          analytics: 'private'
        },
        isVerified: true,
        createdAt: '2020-01-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
        domains: ['Web Development', 'Mobile Apps', 'Cloud Solutions'],
        majorProjects: [],
        contracts: [],
        partners: [],
        teamMembers: [],
        productListings: [],
        licenses: [],
        analytics: this.getMockAnalytics()
      }
    }

    return {
      id: profileId,
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
        resume: 'connections',
        videoProfile: 'public',
        analytics: 'private'
      },
      isVerified: true,
      createdAt: '2020-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
      experience: [
        {
          id: '1',
          title: 'Senior Full-Stack Developer',
          company: 'TechCorp Solutions',
          companyLogo: '/placeholder.jpg',
          location: 'San Francisco, CA',
          startDate: '2022-01-01',
          endDate: undefined,
          isCurrent: true,
          description: 'Lead development of scalable web applications using React, Node.js, and AWS.',
          skills: ['React', 'Node.js', 'AWS', 'TypeScript'],
          achievements: ['Improved app performance by 40%', 'Led team of 5 developers']
        }
      ],
      education: [
        {
          id: '1',
          institution: 'Stanford University',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          startDate: '2016-09-01',
          endDate: '2020-06-01',
          gpa: 3.8,
          description: 'Focused on software engineering and machine learning.',
          activities: ['Computer Science Society', 'Hackathon Winner 2019']
        }
      ],
      projects: [],
      skills: [
        {
          id: '1',
          name: 'React',
          category: 'Frontend',
          level: 'expert',
          endorsements: [],
          isVerified: true
        },
        {
          id: '2',
          name: 'Node.js',
          category: 'Backend',
          level: 'advanced',
          endorsements: [],
          isVerified: true
        }
      ],
      certifications: [],
      awards: [],
      analytics: this.getMockAnalytics()
    }
  }

  private getMockParsedData(): ParsedResumeData {
    return {
      personalInfo: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY'
      },
      experience: [
        {
          title: 'Software Engineer',
          company: 'Example Corp',
          companyLogo: undefined,
          location: 'New York, NY',
          startDate: '2020-01-01',
          endDate: '2023-12-31',
          isCurrent: false,
          description: 'Developed and maintained web applications using modern technologies.',
          skills: ['JavaScript', 'React', 'Node.js'],
          achievements: ['Led major feature development', 'Improved system performance']
        }
      ],
      education: [
        {
          institution: 'University of Technology',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          startDate: '2016-09-01',
          endDate: '2020-05-01',
          gpa: 3.7,
          description: 'Focused on software engineering and data structures.',
          activities: ['Programming Club', 'Dean\'s List']
        }
      ],
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS'],
      certifications: [
        {
          name: 'AWS Certified Developer',
          issuer: 'Amazon Web Services',
          issueDate: '2022-06-01',
          expiryDate: '2025-06-01',
          credentialId: 'AWS-DEV-123456',
          credentialUrl: 'https://aws.amazon.com/verification',
          image: undefined
        }
      ]
    }
  }

  private getMockAnalytics(): ProfileAnalytics {
    return {
      views: {
        total: 1250,
        thisMonth: 45,
        thisWeek: 12,
        today: 3
      },
      downloads: {
        resume: 23,
        thisMonth: 5
      },
      engagement: {
        profileCompleteness: 85,
        lastActive: new Date().toISOString(),
        connectionsCount: 156
      },
      sections: {
        experience: { views: 450, lastViewed: new Date().toISOString() },
        skills: { views: 320, lastViewed: new Date().toISOString() },
        projects: { views: 180, lastViewed: new Date().toISOString() }
      }
    }
  }

  private getMockSearchResults(query: string): Array<{ id: string; name: string; avatar?: string; role: string }> {
    const mockUsers = [
      { id: 'user-1', name: 'Alice Johnson', avatar: '/placeholder.jpg', role: 'Software Engineer' },
      { id: 'user-2', name: 'Bob Smith', avatar: '/placeholder.jpg', role: 'Product Manager' },
      { id: 'user-3', name: 'Carol Davis', avatar: '/placeholder.jpg', role: 'Designer' },
      { id: 'user-4', name: 'David Wilson', avatar: '/placeholder.jpg', role: 'Data Scientist' },
      { id: 'user-5', name: 'Eva Brown', avatar: '/placeholder.jpg', role: 'Marketing Manager' }
    ]

    return mockUsers.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.role.toLowerCase().includes(query.toLowerCase())
    )
  }
}

export const profileService = new ProfileService()
