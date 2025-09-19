"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Plus, Edit3, Image, Video, FileText, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'

// Animation variants
const buttonVariants = {
  idle: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { type: 'spring' as const, stiffness: 400, damping: 25 }
  },
  tap: { 
    scale: 0.95,
    transition: { type: 'spring' as const, stiffness: 400, damping: 25 }
  }
}

const iconVariants = {
  idle: { rotate: 0 },
  hover: { 
    rotate: 90,
    transition: { duration: 0.3 }
  }
}

interface AddPostButtonProps {
  onClick: () => void
  variant?: 'default' | 'floating' | 'minimal'
  className?: string
}

export function AddPostButton({ 
  onClick, 
  variant = 'default',
  className 
}: AddPostButtonProps) {
  if (variant === 'floating') {
    return (
      <motion.div
        className={cn(
          'fixed bottom-6 right-6 z-50',
          className
        )}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: 'spring',
          stiffness: 300,
          damping: 30
        }}
      >
        <motion.div
          variants={buttonVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            onClick={onClick}
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            aria-label="Create new post"
          >
            <motion.div
              variants={iconVariants}
              initial="idle"
              whileHover="hover"
            >
              <Plus className="h-6 w-6" />
            </motion.div>
          </Button>
        </motion.div>
      </motion.div>
    )
  }

  if (variant === 'minimal') {
    return (
      <motion.div
        variants={buttonVariants}
        initial="idle"
        whileHover="hover"
        whileTap="tap"
      >
        <Button
          onClick={onClick}
          variant="ghost"
          className={cn(
            'h-10 px-3 gap-2 text-muted-foreground hover:text-foreground',
            className
          )}
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm">Post</span>
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={buttonVariants}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
    >
      <Button
        onClick={onClick}
        className={cn(
          'h-12 px-6 gap-2 font-medium',
          className
        )}
      >
        <motion.div
          variants={iconVariants}
          initial="idle"
          whileHover="hover"
        >
          <Plus className="h-5 w-5" />
        </motion.div>
        Create Post
      </Button>
    </motion.div>
  )
}

// Post type selector component
interface PostTypeSelectorProps {
  onSelectType: (type: 'text' | 'image' | 'video' | 'product') => void
  className?: string
}

export function PostTypeSelector({ 
  onSelectType, 
  className 
}: PostTypeSelectorProps) {
  const postTypes = [
    {
      type: 'text' as const,
      icon: Edit3,
      label: 'Text Post',
      description: 'Share your thoughts'
    },
    {
      type: 'image' as const,
      icon: Image,
      label: 'Image',
      description: 'Share photos'
    },
    {
      type: 'video' as const,
      icon: Video,
      label: 'Video',
      description: 'Share videos'
    },
    {
      type: 'product' as const,
      icon: ShoppingBag,
      label: 'Product',
      description: 'List a product'
    }
  ]

  return (
    <div className={cn('grid grid-cols-2 gap-3', className)}>
      {postTypes.map(({ type, icon: Icon, label, description }) => (
        <motion.div
          key={type}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="outline"
            onClick={() => onSelectType(type)}
            className="h-20 flex-col gap-2 hover:bg-primary/5 hover:border-primary/20"
          >
            <Icon className="h-5 w-5" />
            <div className="text-center">
              <div className="text-sm font-medium">{label}</div>
              <div className="text-xs text-muted-foreground">{description}</div>
            </div>
          </Button>
        </motion.div>
      ))}
    </div>
  )
}
