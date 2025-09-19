export type ChatType = 'direct' | 'group' | 'product' | 'support'

export type MessageType = 'text' | 'image' | 'video' | 'file' | 'quote' | 'product' | 'system'

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed'

export type PresenceStatus = 'online' | 'away' | 'busy' | 'offline'

export type ReactionType = 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry' | 'thumbs_up' | 'thumbs_down'

export interface User {
  id: string
  name: string
  avatar?: string
  email: string
  status: PresenceStatus
  lastSeen?: string
  isTyping?: boolean
}

export interface Chat {
  id: string
  type: ChatType
  name: string
  avatar?: string
  lastMessage?: Message
  unreadCount: number
  isPinned: boolean
  isMuted: boolean
  isArchived: boolean
  participants: User[]
  createdAt: string
  updatedAt: string
  metadata?: {
    productId?: string
    productName?: string
    productImage?: string
    supportAgentId?: string
    escalationLevel?: 'low' | 'medium' | 'high' | 'urgent'
  }
}

export interface Message {
  id: string
  chatId: string
  senderId: string
  sender: User
  type: MessageType
  content: string
  timestamp: string
  status: MessageStatus
  replyTo?: {
    messageId: string
    senderName: string
    content: string
  }
  attachments?: Attachment[]
  reactions?: MessageReaction[]
  metadata?: {
    productId?: string
    quotationId?: string
    fileSize?: number
    fileName?: string
    imageDimensions?: { width: number; height: number }
    videoDuration?: number
  }
}

export interface Attachment {
  id: string
  type: 'image' | 'video' | 'file' | 'audio'
  name: string
  url: string
  size: number
  mimeType: string
  thumbnail?: string
  duration?: number
  dimensions?: { width: number; height: number }
  uploadProgress?: number
  isUploading?: boolean
}

export interface MessageReaction {
  id: string
  messageId: string
  userId: string
  user: User
  type: ReactionType
  timestamp: string
}

export interface TypingUser {
  userId: string
  user: User
  timestamp: string
}

export interface ChatFilters {
  search?: string
  type?: ChatType
  unreadOnly?: boolean
  pinnedOnly?: boolean
  archivedOnly?: boolean
}

export interface MessageFilters {
  before?: string
  after?: string
  limit?: number
  type?: MessageType
}

// API Response Types
export interface ChatsResponse {
  chats: Chat[]
  total: number
  hasMore: boolean
  nextCursor?: string
}

export interface MessagesResponse {
  messages: Message[]
  hasMore: boolean
  nextCursor?: string
}

export interface SendMessageRequest {
  chatId: string
  content: string
  type: MessageType
  replyTo?: string
  attachments?: File[]
  metadata?: Record<string, any>
}

export interface SendMessageResponse {
  message: Message
  success: boolean
}

export interface UploadAttachmentRequest {
  file: File
  chatId: string
  messageId?: string
}

export interface UploadAttachmentResponse {
  attachment: Attachment
  success: boolean
}

// WebSocket Events
export interface ChatEvent {
  type: 'message' | 'typing' | 'presence' | 'reaction' | 'status_update'
  chatId: string
  data: any
  timestamp: string
}

export interface MessageEvent extends ChatEvent {
  type: 'message'
  data: Message
}

export interface TypingEvent extends ChatEvent {
  type: 'typing'
  data: {
    userId: string
    user: User
    isTyping: boolean
  }
}

export interface PresenceEvent extends ChatEvent {
  type: 'presence'
  data: {
    userId: string
    status: PresenceStatus
    lastSeen: string
  }
}

export interface ReactionEvent extends ChatEvent {
  type: 'reaction'
  data: {
    messageId: string
    reaction: MessageReaction
    action: 'add' | 'remove'
  }
}

export interface StatusUpdateEvent extends ChatEvent {
  type: 'status_update'
  data: {
    messageId: string
    status: MessageStatus
  }
}

// Composer Types
export interface QuickReply {
  id: string
  text: string
  category: 'greeting' | 'question' | 'response' | 'custom'
}

export interface Emoji {
  id: string
  emoji: string
  name: string
  category: 'smileys' | 'people' | 'animals' | 'food' | 'travel' | 'activities' | 'objects' | 'symbols'
}

// Product Integration
export interface ProductPreview {
  id: string
  name: string
  description: string
  price: number
  currency: string
  image: string
  category: string
  inStock: boolean
  quantity?: number
}

export interface QuotationRequest {
  productId: string
  quantity: number
  message?: string
  attachments?: File[]
  specifications?: Record<string, any>
}

// Support Integration
export interface SupportTicket {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  assignedAgent?: User
  createdAt: string
  updatedAt: string
}

export interface EscalationRequest {
  chatId: string
  reason: string
  priority: 'medium' | 'high' | 'urgent'
  description: string
}
