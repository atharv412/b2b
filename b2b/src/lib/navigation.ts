import { 
  User, 
  Settings, 
  Users, 
  Package, 
  Store, 
  BarChart3, 
  Plus, 
  Bell, 
  MessageCircle, 
  HelpCircle,
  Home
} from 'lucide-react'
import { NavItem, User as UserType } from '@/types/navigation'

export const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    href: '/platform',
    visible: () => true
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    href: '/platform/profile',
    visible: () => true
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/platform/settings',
    visible: () => true
  },
  {
    id: 'connections',
    label: 'Connections',
    icon: Users,
    href: '/platform/network',
    visible: () => true
  },
  {
    id: 'manage-products',
    label: 'Manage Products',
    icon: Package,
    href: '/platform/products',
    visible: (user: UserType) => user.sellerEnabled || user.role === 'company'
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    icon: Store,
    href: '/platform/marketplace',
    visible: () => true
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    href: '/platform/analytics',
    visible: () => true
  },
  {
    id: 'add-post',
    label: 'Add Post',
    icon: Plus,
    href: '/platform/feed?action=create',
    visible: () => true,
    isPrimary: true
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    href: '#notifications',
    visible: () => true
  },
  {
    id: 'chat',
    label: 'Chat',
    icon: MessageCircle,
    href: '#chat',
    visible: () => true
  },
  {
    id: 'support',
    label: 'FAQ & Support',
    icon: HelpCircle,
    href: '/platform/support',
    visible: () => true
  }
]

export const mobileBottomNavItems: NavItem[] = [
  {
    id: 'marketplace',
    label: 'Marketplace',
    icon: Store,
    href: '/platform/marketplace',
    visible: () => true
  },
  {
    id: 'connections',
    label: 'Connections',
    icon: Users,
    href: '/platform/network',
    visible: () => true
  },
  {
    id: 'add-post',
    label: 'Add Post',
    icon: Plus,
    href: '/platform/feed?action=create',
    visible: () => true,
    isPrimary: true
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    href: '#notifications',
    visible: () => true
  },
  {
    id: 'chat',
    label: 'Chat',
    icon: MessageCircle,
    href: '#chat',
    visible: () => true
  }
]

export function canShowItem(user: UserType | null, item: NavItem): boolean {
  if (!user) return false
  if (!item.visible) return true
  return item.visible(user)
}

export function getVisibleItems(user: UserType | null, items: NavItem[]): NavItem[] {
  return items.filter(item => canShowItem(user, item))
}
