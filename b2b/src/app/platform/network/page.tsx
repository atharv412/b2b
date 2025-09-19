"use client"

import { PlatformLayout } from "@/components/layout/PlatformLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, UserPlus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

const connections = [
  { name: "Ananya Gupta", role: "Product Manager", company: "TechCorp", mutual: 12 },
  { name: "Arjun Mehta", role: "Full Stack Developer", company: "Startup Inc", mutual: 8 },
  { name: "Priya Patel", role: "UX Designer", company: "Design Co", mutual: 15 },
  { name: "Vikram Singh", role: "Data Scientist", company: "AI Labs", mutual: 6 }
]

export default function NetworkPage() {
  return (
    <PlatformLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Network</h1>
          <p className="text-gray-600">Manage your professional connections</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Connections
                  </CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search connections..." className="pl-10 w-64" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {connections.map((connection, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>{connection.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">{connection.name}</h3>
                          <p className="text-sm text-gray-600">{connection.role} at {connection.company}</p>
                          <p className="text-xs text-gray-500">{connection.mutual} mutual connections</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Message
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Network Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">1,247</p>
                    <p className="text-sm text-gray-600">Total Connections</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">+24</p>
                    <p className="text-sm text-gray-600">New This Week</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="h-5 w-5 mr-2" />
                  People You May Know
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Lisa Davis", "Tom Wilson", "Anna Chen"].map((name, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{name}</p>
                          <p className="text-xs text-gray-500">5 mutual connections</p>
                        </div>
                      </div>
                      <Button size="sm">Connect</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PlatformLayout>
  )
} 