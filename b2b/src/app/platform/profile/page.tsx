"use client"

import { PlatformLayout } from "@/components/layout/PlatformLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, MapPin, Calendar, Link as LinkIcon, Edit } from "lucide-react"

export default function ProfilePage() {
  return (
    <PlatformLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile
              </CardTitle>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6 mb-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl">JD</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Ram Sharma</h2>
                <p className="text-lg text-gray-600">Software Engineer</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    San Francisco, CA
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    Joined March 2023
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">About</h3>
                <p className="text-gray-600">
                  Passionate software engineer with 5+ years of experience in full-stack development. 
                  Specialized in React, Node.js, and cloud technologies. Always eager to learn new 
                  technologies and contribute to innovative projects.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {["React", "TypeScript", "Node.js", "Python", "AWS", "Docker"].map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PlatformLayout>
  )
} 