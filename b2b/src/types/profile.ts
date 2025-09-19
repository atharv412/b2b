export type ProfileType = 'individual' | 'company'

export type PrivacyLevel = 'public' | 'connections' | 'private'

export interface BaseProfile {
  id: string
  type: ProfileType
  userId: string
  displayName: string
  username: string
  avatar?: string
  banner?: string
  bio?: string
  location?: string
  website?: string
  socialLinks: SocialLink[]
  privacy: PrivacySettings
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface IndividualProfile extends BaseProfile {
  type: 'individual'
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string
  experience: Experience[]
  education: Education[]
  projects: Project[]
  skills: Skill[]
  certifications: Certification[]
  awards: Award[]
  resume?: Resume
  videoProfile?: VideoProfile
  analytics: ProfileAnalytics
}

export interface CompanyProfile extends BaseProfile {
  type: 'company'
  companyName: string
  industry: string
  companySize: string
  foundedYear?: number
  headquarters: string
  domains: string[]
  majorProjects: Project[]
  contracts: Contract[]
  partners: Partner[]
  teamMembers: TeamMember[]
  productListings: ProductListing[]
  licenses: License[]
  analytics: ProfileAnalytics
}

export interface SocialLink {
  id: string
  platform: 'linkedin' | 'twitter' | 'github' | 'website' | 'instagram' | 'facebook' | 'youtube'
  url: string
  label?: string
}

export interface PrivacySettings {
  profile: PrivacyLevel
  contact: PrivacyLevel
  experience: PrivacyLevel
  education: PrivacyLevel
  projects: PrivacyLevel
  skills: PrivacyLevel
  resume: PrivacyLevel
  videoProfile: PrivacyLevel
  analytics: PrivacyLevel
}

export interface Experience {
  id: string
  title: string
  company: string
  companyLogo?: string
  location: string
  startDate: string
  endDate?: string
  isCurrent: boolean
  description: string
  skills: string[]
  achievements: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate?: string
  gpa?: number
  description?: string
  activities: string[]
}

export interface Project {
  id: string
  title: string
  description: string
  image?: string
  technologies: string[]
  startDate: string
  endDate?: string
  url?: string
  githubUrl?: string
  collaborators: string[]
  isPublic: boolean
}

export interface Skill {
  id: string
  name: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  endorsements: Endorsement[]
  isVerified: boolean
}

export interface Endorsement {
  id: string
  endorserId: string
  endorserName: string
  endorserAvatar?: string
  message?: string
  createdAt: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialId?: string
  credentialUrl?: string
  image?: string
}

export interface Award {
  id: string
  title: string
  issuer: string
  date: string
  description?: string
  image?: string
}

export interface Resume {
  id: string
  fileName: string
  fileUrl: string
  fileSize: number
  uploadedAt: string
  parsedData?: ParsedResumeData
  downloadCount: number
  isPublic: boolean
}

export interface ParsedResumeData {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
  }
  experience: Omit<Experience, 'id'>[]
  education: Omit<Education, 'id'>[]
  skills: string[]
  certifications: Omit<Certification, 'id'>[]
}

export interface VideoProfile {
  id: string
  url: string
  thumbnail: string
  duration: number
  uploadedAt: string
  isPublic: boolean
}

export interface Contract {
  id: string
  clientName: string
  projectTitle: string
  value: number
  currency: string
  startDate: string
  endDate?: string
  status: 'active' | 'completed' | 'cancelled'
  description?: string
}

export interface Partner {
  id: string
  name: string
  logo?: string
  website?: string
  partnershipType: string
  startDate: string
  description?: string
}

export interface TeamMember {
  id: string
  userId: string
  name: string
  avatar?: string
  role: string
  department: string
  joinedDate: string
  isActive: boolean
}

export interface ProductListing {
  id: string
  name: string
  description: string
  image?: string
  price: number
  currency: string
  category: string
  isActive: boolean
  createdAt: string
}

export interface License {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate?: string
  licenseNumber: string
  image?: string
}

export interface ProfileAnalytics {
  views: {
    total: number
    thisMonth: number
    thisWeek: number
    today: number
  }
  downloads: {
    resume: number
    thisMonth: number
  }
  engagement: {
    profileCompleteness: number
    lastActive: string
    connectionsCount: number
  }
  sections: {
    [key: string]: {
      views: number
      lastViewed: string
    }
  }
}

export interface ProfileFormData {
  displayName: string
  bio: string
  location: string
  website: string
  socialLinks: SocialLink[]
  experience: Experience[]
  education: Education[]
  projects: Project[]
  skills: Skill[]
  certifications: Certification[]
  awards: Award[]
}

export interface ResumeUploadResponse {
  success: boolean
  resume?: Resume
  parsedData?: ParsedResumeData
  error?: string
}

export interface VideoUploadResponse {
  success: boolean
  video?: VideoProfile
  error?: string
}

export interface TeamMemberLinkResponse {
  success: boolean
  teamMember?: TeamMember
  error?: string
}

export interface ProfileUpdateResponse {
  success: boolean
  profile?: BaseProfile
  error?: string
}
