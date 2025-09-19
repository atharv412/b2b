# Chat & Messaging Module

A comprehensive real-time chat system for B2B platforms with 1:1, group, product-linked, and support conversations.

## Features

### 💬 Core Components
- **Chat**: Main chat interface with responsive layout
- **ChatsList**: Searchable chat list with filters and pinned chats
- **ConversationWindow**: Full conversation interface with message history
- **MessageItem**: Individual message display with reactions and actions
- **Composer**: Rich message composer with attachments and quick replies
- **TypingIndicator**: Real-time typing status with animations
- **ConversationDetailsDrawer**: Chat details, participants, and settings
- **AttachmentPreview**: Media and file preview with upload progress
- **PresenceAvatar**: User presence indicators with status animations

### 🎯 Key Features
- **Real-time Messaging**: WebSocket integration with instant message delivery
- **Message Types**: Text, images, videos, files, quotes, and product previews
- **Message Status**: Sent, delivered, read indicators with timestamps
- **Reactions**: Emoji reactions with animation effects
- **Typing Indicators**: Real-time typing status with debounced updates
- **File Attachments**: Drag & drop with progress indicators
- **Quick Replies**: Predefined message templates
- **Message Threading**: Reply to specific messages
- **Search**: Full-text search across messages and chats
- **Presence**: Online/away/busy/offline status indicators

### 🏢 B2B Features
- **Product-linked Chats**: Product inquiry conversations with product cards
- **Support Integration**: Escalation and ticket management
- **Group Chats**: Team collaboration with participant management
- **Quotation Support**: File attachments with product metadata
- **Moderation Tools**: Report, block, and archive functionality

## Technology Stack

- **React 18** with TypeScript
- **shadcn/ui** for UI primitives
- **framer-motion** for animations
- **Context API** for state management
- **Custom hooks** for logic encapsulation
- **WebSocket** for real-time updates

## Installation

```bash
# Install dependencies
npm install framer-motion date-fns

# Install shadcn/ui components
npx shadcn-ui@latest add avatar badge button card drawer dropdown-menu input label select tabs textarea toast
```

## Usage

### Basic Setup

```tsx
import { ChatProvider, Chat } from '@/components/chat'

function App() {
  return (
    <ChatProvider>
      <div className="h-screen">
        <Chat />
      </div>
    </ChatProvider>
  )
}
```

### Individual Components

```tsx
import { 
  ChatsList, 
  ConversationWindow, 
  MessageItem,
  Composer 
} from '@/components/chat'

function ChatInterface() {
  const [activeChat, setActiveChat] = useState(null)
  
  return (
    <div className="flex h-full">
      <ChatsList onChatSelect={setActiveChat} />
      <ConversationWindow chat={activeChat} />
    </div>
  )
}
```

### Custom Hooks

```tsx
import { useChat, useMessages, useComposer } from '@/components/chat'

function MyComponent() {
  const { chats, activeChat, isLoading } = useChat()
  const { messages, sendMessage, setTyping } = useMessages(chatId)
  const { content, attachments, handleSend } = useComposer(chatId)
  
  // Use the data and actions
  return (
    <div>
      <p>Active chat: {activeChat?.name}</p>
      {/* Your component content */}
    </div>
  )
}
```

## API Integration

### Chat Endpoints

```typescript
// GET /api/chats
interface ChatsResponse {
  chats: Chat[]
  total: number
  hasMore: boolean
  nextCursor?: string
}

// GET /api/chats/:id/messages?cursor=
interface MessagesResponse {
  messages: Message[]
  hasMore: boolean
  nextCursor?: string
}

// POST /api/chats/:id/messages
interface SendMessageRequest {
  content: string
  type: MessageType
  replyTo?: string
  attachments?: File[]
  metadata?: Record<string, any>
}

interface SendMessageResponse {
  message: Message
  success: boolean
}
```

### WebSocket Integration

```typescript
// WebSocket connection for real-time chat
const ws = new WebSocket('ws://localhost:3000/chat')

ws.onmessage = (event) => {
  const data: ChatEvent = JSON.parse(event.data)
  
  switch (data.type) {
    case 'message':
      // Handle new message
      dispatch({ type: 'ADD_MESSAGE', payload: data.data })
      break
    case 'typing':
      // Handle typing indicator
      dispatch({ type: 'SET_TYPING', payload: data.data })
      break
    case 'presence':
      // Handle presence update
      dispatch({ type: 'UPDATE_PRESENCE', payload: data.data })
      break
  }
}
```

## Animation Features

### Message Animations
- **Slide + Fade**: New messages slide in from bottom
- **Staggered Entry**: Multiple messages animate sequentially
- **Reaction Bursts**: Emoji reactions with scale animations
- **Typing Dots**: Animated typing indicator with bounce effect

### UI Animations
- **Drawer Slide**: Conversation details slide from right
- **Hover Effects**: Subtle hover animations on interactive elements
- **Loading States**: Smooth loading transitions
- **Presence Pulse**: Online status with pulsing animation

### Mobile Animations
- **Sheet Transitions**: Full-screen conversation on mobile
- **Swipe Gestures**: Swipe-to-dismiss and navigation
- **Touch Feedback**: Haptic feedback on interactions

## Accessibility Features

### ARIA Support
- **role="log"**: Messages container for screen readers
- **aria-live="polite"**: New message announcements
- **aria-label**: Descriptive labels for all interactive elements
- **role="button"**: Proper button roles for custom elements

### Keyboard Navigation
- **Tab Order**: Logical tab sequence through interface
- **Enter/Space**: Activate buttons and send messages
- **Escape**: Close modals and drawers
- **Arrow Keys**: Navigate message history

### Screen Reader Support
- **Message Announcements**: New messages announced to screen readers
- **Status Updates**: Message status changes announced
- **Descriptive Text**: Clear descriptions for all elements
- **Focus Management**: Proper focus handling in modals

## Mobile Responsiveness

### Breakpoint Behavior
- **Desktop**: Two-column layout with sidebar
- **Tablet**: Responsive layout with collapsible sidebar
- **Mobile**: Single-column with full-screen conversations

### Touch Interactions
- **Swipe Navigation**: Swipe between chat list and conversation
- **Long Press**: Context menus for messages
- **Pull to Refresh**: Refresh chat list
- **Pinch to Zoom**: Zoom on images and media

## Customization

### Theme Integration
```tsx
// Customize chat colors
const chatTheme = {
  colors: {
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--secondary))',
    // ... other colors
  },
  spacing: {
    messageGap: '0.5rem',
    chatPadding: '1rem',
    // ... other spacing
  }
}
```

### Animation Configuration
```tsx
// Customize animation timings
const animationConfig = {
  message: {
    duration: 0.3,
    easing: 'ease-out',
    stagger: 0.05
  },
  typing: {
    duration: 1.5,
    repeat: Infinity
  }
}
```

## Performance Optimization

### Lazy Loading
- **Virtual Scrolling**: For large message lists
- **Image Lazy Loading**: Defer image loading
- **Component Splitting**: Code splitting for better performance

### Memory Management
- **Message Cleanup**: Remove old messages from memory
- **Debounced Typing**: Debounce typing indicators
- **Memoization**: React.memo for expensive components

## Testing

### Component Tests
```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Chat } from '@/components/chat'

test('renders chat interface', () => {
  render(<Chat />)
  expect(screen.getByText('Chats')).toBeInTheDocument()
})
```

### Integration Tests
```tsx
test('sends message when composer is used', () => {
  render(<Chat />)
  const input = screen.getByPlaceholderText('Type a message...')
  fireEvent.change(input, { target: { value: 'Hello' } })
  fireEvent.keyPress(input, { key: 'Enter' })
  expect(screen.getByText('Hello')).toBeInTheDocument()
})
```

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
