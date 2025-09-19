"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"

export function Navigation() {
  return (
    <motion.header 
      className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
        >
          <Building2 className="h-8 w-8 text-blue-600" />
          <Link href="/" className="text-2xl font-bold text-gray-900">
            B2B Platform
          </Link>
        </motion.div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
            Dashboard
          </Link>
          <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
            Features
          </Link>
          <Link href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">
            Contact
          </Link>
          <Button variant="outline" asChild>
            <Link href="/auth?mode=signin">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/auth?mode=signup">Get Started</Link>
          </Button>
        </nav>
      </div>
    </motion.header>
  )
} 