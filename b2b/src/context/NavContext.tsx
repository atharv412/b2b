"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { NavContextType, User, UnreadCounts } from '@/types/navigation'

const NavContext = createContext<NavContextType | undefined>(undefined)

interface NavProviderProps {
  children: ReactNode
}

export function NavProvider({ children }: NavProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [unreadCounts, setUnreadCounts] = useState<UnreadCounts>({
    notifications: 0,
    messages: 0
  })
  const [isSideNavOpen, setIsSideNavOpen] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [activeRoute, setActiveRoute] = useState('/')

  // Initialize user data
  useEffect(() => {
    const initializeUser = () => {
      // Mock user data - replace with actual auth logic
      const mockUser: User = {
        id: '1',
        name: 'Ram Sharma',
        email: 'ram.sharma@example.com',
        role: 'individual',
        sellerEnabled: false,
        avatarUrl: '/avatars/john.jpg',
        permissions: ['read', 'write']
      }
      setUser(mockUser)
    }

    initializeUser()
  }, [])

  // Load unread counts
  useEffect(() => {
    const loadUnreadCounts = async () => {
      try {
        const response = await fetch('/api/notifications/unread-counts')
        if (response.ok) {
          const counts = await response.json()
          setUnreadCounts(counts)
        } else {
          // Mock data for development
          setUnreadCounts({
            notifications: 3,
            messages: 5
          })
        }
      } catch (error) {
        console.error('Failed to load unread counts:', error)
        // Mock data for development
        setUnreadCounts({
          notifications: 3,
          messages: 5
        })
      }
    }

    loadUnreadCounts()
  }, [])

  // Update active route based on current path
  useEffect(() => {
    const updateActiveRoute = () => {
      setActiveRoute(window.location.pathname)
    }

    updateActiveRoute()
    window.addEventListener('popstate', updateActiveRoute)
    return () => window.removeEventListener('popstate', updateActiveRoute)
  }, [])

  const updateUnreadCounts = (counts: Partial<UnreadCounts>) => {
    setUnreadCounts(prev => ({ ...prev, ...counts }))
  }

  const value: NavContextType = {
    user,
    unreadCounts,
    isSideNavOpen,
    isMobileNavOpen,
    activeRoute,
    setSideNavOpen: setIsSideNavOpen,
    setMobileNavOpen: setIsMobileNavOpen,
    setActiveRoute,
    updateUnreadCounts
  }

  return (
    <NavContext.Provider value={value}>
      {children}
    </NavContext.Provider>
  )
}

export function useNav() {
  const context = useContext(NavContext)
  if (context === undefined) {
    throw new Error('useNav must be used within a NavProvider')
  }
  return context
}
