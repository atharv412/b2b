"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/nav/Navigation'
import { useNav } from '@/context/NavContext'
import { cn } from '@/lib/utils'

interface PlatformLayoutProps {
  children: React.ReactNode
  className?: string
}

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0
  }
}

export function PlatformLayout({ children, className }: PlatformLayoutProps) {
  const { isSideNavOpen } = useNav()

  return (
    <div className="min-h-screen-safe bg-background">
      {/* Navigation System */}
      <Navigation />

      {/* Main Layout Container */}
      <div className="flex min-h-screen-safe">
        {/* Main Content Area */}
        <motion.main 
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out",
            // Adjust margin for side nav when open on desktop
            isSideNavOpen ? "lg:ml-64" : "lg:ml-0",
            // Add proper spacing and padding
            "pt-0"
          )}
          // @ts-ignore
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Content Container with proper spacing */}
          <div className="nav-container py-6">
            <motion.div 
              className="animate-fade-in"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              {children}
            </motion.div>
          </div>
        </motion.main>
      </div>

      {/* Mobile bottom spacing for bottom action bar */}
      <div className="h-16 md:hidden" />
    </div>
  )
}
