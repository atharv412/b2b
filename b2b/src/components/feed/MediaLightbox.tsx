"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Share2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Play,
  Pause
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Animation variants
const lightboxVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
}

const mediaVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    scale: 0.8, 
    opacity: 0,
    transition: { duration: 0.2 }
  }
}

interface MediaItem {
  id: string
  type: 'image' | 'video'
  url: string
  alt?: string
  thumbnail?: string
}

interface MediaLightboxProps {
  isOpen: boolean
  onClose: () => void
  media: MediaItem[]
  initialIndex?: number
  className?: string
}

export function MediaLightbox({
  isOpen,
  onClose,
  media,
  initialIndex = 0,
  className
}: MediaLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const currentMedia = media[currentIndex]

  // Reset state when lightbox opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
      setZoom(1)
      setRotation(0)
      setIsPlaying(false)
    }
  }, [isOpen, initialIndex])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          handlePrevious()
          break
        case 'ArrowRight':
          handleNext()
          break
        case '+':
        case '=':
          e.preventDefault()
          setZoom(prev => Math.min(prev + 0.2, 3))
          break
        case '-':
          e.preventDefault()
          setZoom(prev => Math.max(prev - 0.2, 0.5))
          break
        case 'r':
          e.preventDefault()
          setRotation(prev => (prev + 90) % 360)
          break
        case ' ':
          e.preventDefault()
          if (currentMedia?.type === 'video') {
            setIsPlaying(prev => !prev)
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentMedia, onClose])

  const handlePrevious = () => {
    setCurrentIndex(prev => 
      prev === 0 ? media.length - 1 : prev - 1
    )
  }

  const handleNext = () => {
    setCurrentIndex(prev => 
      prev === media.length - 1 ? 0 : prev + 1
    )
  }

  const handleDownload = () => {
    if (currentMedia) {
      const link = document.createElement('a')
      link.href = currentMedia.url
      link.download = currentMedia.alt || 'media'
      link.click()
    }
  }

  const handleShare = async () => {
    if (navigator.share && currentMedia) {
      try {
        await navigator.share({
          title: currentMedia.alt || 'Media',
          url: currentMedia.url
        })
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(currentMedia.url)
      }
    } else {
      navigator.clipboard.writeText(currentMedia?.url || '')
    }
  }

  if (!isOpen || !currentMedia) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        variants={lightboxVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={cn(
          'fixed inset-0 z-50 bg-black/90 backdrop-blur-sm',
          'flex items-center justify-center',
          className
        )}
        onClick={onClose}
      >
        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 h-10 w-10 p-0 text-white hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Navigation buttons */}
        {media.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handlePrevious()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 p-0 text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 p-0 text-white hover:bg-white/20"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Media content */}
        <div
          className="relative max-w-[90vw] max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            variants={mediaVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transformOrigin: 'center'
            }}
          >
            {currentMedia.type === 'image' ? (
              <img
                src={currentMedia.url}
                alt={currentMedia.alt || 'Media'}
                className="max-w-full max-h-full object-contain rounded-lg"
                draggable={false}
              />
            ) : (
              <video
                src={currentMedia.url}
                className="max-w-full max-h-full object-contain rounded-lg"
                controls={isPlaying}
                autoPlay={isPlaying}
                loop
                muted
                playsInline
              />
            )}
          </motion.div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-2">
            {/* Zoom controls */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setZoom(prev => Math.max(prev - 0.2, 0.5))
              }}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <span className="text-white text-sm min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setZoom(prev => Math.min(prev + 0.2, 3))
              }}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>

            {/* Rotate button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setRotation(prev => (prev + 90) % 360)
              }}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <RotateCw className="h-4 w-4" />
            </Button>

            {/* Play/Pause for videos */}
            {currentMedia.type === 'video' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsPlaying(prev => !prev)
                }}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            )}

            {/* Download button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleDownload()
              }}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <Download className="h-4 w-4" />
            </Button>

            {/* Share button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleShare()
              }}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Thumbnail strip */}
        {media.length > 1 && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
            <div className="flex gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-2">
              {media.map((item, index) => (
                <button
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentIndex(index)
                  }}
                  className={cn(
                    'w-12 h-12 rounded overflow-hidden border-2 transition-colors',
                    index === currentIndex 
                      ? 'border-white' 
                      : 'border-transparent hover:border-white/50'
                  )}
                >
                  <img
                    src={item.thumbnail || item.url}
                    alt={item.alt || 'Thumbnail'}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Media counter */}
        {media.length > 1 && (
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
              <span className="text-white text-sm">
                {currentIndex + 1} / {media.length}
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
