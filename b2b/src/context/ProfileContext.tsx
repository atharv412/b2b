"use client"

import React, { createContext, useContext, useReducer, useCallback } from 'react'
import { 
  IndividualProfile, 
  CompanyProfile, 
  ProfileFormData, 
  PrivacySettings,
  ProfileAnalytics 
} from '@/types/profile'

type Profile = IndividualProfile | CompanyProfile

interface ProfileState {
  profile: Profile | null
  loading: boolean
  error: string | null
  editing: boolean
  activeSection: string | null
  analytics: ProfileAnalytics | null
}

type ProfileAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PROFILE'; payload: Profile }
  | { type: 'UPDATE_PROFILE'; payload: Partial<Profile> }
  | { type: 'SET_EDITING'; payload: boolean }
  | { type: 'SET_ACTIVE_SECTION'; payload: string | null }
  | { type: 'SET_ANALYTICS'; payload: ProfileAnalytics }
  | { type: 'UPDATE_PRIVACY'; payload: Partial<PrivacySettings> }

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
  editing: false,
  activeSection: null,
  analytics: null
}

function profileReducer(state: ProfileState, action: ProfileAction): ProfileState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'SET_PROFILE':
      return { ...state, profile: action.payload, error: null }
    
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: state.profile ? { ...state.profile, ...action.payload } : null
      }
    
    case 'SET_EDITING':
      return { ...state, editing: action.payload }
    
    case 'SET_ACTIVE_SECTION':
      return { ...state, activeSection: action.payload }
    
    case 'SET_ANALYTICS':
      return { ...state, analytics: action.payload }
    
    case 'UPDATE_PRIVACY':
      return {
        ...state,
        profile: state.profile ? {
          ...state.profile,
          privacy: { ...state.profile.privacy, ...action.payload }
        } : null
      }
    
    default:
      return state
  }
}

interface ProfileContextType {
  state: ProfileState
  actions: {
    loadProfile: (profileId: string) => Promise<void>
    updateProfile: (updates: Partial<Profile>) => Promise<void>
    setEditing: (editing: boolean) => void
    setActiveSection: (section: string | null) => void
    updatePrivacy: (privacy: Partial<PrivacySettings>) => Promise<void>
    loadAnalytics: (profileId: string) => Promise<void>
  }
}

const ProfileContext = createContext<ProfileContextType | null>(null)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(profileReducer, initialState)

  const loadProfile = useCallback(async (profileId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })

      const response = await fetch(`/api/profile/${profileId}`)
      if (!response.ok) {
        throw new Error('Failed to load profile')
      }

      const profile = await response.json()
      dispatch({ type: 'SET_PROFILE', payload: profile })
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to load profile' 
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!state.profile) return

    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })

      const response = await fetch(`/api/profile/${state.profile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const updatedProfile = await response.json()
      dispatch({ type: 'UPDATE_PROFILE', payload: updatedProfile })
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to update profile' 
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [state.profile])

  const setEditing = useCallback((editing: boolean) => {
    dispatch({ type: 'SET_EDITING', payload: editing })
  }, [])

  const setActiveSection = useCallback((section: string | null) => {
    dispatch({ type: 'SET_ACTIVE_SECTION', payload: section })
  }, [])

  const updatePrivacy = useCallback(async (privacy: Partial<PrivacySettings>) => {
    if (!state.profile) return

    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })

      const response = await fetch(`/api/profile/${state.profile.id}/privacy`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(privacy)
      })

      if (!response.ok) {
        throw new Error('Failed to update privacy settings')
      }

      dispatch({ type: 'UPDATE_PRIVACY', payload: privacy })
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to update privacy settings' 
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [state.profile])

  const loadAnalytics = useCallback(async (profileId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })

      const response = await fetch(`/api/profile/${profileId}/analytics`)
      if (!response.ok) {
        throw new Error('Failed to load analytics')
      }

      const analytics = await response.json()
      dispatch({ type: 'SET_ANALYTICS', payload: analytics })
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to load analytics' 
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const actions = {
    loadProfile,
    updateProfile,
    setEditing,
    setActiveSection,
    updatePrivacy,
    loadAnalytics
  }

  return (
    <ProfileContext.Provider value={{ state, actions }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
