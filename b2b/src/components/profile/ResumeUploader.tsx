"use client"

import React, { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Download,
  Eye,
  EyeOff,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useResumeParser } from '@/hooks/useProfile'
import { Resume, ParsedResumeData } from '@/types/profile'
import { formatDistanceToNow } from 'date-fns'

interface ResumeUploaderProps {
  currentResume?: Resume
  onUpload: (resume: Resume) => void
  onParse: (parsedData: ParsedResumeData) => void
  onDelete: () => void
  className?: string
}

export function ResumeUploader({
  currentResume,
  onUpload,
  onParse,
  onDelete,
  className
}: ResumeUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [isPublic, setIsPublic] = useState(currentResume?.isPublic ?? true)
  const { parsing, progress, parseResume } = useResumeParser()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setIsDragActive(false)
    const result = await parseResume(file)

    if (result.success && result.resume) {
      onUpload(result.resume)
      if (result.parsedData) {
        onParse(result.parsedData)
      }
    }
  }, [parseResume, onUpload, onParse])

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Resume
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentResume ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Current Resume */}
            <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{currentResume.fileName}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{formatFileSize(currentResume.fileSize)}</span>
                  <span>•</span>
                  <span>Uploaded {formatDistanceToNow(new Date(currentResume.uploadedAt), { addSuffix: true })}</span>
                  <span>•</span>
                  <span>{currentResume.downloadCount} downloads</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={currentResume.fileUrl} download target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDelete}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="resume-visibility" className="text-sm font-medium">
                  Resume Visibility
                </Label>
                <p className="text-xs text-muted-foreground">
                  {isPublic ? 'Anyone can view and download your resume' : 'Only you can view your resume'}
                </p>
              </div>
              <Switch
                id="resume-visibility"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>

            {/* Parsed Data Preview */}
            {currentResume.parsedData && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Parsed Information</span>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    Resume successfully parsed! Personal information, experience, education, and skills have been extracted and can be used to auto-fill your profile.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Upload Area */}
            <div
              {...getRootProps()}
              className={cn(
                'relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                isDragActive && !isDragReject && 'border-primary bg-primary/5',
                isDragReject && 'border-destructive bg-destructive/5',
                !isDragActive && 'border-muted-foreground/25 hover:border-muted-foreground/50'
              )}
            >
              <input {...getInputProps()} />
              
              <motion.div
                animate={{ 
                  scale: isDragActive ? 1.1 : 1,
                  rotate: isDragActive ? 5 : 0
                }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              </motion.div>
              
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  {isDragActive ? 'Drop your resume here' : 'Upload your resume'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Drag and drop a PDF, DOC, or DOCX file, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Maximum file size: 10MB
                </p>
              </div>

              {isDragReject && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 bg-destructive/10 border-destructive rounded-lg flex items-center justify-center"
                >
                  <div className="text-center">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
                    <p className="text-sm font-medium text-destructive">
                      Invalid file type
                    </p>
                    <p className="text-xs text-destructive">
                      Please upload a PDF, DOC, or DOCX file
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Parsing Progress */}
            <AnimatePresence>
              {parsing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <FileText className="h-4 w-4 text-blue-600" />
                    </motion.div>
                    <span className="text-sm font-medium">Parsing resume...</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      {progress}% complete
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Benefits */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Why upload your resume?</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Auto-fill your profile with parsed information</li>
                <li>• Make it easy for employers to download your resume</li>
                <li>• Track download analytics and profile views</li>
                <li>• Control visibility with privacy settings</li>
              </ul>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
