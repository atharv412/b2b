// Profile Management Components
export { ProfilePage } from './ProfilePage'
export { ProfileHeader } from './ProfileHeader'
export { ProfileEditor } from './ProfileEditor'
export { ProfileAnalyticsPanel } from './ProfileAnalyticsPanel'
export { ResumeUploader } from './ResumeUploader'
export { VideoRecorderModal } from './VideoRecorderModal'
export { SkillsChips } from './SkillsChips'
export { PrivacyControlsPanel } from './PrivacyControlsPanel'
export { ProfileSettings } from './ProfileSettings'

// Experience & Education Components
export { ExperienceList } from './ExperienceList'
export { EducationList } from './EducationList'

// Projects & Certifications Components
export { ProjectGallery } from './ProjectGallery'
export { CertificationsList } from './CertificationsList'

// Company Profile Components
export { CompanyProfileSections } from './CompanyProfileSections'
export { TeamMemberLinker } from './TeamMemberLinker'

// Posts & Social Components
export { PostsSection } from './PostsSection'

// Re-export types
export type { 
  UserProfile, 
  CompanyProfile, 
  Experience, 
  Education, 
  Project, 
  Certification, 
  Skill, 
  SocialLinks, 
  PrivacySettings, 
  ProfileFormData,
  ResumeUploadResponse,
  VideoUploadResponse,
  TeamMemberLinkResponse,
  ProfileUpdateResponse
} from '@/types/profile'
