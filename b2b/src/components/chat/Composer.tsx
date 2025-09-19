"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Paperclip, 
  Smile, 
  Image, 
  FileText, 
  X,
  Mic,
  MicOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { AttachmentPreview } from './AttachmentPreview'
import { QuickReplies } from './QuickReplies'
import { cn } from '@/lib/utils'

interface ComposerProps {
  chatId: string
  onSend?: (content: string, attachments?: File[]) => void
  placeholder?: string
  className?: string
}

interface Attachment {
  id: string
  file: File
  preview?: string
  type: 'image' | 'video' | 'file'
}

export function Composer({ 
  chatId, 
  onSend, 
  placeholder = "Type a message...",
  className 
}: ComposerProps) {
  const [content, setContent] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [showQuickReplies, setShowQuickReplies] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [content])

  const handleSend = () => {
    if (!content.trim() && attachments.length === 0) return

    const messageContent = content.trim()
    const files = attachments.map(att => att.file)

    // Call the send handler
    if (onSend) {
      onSend(messageContent, files)
    }

    // Clear the composer
    setContent('')
    setAttachments([])
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    files.forEach(file => {
      const attachment: Attachment = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' : 'file'
      }

      // Create preview for images and videos
      if (attachment.type === 'image' || attachment.type === 'video') {
        const reader = new FileReader()
        reader.onload = (e) => {
          attachment.preview = e.target?.result as string
          setAttachments(prev => [...prev, attachment])
        }
        reader.readAsDataURL(file)
      } else {
        setAttachments(prev => [...prev, attachment])
      }
    })

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id))
  }

  const handleQuickReply = (reply: string) => {
    setContent(reply)
    setShowQuickReplies(false)
    textareaRef.current?.focus()
  }

  const startRecording = () => {
    setIsRecording(true)
    // TODO: Implement voice recording
  }

  const stopRecording = () => {
    setIsRecording(false)
    // TODO: Implement voice recording
  }

  return (
    <div className={cn(
      "flex flex-col p-4 space-y-3",
      className
    )}>
      {/* Quick Replies */}
      <AnimatePresence>
        {showQuickReplies && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <QuickReplies onSelect={handleQuickReply} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="relative">
              <AttachmentPreview
                attachment={{
                  id: attachment.id,
                  name: attachment.file.name,
                  type: attachment.type,
                  url: attachment.preview || URL.createObjectURL(attachment.file),
                  size: attachment.file.size
                }}
                isOwn={true}
                showRemove={true}
                onRemove={() => removeAttachment(attachment.id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Composer Input */}
      <div className="flex items-end gap-2">
        {/* Attachment Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          className="h-8 w-8 flex-shrink-0"
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        {/* Text Input */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="min-h-[40px] max-h-32 resize-none pr-12"
            rows={1}
          />
          
          {/* Quick Actions */}
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowQuickReplies(!showQuickReplies)}
              className="h-6 w-6"
            >
              <Smile className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Voice Recording Button */}
        <Button
          variant="ghost"
          size="icon"
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onMouseLeave={stopRecording}
          className={cn(
            "h-8 w-8 flex-shrink-0",
            isRecording && "bg-red-500 text-white hover:bg-red-600"
          )}
        >
          {isRecording ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={!content.trim() && attachments.length === 0}
          size="icon"
          className="h-8 w-8 flex-shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,.pdf,.doc,.docx,.txt"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}
