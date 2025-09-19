"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar,
  ExternalLink,
  Award,
  Shield,
  Download,
  Eye,
  EyeOff
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
import { Certification } from '@/types/profile'

interface CertificationsListProps {
  certifications: Certification[]
  onAddCertification: (certification: Omit<Certification, 'id'>) => void
  onUpdateCertification: (id: string, updates: Partial<Certification>) => void
  onRemoveCertification: (id: string) => void
  isOwnProfile?: boolean
  className?: string
}

export function CertificationsList({
  certifications,
  onAddCertification,
  onUpdateCertification,
  onRemoveCertification,
  isOwnProfile = false,
  className
}: CertificationsListProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newCertification, setNewCertification] = useState<Omit<Certification, 'id'>>({
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    description: '',
    skills: [],
    visibility: 'public'
  })

  const handleAddCertification = () => {
    if (newCertification.name && newCertification.issuer && newCertification.issueDate) {
      onAddCertification(newCertification)
      setNewCertification({
        name: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        credentialId: '',
        credentialUrl: '',
        description: '',
        skills: [],
        visibility: 'public'
      })
      setIsAdding(false)
    }
  }

  const handleUpdateCertification = (id: string, updates: Partial<Certification>) => {
    onUpdateCertification(id, updates)
    setEditingId(null)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short',
      day: 'numeric'
    })
  }

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false
    return new Date(expiryDate) < new Date()
  }

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false
    const expiry = new Date(expiryDate)
    const now = new Date()
    const diffTime = expiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 && diffDays <= 30
  }

  const getCertificationIcon = (issuer: string) => {
    const lowerIssuer = issuer.toLowerCase()
    if (lowerIssuer.includes('microsoft')) {
      return <Shield className="h-5 w-5 text-blue-600" />
    } else if (lowerIssuer.includes('aws') || lowerIssuer.includes('amazon')) {
      return <Shield className="h-5 w-5 text-orange-600" />
    } else if (lowerIssuer.includes('google')) {
      return <Shield className="h-5 w-5 text-green-600" />
    } else if (lowerIssuer.includes('cisco')) {
      return <Shield className="h-5 w-5 text-blue-500" />
    } else {
      return <Award className="h-5 w-5 text-purple-600" />
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Certifications
          </CardTitle>
          {isOwnProfile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Certification
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Certification Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 border rounded-lg bg-muted/50 space-y-4"
            >
              <h4 className="font-medium">Add New Certification</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Certification Name</label>
                  <Input
                    value={newCertification.name}
                    onChange={(e) => setNewCertification(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. AWS Solutions Architect"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Issuing Organization</label>
                  <Input
                    value={newCertification.issuer}
                    onChange={(e) => setNewCertification(prev => ({ ...prev, issuer: e.target.value }))}
                    placeholder="e.g. Amazon Web Services"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Issue Date</label>
                  <Input
                    type="date"
                    value={newCertification.issueDate}
                    onChange={(e) => setNewCertification(prev => ({ ...prev, issueDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Expiry Date (Optional)</label>
                  <Input
                    type="date"
                    value={newCertification.expiryDate}
                    onChange={(e) => setNewCertification(prev => ({ ...prev, expiryDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Credential ID</label>
                  <Input
                    value={newCertification.credentialId}
                    onChange={(e) => setNewCertification(prev => ({ ...prev, credentialId: e.target.value }))}
                    placeholder="e.g. AWS-123456789"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Credential URL</label>
                  <Input
                    value={newCertification.credentialUrl}
                    onChange={(e) => setNewCertification(prev => ({ ...prev, credentialUrl: e.target.value }))}
                    placeholder="https://credly.com/badges/..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Visibility</label>
                  <Select
                    value={newCertification.visibility}
                    onValueChange={(value: 'public' | 'private') => setNewCertification(prev => ({ ...prev, visibility: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newCertification.description}
                  onChange={(e) => setNewCertification(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this certification covers..."
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Skills Covered</label>
                <Input
                  value={newCertification.skills.join(', ')}
                  onChange={(e) => setNewCertification(prev => ({ 
                    ...prev, 
                    skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  }))}
                  placeholder="e.g. Cloud Computing, AWS Services, Architecture Design"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddCertification} size="sm">
                  Add Certification
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAdding(false)
                    setNewCertification({
                      name: '',
                      issuer: '',
                      issueDate: '',
                      expiryDate: '',
                      credentialId: '',
                      credentialUrl: '',
                      description: '',
                      skills: [],
                      visibility: 'public'
                    })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          {getCertificationIcon(cert.issuer)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-sm line-clamp-2">{cert.name}</h4>
                          <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {isOwnProfile && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingId(cert.id)}
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveCertification(cert.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-1">
                      <Badge variant={cert.visibility === 'public' ? 'default' : 'secondary'} className="text-xs">
                        {cert.visibility === 'public' ? (
                          <Eye className="h-3 w-3 mr-1" />
                        ) : (
                          <EyeOff className="h-3 w-3 mr-1" />
                        )}
                        {cert.visibility}
                      </Badge>
                      
                      {cert.expiryDate && (
                        <>
                          {isExpired(cert.expiryDate) ? (
                            <Badge variant="destructive" className="text-xs">
                              Expired
                            </Badge>
                          ) : isExpiringSoon(cert.expiryDate) ? (
                            <Badge variant="secondary" className="text-xs text-orange-600">
                              Expires Soon
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Valid
                            </Badge>
                          )}
                        </>
                      )}
                    </div>

                    {/* Dates */}
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Issued: {formatDate(cert.issueDate)}</span>
                      </div>
                      {cert.expiryDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Expires: {formatDate(cert.expiryDate)}</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {cert.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {cert.description}
                      </p>
                    )}

                    {/* Skills */}
                    {cert.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {cert.skills.slice(0, 3).map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {cert.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{cert.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Action Links */}
                    <div className="flex gap-2 pt-2">
                      {cert.credentialUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => window.open(cert.credentialUrl, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Credential
                        </Button>
                      )}
                      {cert.credentialId && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => navigator.clipboard.writeText(cert.credentialId)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Copy ID
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {certifications.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No certifications added yet</p>
            {isOwnProfile && (
              <p className="text-sm">Click "Add Certification" to showcase your credentials</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
