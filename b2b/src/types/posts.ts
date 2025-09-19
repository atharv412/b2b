export type PostType = 'text' | 'image' | 'video' | 'document' | 'product' | 'poll' | 'event'

export type AudienceType = 'public' | 'connections' | 'specific' | 'groups' | 'product'

export type PostStatus = 'draft' | 'published' | 'archived' | 'flagged'

export type InteractionType = 'like' | 'comment' | 'save' | 'share' | 'repost'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  sellerEnabled: boolean
  verified: boolean
}

export interface Post {
  id: string
  author: User
  content: string
  type: PostType
  status: PostStatus
  audience: AudienceType
  audienceDetails?: {
    specificUsers?: string[]
    groups?: string[]
    productId?: string
  }
  attachments: Attachment[]
  hashtags: string[]
  mentions: string[]
  createdAt: string
  updatedAt: string
  publishedAt?: string
  interactions: PostInteractions
  isLiked: boolean
  isSaved: boolean
  isReposted: boolean
  product?: ProductAttachment
  poll?: PollAttachment
  event?: EventAttachment
  moderation?: ModerationInfo
}

export interface Attachment {
  id: string
  type: 'image' | 'video' | 'document'
  url: string
  thumbnail?: string
  name: string
  size: number
  mimeType: string
  dimensions?: {
    width: number
    height: number
  }
  duration?: number
  uploadProgress?: number
  isUploading?: boolean
}

export interface ProductAttachment {
  id: string
  name: string
  description: string
  price: number
  currency: string
  image: string
  category: string
  inStock: boolean
  sellerId: string
  sellerName: string
  sellerEnabled: boolean
}

export interface PollAttachment {
  id: string
  question: string
  options: PollOption[]
  expiresAt?: string
  allowMultiple: boolean
  totalVotes: number
  userVotes?: string[]
}

export interface PollOption {
  id: string
  text: string
  votes: number
  percentage: number
}

export interface EventAttachment {
  id: string
  title: string
  description: string
  startDate: string
  endDate?: string
  location?: string
  isOnline: boolean
  maxAttendees?: number
  currentAttendees: number
  userAttending: boolean
}

export interface PostInteractions {
  likes: number
  comments: number
  saves: number
  shares: number
  reposts: number
}

export interface Comment {
  id: string
  postId: string
  author: User
  content: string
  parentId?: string
  replies: Comment[]
  createdAt: string
  updatedAt: string
  isLiked: boolean
  likes: number
  moderation?: ModerationInfo
}

export interface ModerationInfo {
  isFlagged: boolean
  flaggedBy?: string[]
  flaggedReason?: string
  isHidden: boolean
  isBlocked: boolean
  moderatorNotes?: string
}

export interface PostFilters {
  type?: PostType
  audience?: AudienceType
  author?: string
  hashtags?: string[]
  dateRange?: {
    start: string
    end: string
  }
  hasAttachments?: boolean
  isProduct?: boolean
  isSaved?: boolean
}

export interface PostSearchParams {
  query: string
  filters: PostFilters
  sortBy: 'recent' | 'popular' | 'trending'
  limit: number
  offset: number
}

// API Response Types
export interface PostsResponse {
  posts: Post[]
  total: number
  hasMore: boolean
  nextCursor?: string
}

export interface CreatePostRequest {
  content: string
  type: PostType
  audience: AudienceType
  audienceDetails?: {
    specificUsers?: string[]
    groups?: string[]
    productId?: string
  }
  attachments?: File[]
  hashtags?: string[]
  mentions?: string[]
  productId?: string
  poll?: {
    question: string
    options: string[]
    expiresAt?: string
    allowMultiple: boolean
  }
  event?: {
    title: string
    description: string
    startDate: string
    endDate?: string
    location?: string
    isOnline: boolean
    maxAttendees?: number
  }
}

export interface CreatePostResponse {
  post: Post
  success: boolean
}

export interface InteractionRequest {
  postId: string
  type: InteractionType
  commentId?: string
  content?: string
}

export interface InteractionResponse {
  success: boolean
  interactions: PostInteractions
}

// Composer Types
export interface ComposerState {
  content: string
  type: PostType
  audience: AudienceType
  audienceDetails: {
    specificUsers: string[]
    groups: string[]
    productId?: string
  }
  attachments: Attachment[]
  hashtags: string[]
  mentions: string[]
  isDraft: boolean
  isPublishing: boolean
}

export interface AudienceOption {
  type: AudienceType
  label: string
  description: string
  icon: string
  color: string
}

export interface MentionSuggestion {
  id: string
  name: string
  email: string
  avatar?: string
  type: 'user' | 'group'
}

export interface HashtagSuggestion {
  tag: string
  count: number
  trending: boolean
}

// Draft Types
export interface DraftPost {
  id: string
  content: string
  type: PostType
  audience: AudienceType
  audienceDetails: any
  attachments: Attachment[]
  hashtags: string[]
  mentions: string[]
  createdAt: string
  updatedAt: string
}

// Moderation Types
export interface ModerationAction {
  type: 'flag' | 'hide' | 'block' | 'approve' | 'delete'
  reason?: string
  notes?: string
}

export interface FlagRequest {
  postId: string
  reason: string
  description?: string
}

export interface FlagResponse {
  success: boolean
  message: string
}
