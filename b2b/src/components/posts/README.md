# Feed & Content Sharing Module

A comprehensive social media-style feed system for B2B platforms built with React, TypeScript, shadcn/ui, and framer-motion.

## 🚀 Features

### Core Functionality
- **Rich Post Creation**: Text, images, videos, documents, product links, polls, and events
- **Audience Selection**: Public, connections, specific people, groups, and product-linked posts
- **Real-time Interactions**: Like, comment, save, share, and repost functionality
- **Threaded Comments**: Nested replies with real-time updates
- **Advanced Search & Filtering**: By content type, audience, hashtags, and keywords
- **Draft Management**: Save and restore draft posts locally
- **Moderation Tools**: Flag, hide, and report inappropriate content

### UI/UX Features
- **Responsive Design**: Optimized for desktop and mobile
- **Smooth Animations**: Framer-motion powered transitions and micro-interactions
- **Accessibility**: Full keyboard navigation and screen reader support
- **Typeahead Suggestions**: Smart mentions and hashtag suggestions
- **Drag & Drop**: Intuitive file upload with progress indicators
- **Optimistic Updates**: Instant UI feedback with server reconciliation

## 📁 File Structure

```
components/posts/
├── Feed.tsx                    # Main feed component with tabs and filtering
├── PostComposer.tsx           # Post creation modal and inline composer
├── PostCard.tsx               # Individual post display with interactions
├── PostActions.tsx            # Like, comment, save, share, repost buttons
├── CommentThread.tsx          # Threaded comments with replies
├── AudienceSelector.tsx       # Audience selection with user/group picker
├── MediaUploader.tsx          # File upload with drag & drop
├── SavedPostsPanel.tsx        # Saved posts management
├── index.ts                   # Component exports
└── README.md                  # This file

hooks/
├── usePostComposer.ts         # Post creation state management
└── usePosts.ts               # Posts data and interaction hooks

services/
└── postService.ts            # API integration and mock data

types/
└── posts.ts                  # TypeScript type definitions

app/api/posts/
├── route.ts                  # GET/POST posts
├── [id]/
│   ├── like/route.ts         # Like/unlike posts
│   ├── comment/route.ts      # Add comments
│   ├── save/route.ts         # Save/unsave posts
│   ├── share/route.ts        # Share posts
│   └── repost/route.ts       # Repost posts
├── mentions/route.ts         # Mention suggestions
└── hashtags/route.ts         # Hashtag suggestions
```

## 🎯 Components

### Feed
Main feed component with tabs, search, filtering, and post display.

**Features:**
- Tabbed interface (All, Following, Trending, Saved)
- Advanced filtering by type, audience, content
- Search with real-time suggestions
- Infinite scroll with load more
- Responsive grid layout

### PostComposer
Rich post creation interface with audience selection and media upload.

**Features:**
- Modal and inline variants
- Audience selection (Public, Connections, Specific, Groups, Product)
- Rich text editor with mentions and hashtags
- Drag & drop file upload
- Draft saving and restoration
- Keyboard shortcuts (Ctrl+Enter to post)

### PostCard
Individual post display with interactions and content rendering.

**Features:**
- Author information with verification badges
- Content rendering (text, images, videos, documents)
- Product attachment cards
- Poll and event attachments
- Interaction buttons with animations
- Moderation indicators

### CommentThread
Threaded comment system with replies and real-time updates.

**Features:**
- Nested reply structure
- Real-time comment addition
- Like and reply functionality
- Moderation tools
- Keyboard shortcuts

### AudienceSelector
Advanced audience selection with user and group pickers.

**Features:**
- Visual audience type selection
- User search and selection
- Group management
- Product linking
- Selection summary with badges

### MediaUploader
File upload component with drag & drop and progress tracking.

**Features:**
- Drag & drop interface
- File type validation
- Size limits and error handling
- Upload progress indicators
- Thumbnail previews

## 🔧 Hooks

### usePostComposer
Manages post creation state and interactions.

**State:**
- Content, type, audience, attachments
- Hashtags and mentions
- Draft status and publishing state

**Actions:**
- Update content with mention/hashtag detection
- Add/remove attachments
- Save/load drafts
- Publish posts with optimistic updates

### usePosts
Manages posts data and interactions.

**State:**
- Posts list with pagination
- Loading and error states
- Interaction counts

**Actions:**
- Load posts with filtering
- Toggle likes, saves, reposts
- Add comments
- Share posts

## 🌐 API Integration

### Endpoints

**Posts:**
- `GET /api/posts` - Fetch posts with filtering
- `POST /api/posts` - Create new post
- `POST /api/posts/[id]/like` - Toggle like
- `POST /api/posts/[id]/comment` - Add comment
- `POST /api/posts/[id]/save` - Toggle save
- `POST /api/posts/[id]/share` - Share post
- `POST /api/posts/[id]/repost` - Repost

**Suggestions:**
- `GET /api/posts/mentions?q=query` - Mention suggestions
- `GET /api/posts/hashtags?q=query` - Hashtag suggestions

### Mock Data
All endpoints include comprehensive mock data for development and testing.

## 🎨 Styling

Built with shadcn/ui components and Tailwind CSS:
- Consistent design system
- Dark/light mode support
- Responsive breakpoints
- Custom animations with framer-motion

## ♿ Accessibility

- Full keyboard navigation
- Screen reader support
- ARIA labels and roles
- Focus management
- High contrast support

## �� Usage

### Basic Implementation

```tsx
import { Feed } from '@/components/posts'

export default function FeedPage() {
  return <Feed />
}
```

### With Platform Layout

```tsx
import { PlatformLayout } from '@/components/layout/PlatformLayout'
import { Feed } from '@/components/posts'

export default function FeedPage() {
  return (
    <PlatformLayout>
      <Feed />
    </PlatformLayout>
  )
}
```

### Custom Post Composer

```tsx
import { PostComposer } from '@/components/posts'

export default function CreatePost() {
  return (
    <PostComposer
      trigger={<Button>Create Post</Button>}
      onPostCreated={(post) => console.log('Post created:', post)}
    />
  )
}
```

## 🔗 Integration Points

### Navigation
- Feed accessible via `/feed` or `/platform/feed`
- Post composer available as floating action button
- Saved posts in dedicated tab

### Authentication
- User context integration for author information
- Permission-based audience selection
- Role-based moderation tools

### Real-time Updates
- WebSocket integration points defined
- Optimistic updates with server reconciliation
- Real-time comment and interaction updates

## 🧪 Testing

### Mock Data
- Comprehensive mock posts with various types
- User and group suggestions
- Hashtag trends and counts
- Interaction simulation

### Development
- Hot reload support
- Error boundaries
- Console logging for debugging
- TypeScript strict mode

## 📱 Responsive Design

- **Desktop**: Full two-column layout with sidebar
- **Tablet**: Optimized single-column layout
- **Mobile**: Touch-optimized interface with bottom navigation

## 🔮 Future Enhancements

- Real-time WebSocket integration
- Advanced moderation dashboard
- Analytics and insights
- Push notifications
- Content scheduling
- Advanced search with filters
- Post templates and automation

## 🛠️ Development

### Prerequisites
- Node.js 18+
- React 18+
- TypeScript 5+
- Tailwind CSS
- Framer Motion

### Installation
```bash
npm install date-fns framer-motion
```

### Running
```bash
npm run dev
```

The feed will be available at `http://localhost:3000/feed` or `http://localhost:3000/platform/feed`.

## 📄 License

This module is part of the B2B platform and follows the same licensing terms.
