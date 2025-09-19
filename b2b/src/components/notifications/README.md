# Notification Module

A comprehensive real-time notification system for B2B platforms with grouping, delivery preferences, and smooth animations.

## Features

### 🔔 Core Components
- **NotificationBell**: Animated bell icon with unread count badge
- **NotificationsDropdown**: Quick access dropdown with grouped notifications
- **NotificationsCenterPage**: Full-page notification management interface
- **NotificationItem**: Individual notification display with actions
- **NotificationSettingsPanel**: Comprehensive preference management
- **InAppBanner**: Toast-style notifications for high-priority alerts
- **GroupedNotificationCard**: Collapsible notification groups

### 🎯 Key Features
- **Real-time Notifications**: WebSocket integration with subscription hooks
- **Smart Grouping**: Group by type (Posts, Chat, Marketplace, System)
- **Delivery Preferences**: Email, WhatsApp, Push, and In-App notifications
- **Unread Count**: Animated badge with pulse effects
- **Bulk Actions**: Mark all read, dismiss, delete multiple notifications
- **Advanced Filtering**: By type, priority, status, and search
- **Mobile Responsive**: Full-screen sheet on mobile devices
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

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
npx shadcn-ui@latest add badge button card dialog dropdown-menu input label select switch tabs toast
```

## Usage

### Basic Setup

```tsx
import { NotificationProvider, NotificationBell } from '@/components/notifications'

function App() {
  return (
    <NotificationProvider>
      <div className="app">
        <header>
          <NotificationBell />
        </header>
        {/* Rest of your app */}
      </div>
    </NotificationProvider>
  )
}
```

### Notification Bell

```tsx
import { NotificationBell } from '@/components/notifications'

function Header() {
  return (
    <div className="flex items-center gap-4">
      <NotificationBell 
        showDropdown={true}
        onToggleDropdown={(isOpen) => console.log('Dropdown:', isOpen)}
      />
    </div>
  )
}
```

### Notifications Center

```tsx
import { NotificationsCenterPage } from '@/components/notifications'

function NotificationsPage() {
  return (
    <div className="container mx-auto py-8">
      <NotificationsCenterPage />
    </div>
  )
}
```

### Real-time Notifications

```tsx
import { useRealtimeNotifications, useToastNotifications } from '@/components/notifications'

function NotificationManager() {
  const { subscribe, unsubscribe } = useRealtimeNotifications()
  const { toasts, showToast, removeToast } = useToastNotifications()

  useEffect(() => {
    const subscription = subscribe('user-123', (notification) => {
      if (notification.priority === 'urgent') {
        showToast({
          id: `toast-${notification.id}`,
          notification,
          action: {
            label: 'View',
            onClick: () => console.log('View notification')
          }
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [subscribe, showToast])

  return (
    <div>
      {/* Your app content */}
      <ToastContainer 
        toasts={toasts}
        onDismiss={removeToast}
      />
    </div>
  )
}
```

### Custom Hooks

```tsx
import { 
  useNotifications, 
  useNotificationPreferences,
  useNotificationFilters 
} from '@/components/notifications'

function MyComponent() {
  const { notifications, unreadCount, isLoading } = useNotifications()
  const { preferences, updatePreference } = useNotificationPreferences()
  const { filters, applyFilters, clearFilters } = useNotificationFilters()

  // Use the data and actions
  return (
    <div>
      <p>Unread: {unreadCount}</p>
      {/* Your component content */}
    </div>
  )
}
```

## API Integration

### Notification Endpoints

```typescript
// GET /api/notifications?limit=20&type=post&status=unread
interface NotificationsResponse {
  notifications: Notification[]
  total: number
  hasMore: boolean
  nextCursor?: string
}

// POST /api/notifications/mark-read
interface MarkReadRequest {
  notificationIds: string[]
}

interface MarkReadResponse {
  success: boolean
  updatedCount: number
}

// POST /api/notifications/preferences
interface PreferencesRequest {
  preferences: Partial<NotificationPreferences>
}

interface PreferencesResponse {
  preferences: NotificationPreferences
  updated: boolean
}
```

### WebSocket Integration

```typescript
// WebSocket connection for real-time notifications
const ws = new WebSocket('ws://localhost:3000/notifications')

ws.onmessage = (event) => {
  const data: RealtimeNotification = JSON.parse(event.data)
  
  if (data.type === 'new') {
    // Handle new notification
    dispatch({ type: 'ADD_NOTIFICATION', payload: data.notification })
  } else if (data.type === 'update') {
    // Handle notification update
    dispatch({ type: 'UPDATE_NOTIFICATION', payload: { 
      id: data.notification.id, 
      updates: data.notification 
    }})
  }
}
```

## Animation Features

### Bell Animations
- **Badge Pulse**: New notification badge pulses once
- **Loading Spinner**: Animated loading indicator
- **Hover Effects**: Smooth hover transitions

### Dropdown Animations
- **Slide + Fade**: Smooth dropdown appearance
- **Group Expand/Collapse**: Animated height transitions
- **Staggered Items**: Sequential item animations

### Toast Animations
- **Slide In**: From top-right corner
- **Progress Bar**: Countdown animation
- **Hover Effects**: Scale and glow effects

### Mobile Animations
- **Sheet Slide**: Full-screen sheet from bottom
- **Swipe Dismiss**: Swipe-to-dismiss gestures
- **Touch Feedback**: Haptic feedback on interactions

## Accessibility Features

### ARIA Support
- **aria-live="polite"**: For unread count updates
- **aria-label**: Descriptive labels for all interactive elements
- **role="button"**: Proper button roles
- **aria-expanded**: For collapsible groups

### Keyboard Navigation
- **Tab Order**: Logical tab sequence
- **Enter/Space**: Activate buttons and links
- **Escape**: Close dropdowns and modals
- **Arrow Keys**: Navigate within lists

### Screen Reader Support
- **Announcements**: New notification announcements
- **Descriptive Text**: Clear descriptions for all elements
- **State Changes**: Announce state changes

## Customization

### Theme Integration
```tsx
// Customize notification colors
const notificationTheme = {
  colors: {
    post: 'text-blue-600 bg-blue-100',
    chat: 'text-green-600 bg-green-100',
    marketplace: 'text-purple-600 bg-purple-100',
    system: 'text-gray-600 bg-gray-100'
  },
  animations: {
    duration: 0.3,
    easing: 'ease-out'
  }
}
```

### Animation Configuration
```tsx
// Customize animation timings
const animationConfig = {
  bell: {
    pulse: { duration: 2, repeat: Infinity },
    badge: { type: "spring", stiffness: 500, damping: 30 }
  },
  dropdown: {
    slide: { duration: 0.2, ease: "easeOut" },
    stagger: { delay: 0.1 }
  }
}
```

## Mobile Responsiveness

### Breakpoint Behavior
- **Desktop**: Dropdown with hover effects
- **Tablet**: Touch-optimized interactions
- **Mobile**: Full-screen sheet with swipe gestures

### Touch Interactions
- **Swipe to Dismiss**: Swipe left/right to dismiss
- **Pull to Refresh**: Pull down to refresh notifications
- **Long Press**: Context menu for actions

## Performance Optimization

### Lazy Loading
- **Virtual Scrolling**: For large notification lists
- **Image Lazy Loading**: Defer image loading
- **Component Splitting**: Code splitting for better performance

### Memory Management
- **Cleanup**: Proper cleanup of subscriptions
- **Debouncing**: Debounced search and filter inputs
- **Memoization**: React.memo for expensive components

## Testing

### Component Tests
```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { NotificationBell } from '@/components/notifications'

test('renders notification bell with unread count', () => {
  render(<NotificationBell />)
  expect(screen.getByLabelText(/notifications/i)).toBeInTheDocument()
})
```

### Integration Tests
```tsx
test('notification bell opens dropdown on click', () => {
  render(<NotificationBell />)
  fireEvent.click(screen.getByLabelText(/notifications/i))
  expect(screen.getByText('Notifications')).toBeInTheDocument()
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
