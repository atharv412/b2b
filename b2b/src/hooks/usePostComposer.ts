"use client"

import { useState, useCallback, useEffect } from 'react'
import { postService } from '@/services/postService'
import type { 
  ComposerState, 
  AudienceOption, 
  MentionSuggestion, 
  HashtagSuggestion,
  DraftPost,
  CreatePostRequest
} from '@/types/posts'

const audienceOptions: AudienceOption[] = [
  {
    type: 'public',
    label: 'Public',
    description: 'Anyone can see this post',
    icon: '🌍',
    color: 'text-blue-600'
  },
  {
    type: 'connections',
    label: 'Connections',
    description: 'Only your connections can see this post',
    icon: '👥',
    color: 'text-green-600'
  },
  {
    type: 'specific',
    label: 'Specific People',
    description: 'Choose specific people to share with',
    icon: '👤',
    color: 'text-purple-600'
  },
  {
    type: 'groups',
    label: 'Groups',
    description: 'Share with specific groups',
    icon: '🏢',
    color: 'text-orange-600'
  },
  {
    type: 'product',
    label: 'Product-linked',
    description: 'Link this post to a product',
    icon: '🛍️',
    color: 'text-pink-600'
  }
]

export function usePostComposer() {
  const [state, setState] = useState<ComposerState>({
    content: '',
    type: 'text',
    audience: 'public',
    audienceDetails: {
      specificUsers: [],
      groups: [],
      productId: undefined
    },
    attachments: [],
    hashtags: [],
    mentions: [],
    isDraft: false,
    isPublishing: false
  })

  const [mentionSuggestions, setMentionSuggestions] = useState<MentionSuggestion[]>([])
  const [hashtagSuggestions, setHashtagSuggestions] = useState<HashtagSuggestion[]>([])
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false)
  const [showHashtagSuggestions, setShowHashtagSuggestions] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')
  const [hashtagQuery, setHashtagQuery] = useState('')

  // Update content and handle mentions/hashtags
  const updateContent = useCallback((content: string) => {
    setState(prev => ({ ...prev, content }))

    // Check for mentions (@username)
    const mentionMatch = content.match(/@(\w+)$/)
    if (mentionMatch) {
      setMentionQuery(mentionMatch[1])
      setShowMentionSuggestions(true)
      setShowHashtagSuggestions(false)
    } else {
      setShowMentionSuggestions(false)
    }

    // Check for hashtags (#tag)
    const hashtagMatch = content.match(/#(\w+)$/)
    if (hashtagMatch) {
      setHashtagQuery(hashtagMatch[1])
      setShowHashtagSuggestions(true)
      setShowMentionSuggestions(false)
    } else {
      setShowHashtagSuggestions(false)
    }
  }, [])

  // Load mention suggestions
  const loadMentionSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) return

    try {
      const suggestions = await postService.getMentionSuggestions(query)
      setMentionSuggestions(suggestions)
    } catch (error) {
      console.error('Failed to load mention suggestions:', error)
    }
  }, [])

  // Load hashtag suggestions
  const loadHashtagSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) return

    try {
      const suggestions = await postService.getHashtagSuggestions(query)
      setHashtagSuggestions(suggestions)
    } catch (error) {
      console.error('Failed to load hashtag suggestions:', error)
    }
  }, [])

  // Update audience selection
  const updateAudience = useCallback((audience: string, details?: any) => {
    setState(prev => ({
      ...prev,
      audience: audience as any,
      audienceDetails: details || prev.audienceDetails
    }))
  }, [])

  // Add attachment
  const addAttachment = useCallback((file: File) => {
    const attachment = {
      id: `temp_${Date.now()}`,
      type: file.type.startsWith('image/') ? 'image' as const :
            file.type.startsWith('video/') ? 'video' as const : 'document' as const,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      mimeType: file.type,
      isUploading: true,
      uploadProgress: 0
    }

    setState(prev => ({
      ...prev,
      attachments: [...prev.attachments, attachment]
    }))

    // Simulate upload progress
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        attachments: prev.attachments.map(att =>
          att.id === attachment.id
            ? { ...att, uploadProgress: Math.min((att.uploadProgress || 0) + 10, 100) }
            : att
        )
      }))
    }, 200)

    setTimeout(() => {
      clearInterval(interval)
      setState(prev => ({
        ...prev,
        attachments: prev.attachments.map(att =>
          att.id === attachment.id
            ? { ...att, isUploading: false, uploadProgress: 100 }
            : att
        )
      }))
    }, 2000)
  }, [])

  // Remove attachment
  const removeAttachment = useCallback((attachmentId: string) => {
    setState(prev => ({
      ...prev,
      attachments: prev.attachments.filter(att => att.id !== attachmentId)
    }))
  }, [])

  // Add hashtag
  const addHashtag = useCallback((hashtag: string) => {
    const cleanHashtag = hashtag.replace('#', '')
    if (!state.hashtags.includes(cleanHashtag)) {
      setState(prev => ({
        ...prev,
        hashtags: [...prev.hashtags, cleanHashtag]
      }))
    }
  }, [state.hashtags])

  // Add mention
  const addMention = useCallback((mention: string) => {
    const cleanMention = mention.replace('@', '')
    if (!state.mentions.includes(cleanMention)) {
      setState(prev => ({
        ...prev,
        mentions: [...prev.mentions, cleanMention]
      }))
    }
  }, [state.mentions])

  // Select mention suggestion
  const selectMentionSuggestion = useCallback((suggestion: MentionSuggestion) => {
    const newContent = state.content.replace(
      /@\w+$/,
      `@${suggestion.name} `
    )
    updateContent(newContent)
    addMention(suggestion.name)
    setShowMentionSuggestions(false)
  }, [state.content, updateContent, addMention])

  // Select hashtag suggestion
  const selectHashtagSuggestion = useCallback((suggestion: HashtagSuggestion) => {
    const newContent = state.content.replace(
      /#\w+$/,
      `#${suggestion.tag} `
    )
    updateContent(newContent)
    addHashtag(suggestion.tag)
    setShowHashtagSuggestions(false)
  }, [state.content, updateContent, addHashtag])

  // Publish post
  const publishPost = useCallback(async () => {
    if (!state.content.trim() && state.attachments.length === 0) {
      throw new Error('Post content cannot be empty')
    }

    setState(prev => ({ ...prev, isPublishing: true }))

    try {
      const createRequest: CreatePostRequest = {
        content: state.content,
        type: state.type,
        audience: state.audience,
        audienceDetails: state.audienceDetails,
        hashtags: state.hashtags,
        mentions: state.mentions
      }

      const response = await postService.createPost(createRequest)
      
      // Reset composer
      setState({
        content: '',
        type: 'text',
        audience: 'public',
        audienceDetails: {
          specificUsers: [],
          groups: [],
          productId: undefined
        },
        attachments: [],
        hashtags: [],
        mentions: [],
        isDraft: false,
        isPublishing: false
      })

      return response
    } catch (error) {
      setState(prev => ({ ...prev, isPublishing: false }))
      throw error
    }
  }, [state])

  // Save as draft
  const saveDraft = useCallback(async () => {
    if (!state.content.trim() && state.attachments.length === 0) {
      return
    }

    const draft: DraftPost = {
      id: `draft_${Date.now()}`,
      content: state.content,
      type: state.type,
      audience: state.audience,
      audienceDetails: state.audienceDetails,
      attachments: state.attachments,
      hashtags: state.hashtags,
      mentions: state.mentions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await postService.saveDraft(draft)
    setState(prev => ({ ...prev, isDraft: true }))
  }, [state])

  // Load draft
  const loadDraft = useCallback((draft: DraftPost) => {
    setState({
      content: draft.content,
      type: draft.type,
      audience: draft.audience,
      audienceDetails: draft.audienceDetails,
      attachments: draft.attachments,
      hashtags: draft.hashtags,
      mentions: draft.mentions,
      isDraft: true,
      isPublishing: false
    })
  }, [])

  // Clear composer
  const clearComposer = useCallback(() => {
    setState({
      content: '',
      type: 'text',
      audience: 'public',
      audienceDetails: {
        specificUsers: [],
        groups: [],
        productId: undefined
      },
      attachments: [],
      hashtags: [],
      mentions: [],
      isDraft: false,
      isPublishing: false
    })
  }, [])

  // Load suggestions when query changes
  useEffect(() => {
    if (mentionQuery) {
      loadMentionSuggestions(mentionQuery)
    }
  }, [mentionQuery, loadMentionSuggestions])

  useEffect(() => {
    if (hashtagQuery) {
      loadHashtagSuggestions(hashtagQuery)
    }
  }, [hashtagQuery, loadHashtagSuggestions])

  return {
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
    addHashtag,
    addMention,
    selectMentionSuggestion,
    selectHashtagSuggestion,
    publishPost,
    saveDraft,
    loadDraft,
    clearComposer
  }
}
