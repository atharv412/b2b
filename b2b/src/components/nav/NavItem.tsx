"use client"

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { NavItemProps } from '@/types/navigation'

const navItemVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.02, y: -1 },
  active: { scale: 1.01, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }
}

const activeIndicatorVariants = {
  inactive: { width: 0, opacity: 0 },
  active: { width: 4, opacity: 1 },
  hover: { width: 2, opacity: 0.5 }
}

const underlineVariants = {
  inactive: { width: 0, opacity: 0 },
  active: { width: '100%', opacity: 1 },
  hover: { width: '50%', opacity: 0.5 }
}

export function NavItem({ 
  item, 
  isActive, 
  isCollapsed = false, 
  onClick,
  className 
}: NavItemProps) {
  const Icon = item.icon

  const handleClick = () => {
    if (item.href.startsWith('#')) {
      // Handle special actions like notifications/chat
      onClick?.()
    } else {
      // Regular navigation
      onClick?.()
    }
  }

  const content = (
    <motion.div
      variants={navItemVariants}
      initial="idle"
      whileHover="hover"
      whileTap="active"
      className={cn(
        "nav-item",
        isActive 
          ? "nav-item-active" 
          : "nav-item-hover",
        item.isPrimary && "bg-primary text-primary-foreground shadow-lg",
        className
      )}
      onClick={handleClick}
    >
      {/* Active indicator for side nav */}
      {!isCollapsed && (
        <motion.div
          variants={activeIndicatorVariants}
          animate={isActive ? "active" : "inactive"}
          whileHover="hover"
          className="absolute left-0 top-0 bottom-0 bg-primary rounded-r-full"
        />
      )}

      <div className="relative">
        <Icon className="h-5 w-5" />
        {item.badge && item.badge > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="nav-badge"
          >
            {item.badge > 99 ? '99+' : item.badge}
          </motion.div>
        )}
      </div>

      {!isCollapsed && (
        <span className="font-medium truncate">
          {item.label}
        </span>
      )}

      {/* Underline for top nav */}
      {isCollapsed && (
        <motion.div
          variants={underlineVariants}
          animate={isActive ? "active" : "inactive"}
          whileHover="hover"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
        />
      )}
    </motion.div>
  )

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{item.label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  if (item.href.startsWith('#')) {
    return (
      <button
        className="w-full text-left"
        aria-current={isActive ? 'page' : undefined}
        aria-label={item.label}
      >
        {content}
      </button>
    )
  }

  return (
    <Link
      href={item.href}
      className="block"
      aria-current={isActive ? 'page' : undefined}
    >
      {content}
    </Link>
  )
}
