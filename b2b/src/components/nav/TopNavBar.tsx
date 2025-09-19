"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Search, Menu, Bell, MessageCircle, Plus, User, Settings, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { useNav } from '@/context/NavContext'
import { cn } from '@/lib/utils'

const fadeScale = {
  hidden: { opacity: 0, scale: 0.98 },
  enter: { opacity: 1, scale: 1, transition: { duration: 0.18 } }
}

const slideInRight = {
  hidden: { opacity: 0, x: 20 },
  enter: { opacity: 1, x: 0, transition: { duration: 0.2 } }
}

interface TopNavBarProps {
  className?: string
}

export function TopNavBar({ className }: TopNavBarProps) {
  const { 
    user, 
    unreadCounts, 
    isSideNavOpen, 
    setSideNavOpen, 
    setMobileNavOpen,
    setActiveRoute 
  } = useNav()

  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const router = useRouter()

  const handleSearchFocus = () => {
    setIsSearchFocused(true)
  }

  const handleSearchBlur = () => {
    setIsSearchFocused(false)
  }

  const handleAddPost = () => {
    console.log('Add Post clicked')
    router.push('/platform/feed?action=create')
  }

  const handleNotifications = () => {
    console.log('Notifications clicked')
    router.push('/platform/notifications')
  }

  const handleMessages = () => {
    console.log('Messages clicked')
    router.push('/platform/messages')
  }

  const handleProfile = () => {
    console.log('Profile clicked')
    router.push('/platform/profile')
  }

  const handleSettings = () => {
    console.log('Settings clicked')
    router.push('/platform/settings')
  }

  const handleConnections = () => {
    console.log('Connections clicked')
    router.push('/platform/network')
  }

  const handleSignOut = () => {
    console.log('Sign out clicked')
    // Add sign out logic here
    router.push('/auth')
  }

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="nav-container">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden h-9 w-9 p-0"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>

            {/* Desktop Side Nav Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex h-9 w-9 p-0"
              onClick={() => setSideNavOpen(!isSideNavOpen)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle side navigation</span>
            </Button>

            {/* Logo */}
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">B2B</span>
              </div>
              <span className="hidden sm:block font-bold text-lg">Platform</span>
            </motion.div>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 max-w-md mx-4">
            <motion.div
              animate={isSearchFocused ? { scale: 1.02 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground h-9 px-3"
                onClick={handleSearchFocus}
              >
                <Search className="h-4 w-4 mr-2" aria-hidden="true" />
                Search people, companies, products...
              </Button>
            </motion.div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3"
                onClick={() => setActiveRoute('/dashboard')}
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3"
                onClick={() => setActiveRoute('/profile')}
              >
                Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3"
                onClick={() => setActiveRoute('/settings')}
              >
                Settings
              </Button>
            </div>

            {/* Add Post Button */}
            <Button 
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleAddPost()
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg h-9 px-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Post</span>
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleNotifications()
              }}
              className="relative h-9 w-9 p-0"
            >
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              {unreadCounts.notifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="h-5 w-5 flex items-center justify-center p-0 text-xs absolute -top-1 -right-1"
                >
                  {unreadCounts.notifications}
                </Badge>
              )}
            </Button>

            {/* Messages */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleMessages()
              }}
              className="relative h-9 w-9 p-0"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="sr-only">Messages</span>
              {unreadCounts.messages > 0 && (
                <Badge 
                  variant="destructive" 
                  className="h-5 w-5 flex items-center justify-center p-0 text-xs absolute -top-1 -right-1"
                >
                  {unreadCounts.messages}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full p-0"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <motion.div
                  variants={fadeScale}
                  initial="hidden"
                  animate="enter"
                >
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.name || 'User'}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleProfile()
                  }}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleSettings()
                  }}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleConnections()
                  }}>
                    <Users className="mr-2 h-4 w-4" />
                    <span>Connections</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleSignOut()
                  }} className="text-red-600">
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </motion.div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
