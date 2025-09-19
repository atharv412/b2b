"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, TrendingUp, Clock, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

// Animation variants
const fadeScale = {
  hidden: { opacity: 0, scale: 0.95 },
  enter: { 
    opacity: 1, 
    scale: 1
  },
  exit: { 
    opacity: 0, 
    scale: 0.95
  }
}

interface SearchFilterBarProps {
  onSearch: (query: string) => void
  onFilterChange: (filters: any) => void
  className?: string
}

export function SearchFilterBar({ 
  onSearch, 
  onFilterChange, 
  className 
}: SearchFilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState({
    postType: 'all',
    sort: 'recent',
    connectionsOnly: false,
    marketplaceResults: false
  })

  // Mock search suggestions
  const suggestions = [
    'AI and Machine Learning',
    'Web Development',
    'Startup Funding',
    'Remote Work',
    'Sustainability',
    'Product Management'
  ]

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch(query)
    setShowSuggestions(false)
  }

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...selectedFilters, [key]: value }
    setSelectedFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearSearch = () => {
    setSearchQuery('')
    onSearch('')
    setShowSuggestions(false)
  }

  const quickFilters = [
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'connections', label: 'Connections', icon: Users }
  ]

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Bar */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search posts, people, topics..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setShowSuggestions(e.target.value.length > 0)
            }}
            onFocus={() => setShowSuggestions(searchQuery.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Search Suggestions */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              variants={fadeScale}
              initial="hidden"
              animate="enter"
              exit="exit"
              className="absolute top-full left-0 right-0 z-50 mt-1"
            >
              <Card className="shadow-lg">
                <CardContent className="p-2">
                  <div className="space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(suggestion)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Post Type Filter */}
        <Select
          value={selectedFilters.postType}
          onValueChange={(value) => handleFilterChange('postType', value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Posts</SelectItem>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="media">Media</SelectItem>
            <SelectItem value="product">Products</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Filter */}
        <Select
          value={selectedFilters.sort}
          onValueChange={(value) => handleFilterChange('sort', value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recent</SelectItem>
            <SelectItem value="trending">Trending</SelectItem>
            <SelectItem value="relevant">Relevant</SelectItem>
          </SelectContent>
        </Select>

        {/* Quick Filter Chips */}
        <div className="flex gap-2">
          {quickFilters.map((filter) => (
            <Button
              key={filter.id}
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('sort', filter.id)}
              className={cn(
                'h-8 gap-1',
                selectedFilters.sort === filter.id && 'bg-primary text-primary-foreground'
              )}
            >
              <filter.icon className="h-3 w-3" />
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Advanced Filters */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterChange('connectionsOnly', !selectedFilters.connectionsOnly)}
            className={cn(
              'h-8',
              selectedFilters.connectionsOnly && 'bg-primary text-primary-foreground'
            )}
          >
            <Users className="h-3 w-3 mr-1" />
            Connections
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterChange('marketplaceResults', !selectedFilters.marketplaceResults)}
            className={cn(
              'h-8',
              selectedFilters.marketplaceResults && 'bg-primary text-primary-foreground'
            )}
          >
            <Filter className="h-3 w-3 mr-1" />
            Marketplace
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {(searchQuery || selectedFilters.postType !== 'all' || selectedFilters.connectionsOnly || selectedFilters.marketplaceResults) && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchQuery}
              <button
                onClick={() => {
                  setSearchQuery('')
                  onSearch('')
                }}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {selectedFilters.postType !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Type: {selectedFilters.postType}
              <button
                onClick={() => handleFilterChange('postType', 'all')}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {selectedFilters.connectionsOnly && (
            <Badge variant="secondary" className="gap-1">
              Connections Only
              <button
                onClick={() => handleFilterChange('connectionsOnly', false)}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {selectedFilters.marketplaceResults && (
            <Badge variant="secondary" className="gap-1">
              Marketplace
              <button
                onClick={() => handleFilterChange('marketplaceResults', false)}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
