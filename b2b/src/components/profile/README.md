# Profile Management Module

A comprehensive React + TypeScript profile management system for B2B platforms, supporting both individual and company profiles with rich editing capabilities, animations, and privacy controls.

## Features

### 🎯 Core Components
- **ProfilePage**: Main profile display and management interface
- **ProfileHeader**: Banner, avatar, and primary actions with animations
- **ProfileEditor**: Inline editing for basic profile information
- **ProfileAnalyticsPanel**: Metrics and engagement statistics
- **ProfileSettings**: Comprehensive settings management

### 📝 Content Management
- **ExperienceList**: Work experience with add/edit/remove functionality
- **EducationList**: Academic background and qualifications
- **ProjectGallery**: Portfolio projects with image support
- **CertificationsList**: Professional certifications and licenses
- **SkillsChips**: Skills with endorsement system and animations
- **PostsSection**: Social posts with engagement features

### 🏢 Company Features
- **CompanyProfileSections**: Core domains, major projects, contracts & partners
- **TeamMemberLinker**: Search and link team members with typeahead
- **Team Management**: Employee profiles and department organization

### 🔒 Privacy & Security
- **PrivacyControlsPanel**: Per-section visibility controls
- **ProfileSettings**: Notification preferences and privacy settings
- **Visibility Levels**: Public, Connections Only, Private

### 📄 Document Management
- **ResumeUploader**: Drag & drop resume upload with parsing
- **VideoRecorderModal**: 2-minute video profile recording
- **File Management**: Secure document storage and access

## Technology Stack

- **React 18** with TypeScript
- **shadcn/ui** for UI primitives
- **framer-motion** for animations
- **react-hook-form** with **zod** validation
- **Context API** for state management
- **Custom hooks** for logic encapsulation

## Installation

```bash
# Install dependencies
npm install framer-motion react-hook-form @hookform/resolvers zod
npm install react-dropzone date-fns

# Install shadcn/ui components
npx shadcn-ui@latest add avatar badge button card dialog dropdown-menu input label select switch tabs textarea tooltip
```

## Usage

### Basic Profile Page

```tsx
import { ProfilePage } from '@/components/profile'

function App() {
  return (
    <ProfilePage
      profileId="user-123"
      isOwnProfile={true}
      onUpdateProfile={(updates) => {
        // Handle profile updates
      }}
    />
  )
}
```

### Individual Profile Sections

```tsx
import { 
  ExperienceList, 
  EducationList, 
  ProjectGallery,
  SkillsChips 
} from '@/components/profile'

function ProfileSections() {
  return (
    <div className="space-y-6">
      <ExperienceList
        experiences={experiences}
        onAddExperience={handleAddExperience}
        onUpdateExperience={handleUpdateExperience}
        onRemoveExperience={handleRemoveExperience}
        isOwnProfile={true}
      />
      
      <SkillsChips
        skills={skills}
        onAddSkill={handleAddSkill}
        onEndorseSkill={handleEndorseSkill}
        isOwnProfile={true}
      />
    </div>
  )
}
```

### Company Profile

```tsx
import { CompanyProfileSections, TeamMemberLinker } from '@/components/profile'

function CompanyProfile() {
  return (
    <div className="space-y-6">
      <CompanyProfileSections
        profile={companyProfile}
        onUpdateProfile={handleUpdateProfile}
        isOwnProfile={true}
      />
      
      <TeamMemberLinker
        onLinkMember={handleLinkMember}
        onUnlinkMember={handleUnlinkMember}
        linkedMembers={teamMembers}
      />
    </div>
  )
}
```

## API Integration

### Profile Endpoints

```typescript
// GET /api/profile/:id
interface ProfileResponse {
  profile: UserProfile | CompanyProfile
  analytics: ProfileAnalytics
  privacy: PrivacySettings
}

// PUT /api/profile/:id
interface ProfileUpdateRequest {
  displayName?: string
  bio?: string
  location?: string
  // ... other fields
}

// POST /api/profile/parse-resume
interface ResumeParseRequest {
  file: File
  userId: string
}

interface ResumeParseResponse {
  parsedFields: {
    name: string
    email: string
    phone: string
    experience: Experience[]
    education: Education[]
    skills: string[]
  }
}
```

### File Upload Endpoints

```typescript
// POST /api/profile/upload-video
interface VideoUploadRequest {
  file: File
  userId: string
  duration: number
}

interface VideoUploadResponse {
  url: string
  thumbnail: string
  duration: number
}
```

## Animation Features

### Header Animations
- **Banner Parallax**: Smooth parallax effect on scroll
- **Header Collapse**: Compact sticky header on scroll
- **Avatar Overlay**: Editable avatar with hover effects

### Content Animations
- **Card Entrance**: Staggered card animations
- **Skill Endorsement**: Burst animation on endorsement
- **Form Transitions**: Smooth form show/hide animations
- **Loading States**: Animated progress indicators

### Micro-interactions
- **Hover Effects**: Subtle hover animations
- **Button States**: Loading and success states
- **Form Validation**: Real-time validation feedback

## Privacy Controls

### Visibility Levels
- **Public**: Visible to everyone
- **Connections Only**: Visible to connected users
- **Private**: Only visible to the user

### Per-Section Controls
- Profile Information
- Contact Details
- Work Experience
- Education
- Projects
- Skills
- Resume
- Video Profile
- Analytics

## Accessibility Features

- **ARIA Labels**: All interactive elements properly labeled
- **Focus Management**: Keyboard navigation support
- **Screen Reader**: Compatible with screen readers
- **Color Contrast**: WCAG compliant color schemes
- **Large Hit Targets**: Minimum 44px touch targets

## Customization

### Theme Integration
```tsx
// Customize colors and spacing
const profileTheme = {
  colors: {
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--secondary))',
    // ... other colors
  },
  spacing: {
    cardPadding: '1.5rem',
    sectionGap: '1.5rem',
    // ... other spacing
  }
}
```

### Animation Configuration
```tsx
// Customize animation timings
const animationConfig = {
  duration: 0.3,
  easing: 'ease-out',
  stagger: 0.1
}
```

## Testing

### Component Tests
```tsx
import { render, screen } from '@testing-library/react'
import { ProfilePage } from '@/components/profile'

test('renders profile page', () => {
  render(<ProfilePage profileId="test" />)
  expect(screen.getByText('Profile')).toBeInTheDocument()
})
```

### Storybook Stories
```tsx
// ProfileHeader.stories.tsx
export default {
  title: 'Profile/ProfileHeader',
  component: ProfileHeader,
  parameters: {
    layout: 'fullscreen'
  }
}
```

## Performance Optimization

- **Lazy Loading**: Components loaded on demand
- **Virtual Scrolling**: For large lists
- **Memoization**: React.memo for expensive components
- **Code Splitting**: Route-based code splitting

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure accessibility compliance

## License

MIT License - see LICENSE file for details
