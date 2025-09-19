"use client"

import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  Edit3, 
  MessageCircle, 
  UserPlus, 
  MoreHorizontal, 
  Camera,
  MapPin,
  Globe,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { IndividualProfile, CompanyProfile } from '@/types/profile'
import { formatDistanceToNow } from 'date-fns'

interface ProfileHeaderProps {
  profile: IndividualProfile | CompanyProfile
  isOwnProfile?: boolean
  onEdit?: () => void
  onMessage?: () => void
  onFollow?: () => void
  onAvatarEdit?: () => void
  onBannerEdit?: () => void
  className?: string
}

export function ProfileHeader({
  profile,
  isOwnProfile = false,
  onEdit,
  onMessage,
  onFollow,
  onAvatarEdit,
  onBannerEdit,
  className
}: ProfileHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  
  // Parallax effect for banner
  const bannerY = useTransform(scrollY, [0, 300], [0, -150])
  const bannerOpacity = useTransform(scrollY, [0, 200], [1, 0.3])
  
  // Header collapse animation
  const headerHeight = useTransform(scrollY, [0, 100], [400, 120])
  const headerOpacity = useTransform(scrollY, [0, 50], [1, 0.95])

  useEffect(() => {
    const unsubscribe = scrollY.onChange((value) => {
      setIsScrolled(value > 50)
    })
    return unsubscribe
  }, [scrollY])

  const isCompany = profile.type === 'company'
  const displayName = isCompany 
    ? (profile as CompanyProfile).companyName 
    : `${(profile as IndividualProfile).firstName} ${(profile as IndividualProfile).lastName}`

  return (
    <motion.div
      className={cn('relative overflow-hidden', className)}
      style={{ height: headerHeight }}
    >
      {/* Banner with parallax effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"
        style={{ 
          y: bannerY,
          opacity: bannerOpacity
        }}
      >
        {profile.banner ? (
          <img
            src={profile.banner}
            alt="Profile banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600" />
        )}
        
        {/* Banner edit overlay */}
        {isOwnProfile && (
          <motion.div
            className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            onClick={onBannerEdit}
          >
            <Button variant="secondary" size="sm">
              <Camera className="h-4 w-4 mr-2" />
              Edit Banner
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Content overlay */}
      <motion.div
        className="relative z-10 h-full flex flex-col justify-end p-6"
        style={{ opacity: headerOpacity }}
      >
        <div className="flex items-end gap-6">
          {/* Avatar */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback className="text-2xl">
                {displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            {/* Avatar edit overlay */}
            {isOwnProfile && (
              <motion.div
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                onClick={onAvatarEdit}
                whileHover={{ scale: 1.05 }}
              >
                <Camera className="h-6 w-6 text-white" />
              </motion.div>
            )}
          </motion.div>

          {/* Profile info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-white">
                    {displayName}
                  </h1>
                  {profile.isVerified && (
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      ✓ Verified
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-white/90">
                  <span className="text-lg">@{profile.username}</span>
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      <a 
                        href={profile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Website
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>

                {profile.bio && (
                  <p className="text-white/90 max-w-2xl leading-relaxed">
                    {profile.bio}
                  </p>
                )}

                {/* Social links */}
                {profile.socialLinks.length > 0 && (
                  <div className="flex gap-3">
                    {profile.socialLinks.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        {link.platform}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {isOwnProfile ? (
                  <Button onClick={onEdit} className="bg-white text-gray-900 hover:bg-gray-100">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={onFollow}
                      variant="outline" 
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Follow
                    </Button>
                    <Button 
                      onClick={onMessage}
                      variant="outline" 
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Share Profile</DropdownMenuItem>
                    <DropdownMenuItem>Report</DropdownMenuItem>
                    {isOwnProfile && (
                      <>
                        <DropdownMenuItem>Privacy Settings</DropdownMenuItem>
                        <DropdownMenuItem>Analytics</DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Compact header when scrolled */}
      <motion.div
        className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b shadow-sm z-20"
        initial={{ opacity: 0, y: -100 }}
        animate={{ 
          opacity: isScrolled ? 1 : 0,
          y: isScrolled ? 0 : -100
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-4 p-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback>
              {displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-lg truncate">{displayName}</h2>
            <p className="text-sm text-muted-foreground">@{profile.username}</p>
          </div>

          <div className="flex gap-2">
            {isOwnProfile ? (
              <Button onClick={onEdit} size="sm">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <>
                <Button onClick={onFollow} variant="outline" size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Follow
                </Button>
                <Button onClick={onMessage} variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
