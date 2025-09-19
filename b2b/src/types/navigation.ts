export interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  badge?: number
  visible?: (user: User) => boolean
  permission?: string
  isPrimary?: boolean
  isExternal?: boolean
}

export interface User {
  id: string
  name: string
  email: string
  role: 'individual' | 'company'
  sellerEnabled: boolean
  avatarUrl?: string
  permissions: string[]
}

export interface UnreadCounts {
  notifications: number
  messages: number
}

export interface NavContextType {
  user: User | null
  unreadCounts: UnreadCounts
  isSideNavOpen: boolean
  isMobileNavOpen: boolean
  activeRoute: string
  setSideNavOpen: (open: boolean) => void
  setMobileNavOpen: (open: boolean) => void
  setActiveRoute: (route: string) => void
  updateUnreadCounts: (counts: Partial<UnreadCounts>) => void
}

export interface NavItemProps {
  item: NavItem
  isActive: boolean
  isCollapsed?: boolean
  onClick?: () => void
  className?: string
}

export interface TopNavBarProps {
  className?: string
}

export interface SideNavProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export interface MobileNavDrawerProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export interface BottomActionBarProps {
  className?: string
}

export interface NotificationsDropdownProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export interface ChatDrawerProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}
