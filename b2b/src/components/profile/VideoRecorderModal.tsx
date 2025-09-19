"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Video, 
  Play, 
  Square, 
  Upload, 
  X, 
  RotateCcw,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useVideoRecorder } from '@/hooks/useProfile'
import { VideoProfile } from '@/types/profile'

interface VideoRecorderModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (video: VideoProfile) => void
  currentVideo?: VideoProfile
  className?: string
}

export function VideoRecorderModal({
  isOpen,
  onClose,
  onUpload,
  currentVideo,
  className
}: VideoRecorderModalProps) {
  const [step, setStep] = useState<'setup' | 'recording' | 'preview' | 'uploading' | 'complete'>('setup')
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const { recording, duration, startRecording, stopRecording } = useVideoRecorder()

  useEffect(() => {
    if (recording && duration >= 120) {
      // Auto-stop at 2 minute limit
      handleStopRecording()
    }
  }, [recording, duration])

  const handleStartRecording = async () => {
    setError(null)
    const success = await startRecording()
    if (success) {
      setStep('recording')
    } else {
      setError('Failed to access camera. Please check your permissions.')
    }
  }

  const handleStopRecording = () => {
    stopRecording()
    setStep('preview')
  }

  const handleRetake = () => {
    setVideoBlob(null)
    setVideoUrl(null)
    setStep('setup')
  }

  const handleUpload = async () => {
    if (!videoBlob) return

    setStep('uploading')
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const formData = new FormData()
      formData.append('video', videoBlob, 'profile-video.webm')

      const response = await fetch('/api/profile/upload-video', {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        throw new Error('Failed to upload video')
      }

      const result = await response.json()
      
      if (result.success && result.video) {
        onUpload(result.video)
        setStep('complete')
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed')
      setStep('preview')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleClose = () => {
    setStep('setup')
    setVideoBlob(null)
    setVideoUrl(null)
    setError(null)
    setUploadProgress(0)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            {currentVideo ? 'Update Video Profile' : 'Record Video Profile'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Setup Step */}
          {step === 'setup' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Video className="h-12 w-12 text-primary" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Record Your Video Profile</h3>
                <p className="text-muted-foreground">
                  Create a 2-minute video to introduce yourself and showcase your personality.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-1">Tips for Success</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Good lighting</li>
                    <li>• Clear audio</li>
                    <li>• Professional background</li>
                    <li>• Be yourself!</li>
                  </ul>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-1">Requirements</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Maximum 2 minutes</li>
                    <li>• Camera and microphone access</li>
                    <li>• Stable internet connection</li>
                    <li>• WebM format</li>
                  </ul>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2"
                >
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm text-destructive">{error}</span>
                </motion.div>
              )}

              <Button onClick={handleStartRecording} size="lg">
                <Play className="h-4 w-4 mr-2" />
                Start Recording
              </Button>
            </motion.div>
          )}

          {/* Recording Step */}
          {step === 'recording' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {/* Recording indicator */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-white text-sm font-medium">REC</span>
                </div>

                {/* Timer */}
                <div className="absolute top-4 right-4">
                  <Badge variant="destructive" className="text-white bg-red-500/80">
                    {formatTime(duration)}
                  </Badge>
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                  <motion.div
                    className="h-full bg-red-500"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(duration / 120) * 100}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Recording in progress... Maximum 2 minutes
                </p>
                <Button onClick={handleStopRecording} variant="destructive">
                  <Square className="h-4 w-4 mr-2" />
                  Stop Recording
                </Button>
              </div>
            </motion.div>
          )}

          {/* Preview Step */}
          {step === 'preview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  src={videoUrl || undefined}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex justify-center gap-3">
                <Button onClick={handleRetake} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake
                </Button>
                <Button onClick={handleUpload}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Video
                </Button>
              </div>
            </motion.div>
          )}

          {/* Uploading Step */}
          {step === 'uploading' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Upload className="h-8 w-8 text-primary" />
                </motion.div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Uploading Video</h3>
                <p className="text-muted-foreground">Please wait while we process your video...</p>
              </div>

              <div className="space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-sm text-muted-foreground">{uploadProgress}% complete</p>
              </div>
            </motion.div>
          )}

          {/* Complete Step */}
          {step === 'complete' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Video Uploaded Successfully!</h3>
                <p className="text-muted-foreground">
                  Your video profile has been saved and is now visible on your profile.
                </p>
              </div>

              <Button onClick={handleClose} size="lg">
                Done
              </Button>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
