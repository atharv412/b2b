"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  TrendingUp, 
  Hash, 
  Users, 
  Plus, 
  ArrowUpRight,
  Star,
  ShoppingBag
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Animation variants
const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  }
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

interface TrendingHashtag {
  id: string
  name: string
  posts: number
  growth: number
}

interface RecommendedUser {
  id: string
  fullName: string
  username: string
  avatarUrl?: string
  verified: boolean
  followers: number
  mutualConnections?: number
}

interface TrendingProduct {
  id: string
  name: string
  price: number
  imageUrl: string
  rating: number
  sales: number
}

interface TrendingSidebarProps {
  className?: string
}

export function TrendingSidebar({ className }: TrendingSidebarProps) {
  // Mock data - in real app, this would come from API
  const trendingHashtags: TrendingHashtag[] = [
    { id: '1', name: 'AI', posts: 12500, growth: 15.2 },
    { id: '2', name: 'Web3', posts: 8900, growth: 8.7 },
    { id: '3', name: 'StartupLife', posts: 6700, growth: 12.1 },
    { id: '4', name: 'RemoteWork', posts: 5400, growth: -2.3 },
    { id: '5', name: 'Sustainability', posts: 4200, growth: 18.9 }
  ]

  const recommendedUsers: RecommendedUser[] = [
    { 
      id: '1', 
      fullName: 'Sarah Chen', 
      username: '@sarahchen', 
      verified: true, 
      followers: 12500,
      mutualConnections: 3
    },
    { 
      id: '2', 
      fullName: 'Alex Rodriguez', 
      username: '@alexrod', 
      verified: false, 
      followers: 8900,
      mutualConnections: 1
    },
    { 
      id: '3', 
      fullName: 'Tech Startup', 
      username: '@techstartup', 
      verified: true, 
      followers: 15600,
      mutualConnections: 7
    }
  ]

  const trendingProducts: TrendingProduct[] = [
    {
      id: '1',
      name: 'Wireless Earbuds Pro',
      price: 199.99,
      imageUrl: '/placeholder.jpg',
      rating: 4.8,
      sales: 1250
    },
    {
      id: '2',
      name: 'Smart Watch Series 5',
      price: 399.99,
      imageUrl: '/placeholder.jpg',
      rating: 4.6,
      sales: 890
    }
  ]

  return (
    <div className={cn('space-y-6', className)}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Trending Hashtags */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Trending Topics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {trendingHashtags.map((hashtag, index) => (
              <motion.div
                key={hashtag.id}
                variants={itemVariants}
                className="flex items-center justify-between group cursor-pointer hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-lg font-bold text-muted-foreground">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{hashtag.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {hashtag.posts.toLocaleString()} posts
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={hashtag.growth > 0 ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {hashtag.growth > 0 ? '+' : ''}{hashtag.growth}%
                  </Badge>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Who to Follow */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Who to Follow
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendedUsers.map((user) => (
              <motion.div
                key={user.id}
                variants={itemVariants}
                className="flex items-center gap-3"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>
                    {user.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">
                      {user.fullName}
                    </span>
                    {user.verified && (
                      <Badge variant="secondary" className="text-xs px-1 py-0">
                        ✓
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {user.username}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user.followers.toLocaleString()} followers
                    {user.mutualConnections && (
                      <span> • {user.mutualConnections} mutual</span>
                    )}
                  </div>
                </div>
                <Button size="sm" variant="outline" className="h-8">
                  <Plus className="h-3 w-3 mr-1" />
                  Follow
                </Button>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Trending Products */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Trending Products
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {trendingProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                className="flex items-center gap-3 group cursor-pointer hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors"
              >
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {product.name}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      {product.rating}
                    </div>
                    <span>•</span>
                    <span>{product.sales} sold</span>
                  </div>
                  <div className="font-semibold text-sm">
                    ${product.price}
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Browse Marketplace
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Find Connections
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
