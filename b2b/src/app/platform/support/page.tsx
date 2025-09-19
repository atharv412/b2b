"use client"

import { PlatformLayout } from "@/components/layout/PlatformLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, MessageCircle, Search, Phone, Mail } from "lucide-react"

const faqs = [
  {
    question: "How do I reset my password?",
    answer: "You can reset your password by clicking on 'Forgot Password' on the login page."
  },
  {
    question: "How can I change my profile information?",
    answer: "Go to Settings > Profile to update your personal information."
  },
  {
    question: "How do I connect with other professionals?",
    answer: "Use the Network section to find and connect with other professionals in your field."
  }
]

export default function SupportPage() {
  return (
    <PlatformLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
          <p className="text-gray-600">Get help and find answers to your questions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b pb-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Contact Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Your name" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help?" />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Describe your issue or question..."
                      className="min-h-[120px]"
                    />
                  </div>
                  <Button>Send Message</Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle>Search Help</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search help articles..." className="pl-10" />
                </div>
              </CardContent>
            </Card>

            {/* Contact Options */}
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-gray-600">support@b2bplatform.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Phone className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <MessageCircle className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Live Chat</p>
                    <Badge className="bg-green-500">Online</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Hours */}
            <Card>
              <CardHeader>
                <CardTitle>Support Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PlatformLayout>
  )
} 