"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Building2,
  Users,
  Award,
  FileText,
  Globe,
  Calendar,
  MapPin,
  ExternalLink,
  Search,
  Link
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { CompanyProfile } from '@/types/profile'

interface CompanyProfileSectionsProps {
  profile: CompanyProfile
  onUpdateProfile: (updates: Partial<CompanyProfile>) => void
  isOwnProfile?: boolean
  className?: string
}

export function CompanyProfileSections({
  profile,
  onUpdateProfile,
  isOwnProfile = false,
  className
}: CompanyProfileSectionsProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleAddItem = (section: string, item: any) => {
    // Implementation would depend on the specific section
    console.log(`Adding ${section}:`, item)
  }

  const handleUpdateItem = (section: string, id: string, updates: any) => {
    // Implementation would depend on the specific section
    console.log(`Updating ${section} ${id}:`, updates)
  }

  const handleRemoveItem = (section: string, id: string) => {
    // Implementation would depend on the specific section
    console.log(`Removing ${section} ${id}`)
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Core Domains */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Core Domains
            </CardTitle>
            {isOwnProfile && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAdding(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Domain
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.coreDomains.map((domain, index) => (
              <motion.div
                key={domain}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{domain}</h4>
                  {isOwnProfile && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem('coreDomains', domain)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Major Projects */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Major Projects
            </CardTitle>
            {isOwnProfile && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAdding(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.majorProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Award className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    
                    {isOwnProfile && (
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setEditingId(project.id)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleRemoveItem('majorProjects', project.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-lg line-clamp-1">{project.title}</h4>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{project.startDate} - {project.endDate}</span>
                        </div>
                        <span>{project.status}</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((tech, techIndex) => (
                          <Badge key={techIndex} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.technologies.length - 3} more
                          </Badge>
                        )}
                      </div>

                      {project.liveUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => window.open(project.liveUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Project
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contracts & Partners */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Contracts & Partners
            </CardTitle>
            {isOwnProfile && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAdding(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Partner
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {profile.contractsAndPartners.map((partner, index) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow text-center"
              >
                <div className="w-16 h-16 bg-muted rounded-lg mx-auto mb-3 flex items-center justify-center">
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Building2 className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <h4 className="font-medium mb-1">{partner.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{partner.type}</p>
                <Badge variant="outline" className="text-xs">
                  {partner.status}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team
            </CardTitle>
            {isOwnProfile && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAdding(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profile.team.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <Users className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium">{member.name}</h4>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                  <p className="text-xs text-muted-foreground">{member.department}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {member.status}
                  </Badge>
                  {isOwnProfile && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem('team', member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Product Listings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Product Listings
            </CardTitle>
            {isOwnProfile && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAdding(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.productListings.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Globe className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    
                    {isOwnProfile && (
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setEditingId(product.id)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleRemoveItem('productListings', product.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-lg line-clamp-1">{product.name}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">${product.price}</span>
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{product.location}</span>
                        </div>
                        <span>{product.availability}</span>
                      </div>

                      {product.listingUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => window.open(product.listingUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Listing
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Licenses & Certifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Licenses & Certifications
            </CardTitle>
            {isOwnProfile && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAdding(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add License
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.licensesAndCertifications.map((license, index) => (
              <motion.div
                key={license.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium">{license.name}</h4>
                    <p className="text-sm text-muted-foreground">{license.issuer}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {license.issueDate} - {license.expiryDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {license.status}
                    </Badge>
                    {isOwnProfile && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem('licensesAndCertifications', license.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
