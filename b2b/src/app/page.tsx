"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowRight, Building2, Users, TrendingUp, Shield } from "lucide-react"
import { Navigation } from "@/components/Navigation"
import Link from "next/link"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

const features = [
  {
    icon: Building2,
    title: "Enterprise Solutions",
    description: "Tailored B2B solutions for large-scale operations and complex business needs."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Seamless collaboration tools to connect teams across departments and locations."
  },
  {
    icon: TrendingUp,
    title: "Analytics & Insights",
    description: "Powerful analytics to drive data-driven decisions and business growth."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level security with compliance standards for enterprise data protection."
  }
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO, TechCorp",
    avatar: "SJ",
    content: "This B2B platform has transformed how we manage our business operations. Highly recommended!"
  },
  {
    name: "Michael Chen",
    role: "Operations Director, InnovateLabs",
    avatar: "MC",
    content: "The analytics features have given us insights we never had before. Game-changing platform."
  },
  {
    name: "Emily Rodriguez",
    role: "VP Sales, GlobalTech",
    avatar: "ER",
    content: "Seamless integration and excellent support. Our productivity has increased by 40%."
  }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Navigation />

      {/* Hero Section */}
      <motion.section 
        className="py-20 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto text-center">
          <motion.div variants={itemVariants}>
            <Badge variant="secondary" className="mb-4">
              🚀 New: AI-Powered Business Intelligence
            </Badge>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
            variants={itemVariants}
          >
            Transform Your
            <span className="block text-blue-600">Business Operations</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Streamline your B2B processes with our comprehensive platform designed for modern enterprises. 
            Boost productivity, enhance collaboration, and drive growth.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/auth">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link href="/platform">
                View Platform Demo
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the features that make us the preferred choice for leading B2B companies worldwide.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by leading companies worldwide
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <CardDescription>{testimonial.role}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 italic">&quot;{testimonial.content}&quot;</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 px-4 bg-blue-600 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of companies already using our platform to drive growth and efficiency.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Your Free Trial Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Building2 className="h-6 w-6" />
                <span className="text-xl font-bold">B2B Platform</span>
              </div>
              <p className="text-gray-400">
                Empowering businesses with cutting-edge B2B solutions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 B2B Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
