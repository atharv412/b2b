// Main Components
export { Feed } from './Feed'
export { PostComposer } from './PostComposer'
export { PostCard } from './PostCard'
export { PostActions } from './PostActions'
export { CommentThread } from './CommentThread'
export { AudienceSelector } from './AudienceSelector'
export { MediaUploader } from './MediaUploader'
export { SavedPostsPanel } from './SavedPostsPanel'

// Re-export types
export type { 
  Post,
  PostType,
  AudienceType,
  PostStatus,
  InteractionType,
  User,
  Attachment,
  ProductAttachment,
  PollAttachment,
  EventAttachment,
  PostInteractions,
  Comment,
  ModerationInfo,
  PostFilters,
  PostSearchParams,
  PostsResponse,
  CreatePostRequest,
  CreatePostResponse,
  InteractionRequest,
  InteractionResponse,
  ComposerState,
  AudienceOption,
  MentionSuggestion,
  HashtagSuggestion,
  DraftPost,
  ModerationAction,
  FlagRequest,
  FlagResponse
} from '@/types/posts'
