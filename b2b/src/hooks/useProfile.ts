"use client"

import { useState, useCallback } from 'react'
import { useProfile as useProfileContext } from '@/context/ProfileContext'
import { ProfileFormData, ResumeUploadResponse, VideoUploadResponse } from '@/types/profile'

export function useProfile() {
  return useProfileContext()
}

export function useResumeParser() {
  const [parsing, setParsing] = useState(false)
  const [progress, setProgress] = useState(0)

  const parseResume = useCallback(async (file: File): Promise<ResumeUploadResponse> => {
    setParsing(true)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('resume', file)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch('/api/profile/parse-resume', {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        throw new Error('Failed to parse resume')
      }

      const result = await response.json()
      return result
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to parse resume'
      }
    } finally {
      setParsing(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }, [])

  return {
    parsing,
    progress,
    parseResume
  }
}

export function useVideoRecorder() {
  const [recording, setRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const startRecording = useCallback(async (): Promise<boolean> => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })

      setStream(mediaStream)
      const recorder = new MediaRecorder(mediaStream)
      setMediaRecorder(recorder)

      const chunks: Blob[] = []
      recorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        await uploadVideo(blob)
      }

      recorder.start()
      setRecording(true)
      setDuration(0)

      // Start duration timer
      const timer = setInterval(() => {
        setDuration(prev => {
          if (prev >= 120) { // 2 minute limit
            stopRecording()
            return 120
          }
          return prev + 1
        })
      }, 1000)

      return true
    } catch (error) {
      console.error('Failed to start recording:', error)
      return false
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop()
      setRecording(false)
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }, [mediaRecorder, recording, stream])

  const uploadVideo = useCallback(async (blob: Blob): Promise<VideoUploadResponse> => {
    try {
      const formData = new FormData()
      formData.append('video', blob, 'profile-video.webm')

      const response = await fetch('/api/profile/upload-video', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload video')
      }

      return await response.json()
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload video'
      }
    }
  }, [])

  return {
    recording,
    duration,
    startRecording,
    stopRecording
  }
}

export function useProfileForm(initialData?: ProfileFormData) {
  const [formData, setFormData] = useState<ProfileFormData>(
    initialData || {
      displayName: '',
      bio: '',
      location: '',
      website: '',
      socialLinks: [],
      experience: [],
      education: [],
      projects: [],
      skills: [],
      certifications: [],
      awards: []
    }
  )

  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateField = useCallback((field: keyof ProfileFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }, [errors])

  const addItem = useCallback((field: keyof ProfileFormData, item: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as any[]), { ...item, id: Date.now().toString() }]
    }))
  }, [])

  const updateItem = useCallback((field: keyof ProfileFormData, id: string, updates: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    }))
  }, [])

  const removeItem = useCallback((field: keyof ProfileFormData, id: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).filter(item => item.id !== id)
    }))
  }, [])

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required'
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters'
    }

    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      newErrors.website = 'Website must be a valid URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const reset = useCallback(() => {
    setFormData(initialData || {
      displayName: '',
      bio: '',
      location: '',
      website: '',
      socialLinks: [],
      experience: [],
      education: [],
      projects: [],
      skills: [],
      certifications: [],
      awards: []
    })
    setErrors({})
  }, [initialData])

  return {
    formData,
    errors,
    updateField,
    addItem,
    updateItem,
    removeItem,
    validate,
    reset
  }
}
