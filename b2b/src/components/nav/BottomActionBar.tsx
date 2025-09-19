"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Plus, Home, Users, MessageCircle, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNav } from '@/context/NavContext'
import { cn } from '@/lib/utils'

const floatUp = {
  hidden: { opacity: 0, y: 100 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
}

const bounceIn = {
  hidden: { scale: 0 },
  visible: { 
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 200,
      damping: 15
    }
  }
}

interface BottomActionBarProps {
  className?: string
}

export function BottomActionBar({ className }: BottomActionBarProps) {
  const { 
    unreadCounts, 
    activeRoute, 
    setActiveRoute 
  } = useNav()
  const router = useRouter()

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home', href: '/platform' },
    { id: 'connections', icon: Users, label: 'Connections', href: '/platform/network' },
    { id: 'messages', icon: MessageCircle, label: 'Messages', href: '/platform/messages', badge: unreadCounts.messages },
    { id: 'notifications', icon: Bell, label: 'Notifications', href: '/platform/notifications', badge: unreadCounts.notifications }
  ]

  const handleItemClick = (href: string) => {
    setActiveRoute(href)
    router.push(href)
  }

  const handleAddPost = () => {
    router.push('/platform/feed?action=create')
  }

  return (
    <motion.div
      // @ts-ignore
      variants={floatUp}
      initial="hidden"
      animate="visible"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t",
        className
      )}
    >
      <div className="flex h-16 items-center justify-around px-4">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const isActive = activeRoute === item.href

          return (
            <motion.div
              key={item.id}
              variants={bounceIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "relative h-12 w-12 p-0 flex flex-col items-center justify-center gap-1",
                  isActive && "text-primary"
                )}
                onClick={() => handleItemClick(item.href)}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Badge 
                      variant="destructive" 
                      className="h-4 w-4 flex items-center justify-center p-0 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  </motion.div>
                )}
              </Button>
            </motion.div>
          )
        })}

        {/* Floating Add Button */}
        <motion.div
          variants={bounceIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative"
        >
          <Button
            size="lg"
            onClick={handleAddPost}
            className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
          >
            <Plus className="h-6 w-6" />
            <span className="sr-only">Add Post</span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
