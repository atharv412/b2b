"use client"

import React from 'react'
import { PlatformLayout } from '@/components/layout/PlatformLayout'
import { ChatProvider, Chat } from '@/components/chat'

export default function MessagesPage() {
  return (
    <PlatformLayout className="!p-0">
      <div className="h-[calc(100vh-4rem)] w-full">
        <ChatProvider>
          <Chat />
        </ChatProvider>
      </div>
    </PlatformLayout>
  )
}
