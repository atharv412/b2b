"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Image, 
  Video, 
  FileText, 
  Hash, 
  AtSign, 
  Globe, 
  Users, 
  User, 
  Building, 
  ShoppingBag,
  Send,
  Save,
  Loader2,
  Paperclip,
  Smile,
  MoreHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AudienceSelector } from './AudienceSelector'
import { MediaUploader } from './MediaUploader'
import { usePostComposer } from '@/hooks/usePostComposer'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface PostComposerProps {
  trigger?: React.ReactNode
  onPostCreated?: (post: any) => void
  className?: string
  variant?: 'modal' | 'inline'
}

export function PostComposer({ 
  trigger, 
  onPostCreated, 
  className,
  variant = 'modal' 
}: PostComposerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showAudienceSelector, setShowAudienceSelector] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const {
    state,
    audienceOptions,
    mentionSuggestions,
    hashtagSuggestions,
    showMentionSuggestions,
    showHashtagSuggestions,
    updateContent,
    updateAudience,
    addAttachment,
    removeAttachment,
    selectMentionSuggestion,
    selectHashtagSuggestion,
    publishPost,
    saveDraft,
    clearComposer
  } = usePostComposer()

  const selectedAudience = audienceOptions.find(opt => opt.type === state.audience)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [state.content])

  // Focus textarea when modal opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = async () => {
    try {
      const response = await publishPost()
      toast.success('Post published successfully!')
      setIsOpen(false)
      onPostCreated?.(response.post)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to publish post')
    }
  }

  const handleSaveDraft = async () => {
    try {
      await saveDraft()
      toast.success('Draft saved!')
    } catch (error) {
      toast.error('Failed to save draft')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const canPublish = state.content.trim().length > 0 || state.attachments.length > 0

  const composerContent = (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Create Post</h3>
        {variant === 'modal' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Audience Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Share with:</span>
        <Popover open={showAudienceSelector} onOpenChange={setShowAudienceSelector}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <span className={cn("text-sm", selectedAudience?.color)}>
                {selectedAudience?.icon}
              </span>
              {selectedAudience?.label}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <AudienceSelector
              selectedAudience={state.audience}
              audienceDetails={state.audienceDetails}
              onSelect={(audience, details) => {
                updateAudience(audience, details)
                setShowAudienceSelector(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Content Input */}
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={state.content}
          onChange={(e) => updateContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What's on your mind?"
          className="min-h-[120px] resize-none text-base"
        />
        
        {/* Mention/Hashtag Suggestions */}
        <AnimatePresence>
          {showMentionSuggestions && mentionSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 z-10 mt-1"
            >
              <Command className="border rounded-lg shadow-lg">
                <CommandList>
                  {mentionSuggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion.id}
                      onSelect={() => selectMentionSuggestion(suggestion)}
                      className="flex items-center gap-2"
                    >
                      <AtSign className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{suggestion.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {suggestion.email}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showHashtagSuggestions && hashtagSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 z-10 mt-1"
            >
              <Command className="border rounded-lg shadow-lg">
                <CommandList>
                  {hashtagSuggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion.tag}
                      onSelect={() => selectHashtagSuggestion(suggestion)}
                      className="flex items-center gap-2"
                    >
                      <Hash className="h-4 w-4" />
                      <div>
                        <div className="font-medium">#{suggestion.tag}</div>
                        <div className="text-sm text-muted-foreground">
                          {suggestion.count} posts
                          {suggestion.trending && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              Trending
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Attachments Preview */}
      {state.attachments.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Attachments:</span>
            <Badge variant="secondary">
              {state.attachments.length}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {state.attachments.map((attachment) => (
              <div key={attachment.id} className="relative group">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  {attachment.type === 'image' ? (
                    <img
                      src={attachment.url}
                      alt={attachment.name}
                      className="w-full h-full object-cover"
                    />
                  ) : attachment.type === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="h-8 w-8 text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                {/* Upload Progress */}
                {attachment.isUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <div className="text-white text-sm">
                      {attachment.uploadProgress}%
                    </div>
                  </div>
                )}

                {/* Remove Button */}
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeAttachment(attachment.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hashtags and Mentions */}
      {(state.hashtags.length > 0 || state.mentions.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {state.hashtags.map((hashtag) => (
            <Badge key={hashtag} variant="secondary" className="gap-1">
              <Hash className="h-3 w-3" />
              {hashtag}
            </Badge>
          ))}
          {state.mentions.map((mention) => (
            <Badge key={mention} variant="secondary" className="gap-1">
              <AtSign className="h-3 w-3" />
              {mention}
            </Badge>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MediaUploader onFileSelect={addAttachment}>
            <Button variant="ghost" size="sm">
              <Image className="h-4 w-4" />
            </Button>
          </MediaUploader>
          
          <Button variant="ghost" size="sm">
            <Smile className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleSaveDraft}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              clearComposer()
              setIsOpen(false)
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canPublish || state.isPublishing}
          >
            {state.isPublishing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Post
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Keyboard Shortcut Hint */}
      <div className="text-xs text-muted-foreground">
        Press Ctrl+Enter to post
      </div>
    </div>
  )

  if (variant === 'inline') {
    return composerContent
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full justify-start gap-2">
            <span>What&apos;s on your mind?</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>
        {composerContent}
      </DialogContent>
    </Dialog>
  )
}
