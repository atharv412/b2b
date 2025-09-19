"use client"

import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Image, 
  Video, 
  FileText, 
  Upload, 
  X,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MediaUploaderProps {
  onFileSelect: (file: File) => void
  children?: React.ReactNode
  className?: string
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
}

export function MediaUploader({ 
  onFileSelect, 
  children,
  className,
  accept = "image/*,video/*,.pdf,.doc,.docx,.txt",
  multiple = true,
  maxSize = 10
}: MediaUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach(file => {
      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`)
        return
      }

      // Validate file type
      const fileType = file.type
      const isValidType = accept.split(',').some(type => {
        const cleanType = type.trim()
        if (cleanType.endsWith('/*')) {
          return fileType.startsWith(cleanType.slice(0, -1))
        }
        return fileType === cleanType
      })

      if (!isValidType) {
        alert(`File ${file.name} is not a supported type.`)
        return
      }

      onFileSelect(file)
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image
    if (file.type.startsWith('video/')) return Video
    return FileText
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (children) {
    return (
      <div onClick={handleClick} className={className}>
        {children}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-lg p-6 transition-colors",
        isDragOver 
          ? "border-primary bg-primary/5" 
          : "border-muted-foreground/25 hover:border-muted-foreground/50",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      <div className="text-center">
        <motion.div
          animate={{ scale: isDragOver ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        </motion.div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">
            {isDragOver ? 'Drop files here' : 'Upload files'}
          </h3>
          <p className="text-sm text-muted-foreground">
            Drag and drop files here, or click to select
          </p>
          <p className="text-xs text-muted-foreground">
            Supports images, videos, and documents (max {maxSize}MB)
          </p>
        </div>

        <div className="mt-4 flex justify-center gap-2">
          <Button variant="outline" size="sm">
            <Image className="h-4 w-4 mr-2" />
            Images
          </Button>
          <Button variant="outline" size="sm">
            <Video className="h-4 w-4 mr-2" />
            Videos
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </Button>
        </div>
      </div>

      {/* Drag Over Overlay */}
      {isDragOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-primary/10 rounded-lg flex items-center justify-center"
        >
          <div className="text-center">
            <Upload className="h-16 w-16 mx-auto mb-2 text-primary" />
            <p className="text-lg font-medium text-primary">Drop files here</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
