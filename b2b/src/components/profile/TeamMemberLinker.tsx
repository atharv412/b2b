"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  UserPlus, 
  X, 
  Users,
  Check,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface TeamMember {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  department: string
  status: 'active' | 'inactive' | 'pending'
}

interface TeamMemberLinkerProps {
  onLinkMember: (memberId: string) => Promise<boolean>
  onUnlinkMember: (memberId: string) => Promise<boolean>
  linkedMembers: TeamMember[]
  className?: string
}

export function TeamMemberLinker({
  onLinkMember,
  onUnlinkMember,
  linkedMembers,
  className
}: TeamMemberLinkerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<TeamMember[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isLinking, setIsLinking] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Mock search function - replace with actual API call
  const searchMembers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock search results
      const mockResults: TeamMember[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@company.com',
          avatar: '/avatars/john.jpg',
          role: 'Senior Developer',
          department: 'Engineering',
          status: 'active'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@company.com',
          avatar: '/avatars/jane.jpg',
          role: 'Product Manager',
          department: 'Product',
          status: 'active'
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike.johnson@company.com',
          avatar: '/avatars/mike.jpg',
          role: 'Designer',
          department: 'Design',
          status: 'active'
        }
      ].filter(member => 
        member.name.toLowerCase().includes(query.toLowerCase()) ||
        member.email.toLowerCase().includes(query.toLowerCase()) ||
        member.role.toLowerCase().includes(query.toLowerCase())
      )

      setSearchResults(mockResults)
    } catch (err) {
      setError('Failed to search members')
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchMembers(searchQuery)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handleLinkMember = async (member: TeamMember) => {
    setIsLinking(member.id)
    setError(null)

    try {
      const success = await onLinkMember(member.id)
      if (success) {
        setSearchResults(prev => prev.filter(m => m.id !== member.id))
        setSearchQuery('')
      } else {
        setError('Failed to link member')
      }
    } catch (err) {
      setError('Failed to link member')
    } finally {
      setIsLinking(null)
    }
  }

  const handleUnlinkMember = async (memberId: string) => {
    setIsLinking(memberId)
    setError(null)

    try {
      const success = await onUnlinkMember(memberId)
      if (!success) {
        setError('Failed to unlink member')
      }
    } catch (err) {
      setError('Failed to unlink member')
    } finally {
      setIsLinking(null)
    }
  }

  const isMemberLinked = (memberId: string) => {
    return linkedMembers.some(member => member.id === memberId)
  }

  return (
    <div className={className}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Link Team Member
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Link Team Member</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Search Results */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((member) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {member.role}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {member.department}
                        </Badge>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleLinkMember(member)}
                      disabled={isLinking === member.id || isMemberLinked(member.id)}
                    >
                      {isLinking === member.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : isMemberLinked(member.id) ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <UserPlus className="h-4 w-4" />
                      )}
                    </Button>
                  </motion.div>
                ))
              ) : searchQuery ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No members found</p>
                  <p className="text-sm">Try a different search term</p>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Search for team members to link</p>
                  <p className="text-sm">Enter a name, email, or role to get started</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Linked Members */}
      {linkedMembers.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">Linked Members</h4>
          <div className="space-y-2">
            {linkedMembers.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-sm">{member.name}</h5>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleUnlinkMember(member.id)}
                  disabled={isLinking === member.id}
                  className="text-destructive hover:text-destructive"
                >
                  {isLinking === member.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-destructive"></div>
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
