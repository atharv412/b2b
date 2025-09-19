"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { 
  File, 
  Image, 
  Video, 
  Download, 
  X, 
  Eye,
  FileText,
  Music
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Attachment {
  id: string
  name: string
  type: 'image' | 'video' | 'file' | 'audio'
  url: string
  size?: number
}

interface AttachmentPreviewProps {
  attachment: Attachment
  isOwn?: boolean
  showRemove?: boolean
  onRemove?: () => void
  className?: string
}

const getFileIcon = (type: string) => {
  switch (type) {
    case 'image':
      return <Image className="h-4 w-4" />
    case 'video':
      return <Video className="h-4 w-4" />
    case 'audio':
      return <Music className="h-4 w-4" />
    default:
      return <FileText className="h-4 w-4" />
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function AttachmentPreview({ 
  attachment, 
  isOwn = false, 
  showRemove = false,
  onRemove,
  className 
}: AttachmentPreviewProps) {
  const isImage = attachment.type === 'image'
  const isVideo = attachment.type === 'video'
  const isAudio = attachment.type === 'audio'

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = attachment.url
    link.download = attachment.name
    link.click()
  }

  const handlePreview = () => {
    window.open(attachment.url, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative group max-w-xs",
        className
      )}
    >
      {/* Image/Video Preview */}
      {(isImage || isVideo) && (
        <div className="relative rounded-lg overflow-hidden bg-muted">
          {isImage ? (
            <img
              src={attachment.url}
              alt={attachment.name}
              className="w-full h-32 object-cover"
            />
          ) : (
            <video
              src={attachment.url}
              className="w-full h-32 object-cover"
              controls
            />
          )}
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePreview}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownload}
              className="h-8 w-8 p-0"
            >
              <Download className="h-4 w-4" />
            </Button>
            {showRemove && onRemove && (
              <Button
                variant="destructive"
                size="sm"
                onClick={onRemove}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* File Preview */}
      {!isImage && !isVideo && (
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-lg border bg-muted/50",
          isOwn ? "bg-primary/10" : "bg-muted/50"
        )}>
          <div className="flex-shrink-0">
            {getFileIcon(attachment.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {attachment.name}
            </p>
            {attachment.size && (
              <p className="text-xs text-muted-foreground">
                {formatFileSize(attachment.size)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-6 w-6 p-0"
            >
              <Download className="h-3 w-3" />
            </Button>
            {showRemove && onRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Audio Preview */}
      {isAudio && (
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-lg border bg-muted/50",
          isOwn ? "bg-primary/10" : "bg-muted/50"
        )}>
          <div className="flex-shrink-0">
            <Music className="h-6 w-6 text-muted-foreground" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {attachment.name}
            </p>
            {attachment.size && (
              <p className="text-xs text-muted-foreground">
                {formatFileSize(attachment.size)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <audio controls className="h-6">
              <source src={attachment.url} />
            </audio>
            {showRemove && onRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}
