"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Users,
  Building2,
  GraduationCap,
  Briefcase,
  ShoppingBag,
  BarChart3,
  TrendingUp,
  UserPlus,
  Heart,
  Share2,
  MessageSquare,
  MoreHorizontal,
  Star,
  Hash
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { PlatformLayout } from '@/components/layout/PlatformLayout'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0
  }
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1
  },
  hover: {
    scale: 1.02,
    y: -2
  }
}

// Mock data
const mockUser = {
  name: 'Ram Sharma',
  title: 'Software Engineer at TechCorp',
  avatar: '/avatars/john.jpg',
  connections: 156,
  posts: 24
}

const mockSuggestions = [
  {
    id: 1,
    name: 'Priya Patel',
    title: 'UX Designer',
    avatar: '/avatars/emma.svg',
    mutualConnections: 12
  },
  {
    id: 2,
    name: 'Aditya Singh',
    title: 'Software Engineer',
    avatar: '/avatars/john-smith.svg',
    mutualConnections: 8
  },
  {
    id: 3,
    name: 'Kavya Reddy',
    title: 'Product Manager',
    avatar: '/avatars/lisa.svg',
    mutualConnections: 5
  }
]

const mockPosts = [
  {
    id: 1,
    author: {
      name: 'Ananya Gupta',
      title: 'Senior Product Manager at TechCorp',
      avatar: '/avatars/sarah.svg',
      verified: true
    },
    content: 'Excited to share that our team just launched a new AI-powered analytics dashboard! The response from our beta users has been incredible. 🚀 #ProductLaunch #AI #Analytics',
    timestamp: '2 hours ago',
    likes: 24,
    comments: 8,
    shares: 3
  },
  {
    id: 2,
    author: {
      name: 'Microsoft',
      title: 'Technology Company at Microsoft',
      avatar: '/avatars/microsoft.svg',
      verified: true
    },
    content: 'Join us for Microsoft Build 2024! Early bird registration is now open. Don\'t miss out on the latest innovations in cloud computing, AI, and developer tools.',
    timestamp: '4 hours ago',
    likes: 18,
    comments: 5,
    shares: 2
  }
]

const trendingTopics = [
  { name: 'AI Technology', posts: 1234, icon: Hash },
  { name: 'Remote Work', posts: 856, icon: Hash },
  { name: 'Startup Funding', posts: 632, icon: Hash },
  { name: 'Sustainable Tech', posts: 445, icon: Hash },
  { name: 'Web3', posts: 389, icon: Hash }
]

export default function PlatformPage() {
  const [activeTab, setActiveTab] = useState('feed')
  const [postContent, setPostContent] = useState('')
  const router = useRouter()

  const handlePostSubmit = () => {
    if (postContent.trim()) {
      console.log('Posting:', postContent)
      setPostContent('')
    }
  }

  const handleCreatePost = () => {
    router.push('/platform/feed?action=create')
  }

  const handleFindConnections = () => {
    router.push('/platform/network')
  }

  const handleBrowseMarketplace = () => {
    router.push('/platform/marketplace')
  }

  const handleViewAnalytics = () => {
    router.push('/platform/analytics')
  }

  return (
    <PlatformLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="content-grid"
      >
        {/* Main Content */}
        <div className="content-main">
          {/* Welcome Header */}
          <motion.div
            variants={itemVariants}
            className="mb-6"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {mockUser.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              Here&apos;s what&apos;s happening in your professional network today.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          >
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="stats-card"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Connections</p>
                    <p className="text-2xl font-bold text-blue-600">{mockUser.connections}</p>
                  </div>
                </div>
              </CardContent>
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="stats-card"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Profile Views</p>
                    <p className="text-2xl font-bold text-green-600">1,234</p>
                  </div>
                </div>
              </CardContent>
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="stats-card"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Messages</p>
                    <p className="text-2xl font-bold text-purple-600">42</p>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          </motion.div>

          {/* Post Composer */}
          <motion.div
            variants={itemVariants}
            className="mb-6"
          >
            <Card className="card-elevated">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {mockUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Input
                      placeholder="What's on your mind? Share with your network..."
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="border-0 bg-transparent focus-visible:ring-0 text-base placeholder:text-muted-foreground"
                    />
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-accent">
                          <Plus className="h-4 w-4 mr-2" />
                          Photo
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-accent">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Video
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-accent">
                          <Share2 className="h-4 w-4 mr-2" />
                          Document
                        </Button>
                      </div>
                      <Button 
                        onClick={handlePostSubmit}
                        disabled={!postContent.trim()}
                        className="bg-primary hover:bg-primary/90 shadow-lg"
                      >
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Feed Tabs */}
          <motion.div
            variants={itemVariants}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted">
                <TabsTrigger value="feed" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Feed
                </TabsTrigger>
                <TabsTrigger value="trending" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Trending
                </TabsTrigger>
                <TabsTrigger value="following" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Following
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="feed" className="mt-6 space-y-4">
                {mockPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="post-card">
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={post.author.avatar} alt={post.author.name} />
                            <AvatarFallback className="bg-muted">
                              {post.author.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{post.author.name}</h3>
                              {post.author.verified && (
                                <Star className="h-4 w-4 text-blue-500 fill-current" />
                              )}
                              <span className="text-muted-foreground text-sm">•</span>
                              <span className="text-muted-foreground text-sm">{post.author.title}</span>
                              <span className="text-muted-foreground text-sm">•</span>
                              <span className="text-muted-foreground text-sm">{post.timestamp}</span>
                            </div>
                            <p className="text-foreground mb-3 leading-relaxed">{post.content}</p>
                            <div className="flex items-center gap-4">
                              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-accent">
                                <Heart className="h-4 w-4 mr-2" />
                                {post.likes}
                              </Button>
                              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-accent">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                {post.comments}
                              </Button>
                              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-accent">
                                <Share2 className="h-4 w-4 mr-2" />
                                {post.shares}
                              </Button>
                              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-accent ml-auto">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="content-sidebar">
          {/* User Profile Card */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <Card className="card-elevated">
              <CardContent className="p-6 text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {mockUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg mb-1">{mockUser.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{mockUser.title}</p>
                <div className="flex justify-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{mockUser.connections}</p>
                    <p className="text-sm text-muted-foreground">Connections</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{mockUser.posts}</p>
                    <p className="text-sm text-muted-foreground">Posts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Trending Topics */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <Card className="card-elevated">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Trending
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <motion.div
                    key={topic.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <topic.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{topic.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {topic.posts} posts
                    </Badge>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* People You May Know */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            <Card className="card-elevated">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-primary" />
                  People you may know
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockSuggestions.map((person, index) => (
                  <motion.div
                    key={person.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={person.avatar} alt={person.name} />
                      <AvatarFallback className="bg-muted">
                        {person.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{person.name}</h4>
                      <p className="text-xs text-muted-foreground truncate">{person.title}</p>
                      <p className="text-xs text-muted-foreground">{person.mutualConnections} mutual connections</p>
                    </div>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      <UserPlus className="h-3 w-3 mr-1" />
                      Connect
                    </Button>
                  </motion.div>
                ))}
                <Button variant="outline" className="w-full mt-4">
                  View all suggestions
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
          >
            <Card className="card-elevated">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={handleCreatePost}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleFindConnections}>
                  <Users className="h-4 w-4 mr-2" />
                  Find Connections
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleBrowseMarketplace}>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Browse Marketplace
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleViewAnalytics}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </PlatformLayout>
  )
}
