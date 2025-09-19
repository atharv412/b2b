"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Globe, 
  Users, 
  User, 
  Building, 
  ShoppingBag,
  Check,
  Search,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'

interface AudienceSelectorProps {
  selectedAudience: string
  audienceDetails: any
  onSelect: (audience: string, details?: any) => void
}

const audienceOptions = [
  {
    type: 'public',
    label: 'Public',
    description: 'Anyone can see this post',
    icon: Globe,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    type: 'connections',
    label: 'Connections',
    description: 'Only your connections can see this post',
    icon: Users,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    type: 'specific',
    label: 'Specific People',
    description: 'Choose specific people to share with',
    icon: User,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    type: 'groups',
    label: 'Groups',
    description: 'Share with specific groups',
    icon: Building,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    type: 'product',
    label: 'Product-linked',
    description: 'Link this post to a product',
    icon: ShoppingBag,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50'
  }
]

// Mock data for suggestions
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', avatar: '/avatars/john.jpg' },
  { id: '2', name: 'Sarah Wilson', email: 'sarah@example.com', avatar: '/avatars/sarah.jpg' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: '/avatars/mike.jpg' },
  { id: '4', name: 'Emma Davis', email: 'emma@example.com', avatar: '/avatars/emma.jpg' }
]

const mockGroups = [
  { id: '1', name: 'Design Team', description: 'UI/UX Design Team' },
  { id: '2', name: 'Marketing Team', description: 'Marketing & Sales' },
  { id: '3', name: 'Development Team', description: 'Software Development' },
  { id: '4', name: 'Management', description: 'Executive Team' }
]

const mockProducts = [
  { id: '1', name: 'AI Analytics Dashboard', price: 299, image: '/products/analytics.jpg' },
  { id: '2', name: 'Project Management Tool', price: 199, image: '/products/project.jpg' },
  { id: '3', name: 'CRM System', price: 399, image: '/products/crm.jpg' }
]

export function AudienceSelector({ selectedAudience, audienceDetails, onSelect }: AudienceSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>(audienceDetails.specificUsers || [])
  const [selectedGroups, setSelectedGroups] = useState<string[]>(audienceDetails.groups || [])
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>(audienceDetails.productId)

  const handleAudienceSelect = (audienceType: string) => {
    if (audienceType === 'specific') {
      onSelect(audienceType, { specificUsers: selectedUsers })
    } else if (audienceType === 'groups') {
      onSelect(audienceType, { groups: selectedGroups })
    } else if (audienceType === 'product') {
      onSelect(audienceType, { productId: selectedProduct })
    } else {
      onSelect(audienceType, {})
    }
  }

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const toggleGroup = (groupId: string) => {
    setSelectedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    )
  }

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredGroups = mockGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">Choose your audience</h4>
        <p className="text-sm text-muted-foreground">
          Select who can see this post
        </p>
      </div>

      {/* Audience Options */}
      <div className="grid gap-2">
        {audienceOptions.map((option) => {
          const Icon = option.icon
          const isSelected = selectedAudience === option.type
          
          return (
            <motion.div
              key={option.type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={isSelected ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-auto p-4",
                  isSelected && option.bgColor
                )}
                onClick={() => handleAudienceSelect(option.type)}
              >
                <Icon className={cn("h-5 w-5", option.color)} />
                <div className="flex-1 text-left">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {option.description}
                  </div>
                </div>
                {isSelected && <Check className="h-4 w-4" />}
              </Button>
            </motion.div>
          )
        })}
      </div>

      {/* Specific People Selection */}
      {selectedAudience === 'specific' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="font-medium">Select People</span>
            {selectedUsers.length > 0 && (
              <Badge variant="secondary">{selectedUsers.length} selected</Badge>
            )}
          </div>
          
          <Command>
            <CommandInput
              placeholder="Search people..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>No people found.</CommandEmpty>
              <CommandGroup>
                {filteredUsers.map((user) => (
                  <CommandItem
                    key={user.id}
                    onSelect={() => toggleUser(user.id)}
                    className="flex items-center gap-2"
                  >
                    <div className={cn(
                      "h-4 w-4 rounded border-2 flex items-center justify-center",
                      selectedUsers.includes(user.id) 
                        ? "bg-primary border-primary" 
                        : "border-muted-foreground"
                    )}>
                      {selectedUsers.includes(user.id) && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}

      {/* Groups Selection */}
      {selectedAudience === 'groups' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="font-medium">Select Groups</span>
            {selectedGroups.length > 0 && (
              <Badge variant="secondary">{selectedGroups.length} selected</Badge>
            )}
          </div>
          
          <Command>
            <CommandInput
              placeholder="Search groups..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>No groups found.</CommandEmpty>
              <CommandGroup>
                {filteredGroups.map((group) => (
                  <CommandItem
                    key={group.id}
                    onSelect={() => toggleGroup(group.id)}
                    className="flex items-center gap-2"
                  >
                    <div className={cn(
                      "h-4 w-4 rounded border-2 flex items-center justify-center",
                      selectedGroups.includes(group.id) 
                        ? "bg-primary border-primary" 
                        : "border-muted-foreground"
                    )}>
                      {selectedGroups.includes(group.id) && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{group.name}</div>
                      <div className="text-sm text-muted-foreground">{group.description}</div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}

      {/* Product Selection */}
      {selectedAudience === 'product' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span className="font-medium">Select Product</span>
          </div>
          
          <Command>
            <CommandInput
              placeholder="Search products..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>No products found.</CommandEmpty>
              <CommandGroup>
                {filteredProducts.map((product) => (
                  <CommandItem
                    key={product.id}
                    onSelect={() => setSelectedProduct(product.id)}
                    className="flex items-center gap-3"
                  >
                    <div className={cn(
                      "h-4 w-4 rounded border-2 flex items-center justify-center",
                      selectedProduct === product.id 
                        ? "bg-primary border-primary" 
                        : "border-muted-foreground"
                    )}>
                      {selectedProduct === product.id && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-8 w-8 rounded object-cover"
                    />
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        ${product.price}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}

      {/* Selected Items Summary */}
      {(selectedUsers.length > 0 || selectedGroups.length > 0 || selectedProduct) && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Selected:</div>
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map(userId => {
              const user = mockUsers.find(u => u.id === userId)
              return user ? (
                <Badge key={userId} variant="secondary" className="gap-1">
                  <User className="h-3 w-3" />
                  {user.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => toggleUser(userId)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ) : null
            })}
            {selectedGroups.map(groupId => {
              const group = mockGroups.find(g => g.id === groupId)
              return group ? (
                <Badge key={groupId} variant="secondary" className="gap-1">
                  <Building className="h-3 w-3" />
                  {group.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => toggleGroup(groupId)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ) : null
            })}
            {selectedProduct && (
              <Badge variant="secondary" className="gap-1">
                <ShoppingBag className="h-3 w-3" />
                Product
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setSelectedProduct(undefined)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
