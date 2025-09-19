"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Users, 
  Phone, 
  Video, 
  Volume2, 
  VolumeX, 
  Pin, 
  PinOff, 
  Archive, 
  Trash2,
  Settings,
  Search,
  Download,
  Share2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Chat } from '@/types/chat'
import { cn } from '@/lib/utils'

interface ConversationDetailsDrawerProps {
  chat: Chat | null
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function ConversationDetailsDrawer({ 
  chat, 
  isOpen, 
  onClose, 
  className 
}: ConversationDetailsDrawerProps) {
  if (!chat) return null

  const getChatTitle = (chat: Chat) => {
    if (chat.type === 'direct') {
      const otherParticipant = chat.participants.find(p => p.id !== 'current-user')
      return otherParticipant?.name || chat.name
    }
    return chat.name
  }

  const getChatSubtitle = (chat: Chat) => {
    if (chat.type === 'direct') {
      const otherParticipant = chat.participants.find(p => p.id !== 'current-user')
      return otherParticipant?.status === 'online' ? 'Online' : 'Last seen recently'
    }
    return `${chat.participants.length} participants`
  }

  const getChatAvatar = (chat: Chat) => {
    if (chat.avatar) {
      return chat.avatar
    }
    if (chat.type === 'direct') {
      const otherParticipant = chat.participants.find(p => p.id !== 'current-user')
      return otherParticipant?.avatar
    }
    return undefined
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className={cn("max-h-[80vh]", className)}>
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-lg">
                {getChatTitle(chat)}
              </DrawerTitle>
              <DrawerDescription>
                {getChatSubtitle(chat)}
              </DrawerDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Chat Info */}
          <div className="text-center space-y-4">
            <Avatar className="h-20 w-20 mx-auto">
              <AvatarImage src={getChatAvatar(chat)} />
              <AvatarFallback className="text-lg">
                {getChatTitle(chat).split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="text-lg font-semibold">{getChatTitle(chat)}</h3>
              <p className="text-sm text-muted-foreground">
                {getChatSubtitle(chat)}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              <Button variant="outline" size="sm">
                <Video className="h-4 w-4 mr-2" />
                Video
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Participants */}
          {chat.participants.length > 1 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Participants</h4>
              <div className="space-y-2">
                {chat.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback className="text-xs">
                        {participant.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {participant.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {participant.status === 'online' ? 'Online' : 'Offline'}
                      </p>
                    </div>
                    {participant.status === 'online' && (
                      <div className="h-2 w-2 bg-green-500 rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Media Gallery */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Media & Files</h4>
            <div className="grid grid-cols-3 gap-2">
              {/* Placeholder for media items */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">Media {i}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Settings */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Chat Settings</h4>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {/* Handle mute/unmute */}}
              >
                {chat.isMuted ? (
                  <>
                    <Volume2 className="h-4 w-4 mr-2" />
                    Unmute Notifications
                  </>
                ) : (
                  <>
                    <VolumeX className="h-4 w-4 mr-2" />
                    Mute Notifications
                  </>
                )}
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {/* Handle pin/unpin */}}
              >
                {chat.isPinned ? (
                  <>
                    <PinOff className="h-4 w-4 mr-2" />
                    Unpin Chat
                  </>
                ) : (
                  <>
                    <Pin className="h-4 w-4 mr-2" />
                    Pin Chat
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {/* Handle archive */}}
              >
                <Archive className="h-4 w-4 mr-2" />
                Archive Chat
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={() => {/* Handle delete */}}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Chat
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
