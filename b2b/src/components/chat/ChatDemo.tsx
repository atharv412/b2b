"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MessageCircle, 
  Users, 
  ShoppingCart, 
  Headphones,
  Plus,
  Settings,
  Phone,
  Video
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Chat } from './Chat'
import { ChatProvider } from './index'
import { cn } from '@/lib/utils'

export function ChatDemo() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const chatTypes = [
    {
      type: 'direct',
      icon: MessageCircle,
      title: 'Direct Messages',
      description: '1:1 conversations with team members and clients',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      type: 'group',
      icon: Users,
      title: 'Group Chats',
      description: 'Team collaboration and project discussions',
      color: 'text-green-600 bg-green-100'
    },
    {
      type: 'product',
      icon: ShoppingCart,
      title: 'Product Inquiries',
      description: 'Customer inquiries linked to specific products',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      type: 'support',
      icon: Headphones,
      title: 'Support Tickets',
      description: 'Customer support and technical assistance',
      color: 'text-orange-600 bg-orange-100'
    }
  ]

  const features = [
    {
      title: 'Real-time Messaging',
      description: 'Instant message delivery with WebSocket integration',
      icon: MessageCircle
    },
    {
      title: 'File Attachments',
      description: 'Drag & drop files with progress indicators',
      icon: Plus
    },
    {
      title: 'Message Reactions',
      description: 'Emoji reactions with smooth animations',
      icon: Settings
    },
    {
      title: 'Voice & Video',
      description: 'Integrated calling capabilities',
      icon: Phone
    }
  ]

  if (isFullscreen) {
    return (
      <div className="h-screen bg-background">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Chat System Demo</h1>
              <Button
                variant="outline"
                onClick={() => setIsFullscreen(false)}
              >
                Exit Demo
              </Button>
            </div>
          </div>
        </div>
        <div className="h-[calc(100vh-80px)]">
          <ChatProvider>
            <Chat />
          </ChatProvider>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Chat & Messaging System</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Real-time messaging for B2B platforms with 1:1, group, product-linked, and support conversations
            </p>
            <Button
              size="lg"
              onClick={() => setIsFullscreen(true)}
              className="mb-8"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Try Live Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Chat Types */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Chat Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {chatTypes.map((chatType, index) => (
              <motion.div
                key={chatType.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={cn(
                      "h-12 w-12 rounded-lg flex items-center justify-center mb-4",
                      chatType.color
                    )}>
                      <chatType.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{chatType.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{chatType.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Demo Preview */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Live Preview</h2>
          <div className="relative">
            <div className="h-96 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">Interactive Chat Demo</h3>
                <p className="text-muted-foreground mb-4">
                  Click "Try Live Demo" to experience the full chat system
                </p>
                <Button onClick={() => setIsFullscreen(true)}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Open Demo
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Technical Implementation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Real-time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• WebSocket integration</li>
                  <li>• Instant message delivery</li>
                  <li>• Typing indicators</li>
                  <li>• Presence status</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Rich Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• File attachments</li>
                  <li>• Message reactions</li>
                  <li>• Message threading</li>
                  <li>• Quick replies</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  B2B Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Product-linked chats</li>
                  <li>• Support escalation</li>
                  <li>• Quotation support</li>
                  <li>• Team collaboration</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Integrate the chat system into your B2B platform today
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => setIsFullscreen(true)}>
              <MessageCircle className="h-5 w-5 mr-2" />
              Try Demo
            </Button>
            <Button size="lg" variant="outline">
              <Settings className="h-5 w-5 mr-2" />
              View Docs
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
