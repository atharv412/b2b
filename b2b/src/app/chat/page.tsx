"use client"

import React from 'react'
import { ChatProvider, Chat } from '@/components/chat'

export default function ChatPage() {
  return (
    <div className="h-screen bg-background overflow-hidden">
      <ChatProvider>
        <Chat />
      </ChatProvider>
    </div>
  )
}
