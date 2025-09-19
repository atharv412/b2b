"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Home, 
  User, 
  Settings, 
  Users, 
  Building2, 
  BarChart3, 
  HelpCircle, 
  Bell, 
  MessageCircle,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNav } from '@/context/NavContext'
import { cn } from '@/lib/utils'

const slideInLeft = {
  hidden: { opacity: 0, x: -300 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    x: -300,
    transition: { duration: 0.2, ease: "easeIn" }
  }
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.2 }
  }
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

interface SideNavProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/platform' },
  { id: 'profile', label: 'Profile', icon: User, href: '/platform/profile' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/platform/settings' },
  { id: 'connections', label: 'Connections', icon: Users, href: '/platform/network' },
  { id: 'marketplace', label: 'Marketplace', icon: Building2, href: '/platform/marketplace' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/platform/analytics' },
  { id: 'support', label: 'FAQ & Support', icon: HelpCircle, href: '/platform/support' },
  { id: 'notifications', label: 'Notifications', icon: Bell, href: '/platform/notifications', badge: true },
  { id: 'messages', label: 'Messages', icon: MessageCircle, href: '/platform/messages', badge: true }
]

export function SideNav({ isOpen, onClose, className }: SideNavProps) {
  const { 
    user, 
    unreadCounts, 
    activeRoute, 
    setActiveRoute 
  } = useNav()
  const router = useRouter()

  const handleItemClick = (href: string) => {
    setActiveRoute(href)
    router.push(href)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.aside
            variants={slideInLeft}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "fixed left-0 top-0 z-50 h-full bg-background border-r w-64 lg:relative lg:z-auto lg:translate-x-0",
              className
            )}
          >
            <div className="flex h-16 items-center justify-between px-4 border-b">
              <motion.div 
                className="flex items-center gap-2"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
              >
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">B2B</span>
                </div>
                <span className="font-bold text-lg">Platform</span>
              </motion.div>
              
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden h-8 w-8 p-0"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close navigation</span>
                </Button>
              </motion.div>
            </div>

            <ScrollArea className="h-sidebar">
              <motion.div 
                className="p-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <nav className="space-y-2" role="navigation" aria-label="Main navigation">
                  {navigationItems.map((item, index) => {
                    const Icon = item.icon
                    const isActive = activeRoute === item.href
                    const badgeCount = item.badge ? 
                      (item.id === 'notifications' ? unreadCounts.notifications : unreadCounts.messages) : 0

                    return (
                      <motion.div
                        key={item.id}
                        variants={itemVariants}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant={isActive ? "default" : "ghost"}
                          className={cn(
                            "w-full justify-start h-10 px-3",
                            isActive && "bg-primary text-primary-foreground shadow-sm"
                          )}
                          onClick={() => handleItemClick(item.href)}
                        >
                          <Icon className="h-4 w-4 mr-3" />
                          <span className="flex-1 text-left">{item.label}</span>
                          {badgeCount > 0 && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-2"
                            >
                              <Badge 
                                variant="destructive" 
                                className="h-5 w-5 flex items-center justify-center p-0 text-xs"
                              >
                                {badgeCount}
                              </Badge>
                            </motion.div>
                          )}
                        </Button>
                      </motion.div>
                    )
                  })}
                </nav>
              </motion.div>
            </ScrollArea>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
