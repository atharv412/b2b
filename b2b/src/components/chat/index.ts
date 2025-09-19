// Chat Components
export { Chat } from './Chat'
export { ChatsList } from './ChatsList'
export { ChatItem } from './ChatItem'
export { ConversationWindow } from './ConversationWindow'
export { MessageItem } from './MessageItem'
export { Composer } from './Composer'
export { TypingIndicator } from './TypingIndicator'
export { ConversationDetailsDrawer } from './ConversationDetailsDrawer'
export { AttachmentPreview } from './AttachmentPreview'
export { QuickReplies } from './QuickReplies'
export { MessageReactions } from './MessageReactions'
export { PresenceAvatar } from './PresenceAvatar'

// Re-export hooks
export { 
  useChat, 
  useChatList, 
  useMessages, 
  usePresence, 
  useComposer, 
  useWebSocket, 
  useChatActions 
} from '@/hooks/useChat'

// Re-export context
export { ChatProvider, useChatContext } from '@/context/ChatContext'

// Re-export types
export type { 
  Message,
  User,
  Attachment,
  MessageReaction,
  TypingUser,
  ChatType,
  MessageType,
  MessageStatus,
  PresenceStatus,
  ReactionType,
  ChatFilters,
  MessageFilters,
  SendMessageRequest,
  SendMessageResponse,
  UploadAttachmentRequest,
  UploadAttachmentResponse,
  ChatEvent,
  MessageEvent,
  TypingEvent,
  PresenceEvent,
  ReactionEvent,
  StatusUpdateEvent,
  QuickReply,
  Emoji,
  ProductPreview,
  QuotationRequest,
  SupportTicket,
  EscalationRequest
} from '@/types/chat'
