"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNav } from '@/context/NavContext'
import { navigationItems, getVisibleItems } from '@/lib/navigation'
import { NavItem } from './NavItem'
import { cn } from '@/lib/utils'

const slideInRight = {
  hidden: { x: '100%', opacity: 0 },
  enter: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 140, damping: 20 } },
  exit: { x: '100%', opacity: 0 }
}

const fadeIn = {
  hidden: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
}

interface MobileNavDrawerProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function MobileNavDrawer({ isOpen, onClose, className }: MobileNavDrawerProps) {
  const { user, activeRoute, setActiveRoute } = useNav()
  const [searchQuery, setSearchQuery] = useState('')
  
  const visibleItems = getVisibleItems(user, navigationItems)
  const regularItems = visibleItems.filter(item => !item.isPrimary && !item.href.startsWith('#'))
  const actionItems = visibleItems.filter(item => item.href.startsWith('#'))

  const handleItemClick = (href: string) => {
    if (href.startsWith('#')) {
      // Handle special actions
      if (href === '#notifications') {
        console.log('Open notifications')
      } else if (href === '#chat') {
        console.log('Open chat')
      }
    } else {
      setActiveRoute(href)
      onClose() // Close drawer after navigation
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="enter"
            exit="hidden"
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate="enter"
            exit="hidden"
            className={cn(
              "fixed right-0 top-0 z-50 h-full w-full max-w-sm bg-background border-l",
              className
            )}
          >
            <div className="flex h-16 items-center justify-between px-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>

            <div className="p-4">
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <ScrollArea className="h-[calc(100vh-8rem)]">
                <nav className="space-y-2" role="navigation" aria-label="Mobile navigation">
                  {/* Regular Navigation Items */}
                  <div className="space-y-1">
                    {regularItems.map((item) => (
                      <NavItem
                        key={item.id}
                        item={item}
                        isActive={activeRoute === item.href}
                        onClick={() => handleItemClick(item.href)}
                      />
                    ))}
                  </div>

                  {/* Action Items */}
                  {actionItems.length > 0 && (
                    <>
                      <div className="my-4 h-px bg-border" />
                      <div className="space-y-1">
                        {actionItems.map((item) => (
                          <NavItem
                            key={item.id}
                            item={item}
                            isActive={false}
                            onClick={() => handleItemClick(item.href)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </nav>
              </ScrollArea>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
