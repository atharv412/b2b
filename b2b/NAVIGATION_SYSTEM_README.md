# Navigation System

A comprehensive, accessible, and responsive navigation system for the B2B Platform built with React, TypeScript, shadcn/ui, and framer-motion.

## 🎯 Features

- **Responsive Design**: Desktop, tablet, and mobile-optimized layouts
- **Role-based Visibility**: Items show/hide based on user permissions
- **Real-time Badges**: Unread counts for notifications and chat
- **Accessibility**: Full keyboard navigation and screen reader support
- **Animations**: Smooth micro-interactions with framer-motion
- **Modular Architecture**: Reusable components with clear APIs

## 📁 File Structure

```
src/
├── components/nav/
│   ├── TopNavBar.tsx           # Desktop top navigation
│   ├── SideNav.tsx             # Collapsible side navigation
│   ├── MobileNavDrawer.tsx     # Mobile full-screen drawer
│   ├── BottomActionBar.tsx     # Mobile bottom navigation
│   ├── NavItem.tsx             # Reusable navigation item
│   ├── NotificationsDropdown.tsx # Notifications panel
│   ├── ChatDrawer.tsx          # Chat conversations panel
│   ├── Navigation.tsx          # Main navigation component
│   └── __tests__/              # Component tests
├── context/
│   └── NavContext.tsx          # Navigation state management
├── hooks/
│   ├── useNavVisibility.ts     # Navigation visibility logic
│   └── useUnreadCounts.ts      # Unread counts management
├── lib/
│   └── navigation.ts           # Navigation configuration
├── types/
│   └── navigation.ts           # TypeScript definitions
└── stories/nav/                # Storybook stories
```

## 🚀 Quick Start

### 1. Import and Use

```tsx
import { Navigation } from '@/components/nav/Navigation'
import { NavProvider } from '@/context/NavContext'

function App() {
  return (
    <NavProvider>
      <Navigation />
      {/* Your app content */}
    </NavProvider>
  )
}
```

### 2. Platform Layout Integration

```tsx
import { PlatformLayout } from '@/components/layout/PlatformLayout'

function PlatformPage() {
  return (
    <PlatformLayout>
      <YourPageContent />
    </PlatformLayout>
  )
}
```

## 🎨 Components

### TopNavBar
Desktop top navigation with search, primary actions, and user menu.

**Props:**
- `className?: string` - Additional CSS classes

**Features:**
- Global search with typeahead
- Primary action buttons (Add Post)
- Notifications and chat badges
- User profile dropdown
- Responsive layout for tablet/mobile

### SideNav
Collapsible side navigation for desktop power users.

**Props:**
- `isOpen: boolean` - Whether the side nav is open
- `onClose: () => void` - Close handler
- `className?: string` - Additional CSS classes

**Features:**
- Collapsible with smooth animations
- Role-based item visibility
- Active route highlighting
- Keyboard navigation support

### MobileNavDrawer
Full-screen mobile navigation drawer.

**Props:**
- `isOpen: boolean` - Whether the drawer is open
- `onClose: () => void` - Close handler
- `className?: string` - Additional CSS classes

**Features:**
- Slide-in from right
- Search functionality
- Grouped navigation items
- Touch-friendly interactions

### BottomActionBar
Mobile bottom navigation for quick access.

**Features:**
- Floating action button for Add Post
- Primary navigation items
- Thumb-friendly design
- Smooth animations

### NavItem
Reusable navigation item component.

**Props:**
```tsx
interface NavItemProps {
  item: NavItem
  isActive: boolean
  isCollapsed?: boolean
  onClick?: () => void
  className?: string
}
```

**Features:**
- Icon + label layout
- Badge support
- Active state animations
- Tooltip for collapsed state
- Keyboard accessibility

## 🔧 Configuration

### Navigation Items

Define navigation items in `src/lib/navigation.ts`:

```tsx
export const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    href: '/platform',
    visible: () => true
  },
  {
    id: 'manage-products',
    label: 'Manage Products',
    icon: Package,
    href: '/platform/products',
    visible: (user) => user.sellerEnabled || user.role === 'company'
  }
  // ... more items
]
```

### Role-based Visibility

Items can be conditionally shown based on user properties:

```tsx
{
  id: 'admin-panel',
  label: 'Admin Panel',
  icon: Settings,
  href: '/admin',
  visible: (user) => user.permissions.includes('admin')
}
```

## 🎭 Animations

### Framer Motion Variants

```tsx
const navItemVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.02, y: -2 },
  active: { scale: 1.01, boxShadow: 'var(--shadow-sm)' }
}

const slideInRight = {
  hidden: { x: '100%', opacity: 0 },
  enter: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 140, damping: 20 } },
  exit: { x: '100%', opacity: 0 }
}
```

### Micro-interactions

- **Hover**: Subtle scale and lift effects
- **Tap**: Scale down feedback
- **Badge**: Pulse animation on new items
- **Drawer**: Smooth slide transitions
- **Active**: Animated indicators

## ♿ Accessibility

### Keyboard Navigation

- **Tab**: Navigate through interactive elements
- **Enter/Space**: Activate buttons and links
- **Escape**: Close modals and drawers
- **Arrow Keys**: Navigate side nav items

### Screen Reader Support

- **ARIA Labels**: All interactive elements labeled
- **Role Attributes**: Proper semantic roles
- **Live Regions**: Badge updates announced
- **Focus Management**: Logical tab order

### WCAG Compliance

- **Color Contrast**: Meets AA standards
- **Touch Targets**: Minimum 44x44px
- **Focus Indicators**: Clear focus states
- **Motion**: Respects prefers-reduced-motion

## 🔌 API Integration

### Unread Counts

```tsx
// Fetch unread counts
GET /api/notifications/unread-counts
Response: { notifications: 5, chat: 3 }

// Real-time updates (WebSocket)
subscribeToUnreadCounts((counts) => {
  updateUnreadCounts(counts)
})
```

### User Data

```tsx
// Get current user
GET /api/user
Response: {
  id: string
  name: string
  role: 'individual' | 'company'
  sellerEnabled: boolean
  permissions: string[]
}
```

## 🧪 Testing

### Unit Tests

```bash
npm test src/components/nav
```

### Storybook

```bash
npm run storybook
```

View stories at: `http://localhost:6006`

### Test Coverage

- Component rendering
- User interactions
- Accessibility features
- Animation states
- Role-based visibility

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1023px
- **Desktop**: >= 1024px

### Layout Behavior

- **Mobile**: Top bar + bottom action bar + drawer
- **Tablet**: Compact top bar + drawer
- **Desktop**: Full top bar + optional side nav

## 🎨 Theming

Uses shadcn/ui design tokens:

```css
/* Customize in globals.css */
:root {
  --nav-bg: hsl(var(--background));
  --nav-text: hsl(var(--foreground));
  --nav-accent: hsl(var(--accent));
  --nav-primary: hsl(var(--primary));
}
```

## 🚀 Performance

### Optimizations

- **Lazy Loading**: Components loaded on demand
- **Memoization**: Expensive calculations cached
- **Virtual Scrolling**: Large lists optimized
- **Bundle Splitting**: Code split by route

### Bundle Size

- **Core Navigation**: ~15KB gzipped
- **With Animations**: ~25KB gzipped
- **Full System**: ~35KB gzipped

## 🔧 Customization

### Adding New Items

1. Add to `navigationItems` array
2. Define visibility logic
3. Add icon from lucide-react
4. Update tests and stories

### Custom Animations

```tsx
const customVariants = {
  // Your animation variants
}

<NavItem
  item={item}
  isActive={isActive}
  variants={customVariants}
/>
```

### Styling

```tsx
<NavItem
  item={item}
  isActive={isActive}
  className="custom-nav-item"
/>
```

## 🐛 Troubleshooting

### Common Issues

1. **Navigation not showing**: Check NavProvider is wrapping your app
2. **Badges not updating**: Verify unread counts API is working
3. **Mobile drawer not opening**: Check z-index conflicts
4. **Animations not smooth**: Ensure framer-motion is properly installed

### Debug Mode

```tsx
// Enable debug logging
localStorage.setItem('nav-debug', 'true')
```

## 📚 Examples

### Basic Usage

```tsx
import { Navigation } from '@/components/nav/Navigation'

function App() {
  return (
    <div>
      <Navigation />
      <main>Your content</main>
    </div>
  )
}
```

### Custom Layout

```tsx
import { TopNavBar, SideNav } from '@/components/nav'

function CustomLayout() {
  return (
    <div>
      <TopNavBar />
      <div className="flex">
        <SideNav isOpen={true} onClose={() => {}} />
        <main>Content</main>
      </div>
    </div>
  )
}
```

### With Custom Items

```tsx
import { navigationItems } from '@/lib/navigation'

const customItems = [
  ...navigationItems,
  {
    id: 'custom',
    label: 'Custom Page',
    icon: CustomIcon,
    href: '/custom',
    visible: () => true
  }
]
```

## 🤝 Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure accessibility compliance
5. Test on all breakpoints

## 📄 License

MIT License - see LICENSE file for details.
