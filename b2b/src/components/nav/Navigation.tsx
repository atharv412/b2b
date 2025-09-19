"use client"

import React from 'react'
import { TopNavBar } from './TopNavBar'
import { SideNav } from './SideNav'
import { MobileNavDrawer } from './MobileNavDrawer'
import { BottomActionBar } from './BottomActionBar'
import { NotificationsDropdown } from './NotificationsDropdown'
import { ChatDrawer } from './ChatDrawer'
import { useNav } from '@/context/NavContext'
import { cn } from '@/lib/utils'

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  const { 
    isSideNavOpen, 
    isMobileNavOpen, 
    setSideNavOpen, 
    setMobileNavOpen 
  } = useNav()

  return (
    <>
      {/* Top Navigation Bar */}
      <TopNavBar />

      {/* Desktop Side Navigation */}
      <SideNav 
        isOpen={isSideNavOpen} 
        onClose={() => setSideNavOpen(false)} 
      />

      {/* Mobile Navigation Drawer */}
      <MobileNavDrawer 
        isOpen={isMobileNavOpen} 
        onClose={() => setMobileNavOpen(false)} 
      />

      {/* Mobile Bottom Action Bar */}
      <div className="md:hidden">
        <BottomActionBar />
      </div>

      {/* Notifications Dropdown */}
      <NotificationsDropdown 
        isOpen={false} 
        onClose={() => {}} 
      />

      {/* Chat Drawer */}
      <ChatDrawer 
        isOpen={false} 
        onClose={() => {}} 
      />
    </>
  )
}

export default Navigation
