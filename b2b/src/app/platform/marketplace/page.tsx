"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PlatformLayout } from "@/components/layout/PlatformLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  Heart,
  ShoppingCart,
  Eye,
  MessageCircle,
  MapPin,
  Calendar,
  TrendingUp,
  Package,
  Zap,
  Shield,
  Award
} from "lucide-react"

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

const products = [
  {
    id: 1,
    name: "AI-Powered Analytics Dashboard",
    description: "Advanced analytics platform with machine learning insights for business intelligence.",
    price: 299,
    originalPrice: 399,
    rating: 4.8,
    reviews: 124,
    seller: "TechCorp Solutions",
    category: "Software",
    image: "/placeholder-product1.jpg",
    tags: ["AI", "Analytics", "Dashboard"],
    featured: true,
    delivery: "Instant",
    sales: 1250
  },
  {
    id: 2,
    name: "Professional Video Conferencing System",
    description: "Enterprise-grade video conferencing solution with 4K support and advanced security.",
    price: 1299,
    originalPrice: null,
    rating: 4.6,
    reviews: 89,
    seller: "VideoTech Pro",
    category: "Hardware",
    image: "/placeholder-product2.jpg",
    tags: ["Video", "Conferencing", "Enterprise"],
    featured: false,
    delivery: "3-5 days",
    sales: 567
  },
  {
    id: 3,
    name: "Cloud Storage & Backup Solution",
    description: "Secure cloud storage with automated backup and disaster recovery features.",
    price: 49,
    originalPrice: 79,
    rating: 4.9,
    reviews: 267,
    seller: "CloudSecure Inc",
    category: "Service",
    image: "/placeholder-product3.jpg",
    tags: ["Cloud", "Storage", "Backup"],
    featured: true,
    delivery: "Instant",
    sales: 2134
  },
  {
    id: 4,
    name: "Digital Marketing Automation Suite",
    description: "Complete marketing automation platform with email, social media, and analytics.",
    price: 199,
    originalPrice: null,
    rating: 4.5,
    reviews: 156,
    seller: "MarketPro Solutions",
    category: "Software",
    image: "/placeholder-product4.jpg",
    tags: ["Marketing", "Automation", "Email"],
    featured: false,
    delivery: "Instant",
    sales: 892
  }
]

const categories = [
  { name: "All Products", count: 1245, icon: Package },
  { name: "Software", count: 456, icon: Zap },
  { name: "Hardware", count: 234, icon: Shield },
  { name: "Services", count: 345, icon: Award },
  { name: "Consulting", count: 210, icon: TrendingUp }
]

export default function MarketplacePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [selectedCategory, setSelectedCategory] = useState("All Products")
  const [searchQuery, setSearchQuery] = useState("")

  const ProductCard = ({ product, isListView = false }: { product: any, isListView?: boolean }) => (
    <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
      <Card className={`${isListView ? 'flex' : ''} shadow-sm hover:shadow-lg transition-all duration-300 group`}>
        <div className={`${isListView ? 'w-48 h-48' : 'aspect-square'} relative overflow-hidden ${isListView ? '' : 'rounded-t-lg'}`}>
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <Package className="h-16 w-16 text-gray-400" />
          </div>
          
          {product.featured && (
            <Badge className="absolute top-3 left-3 bg-orange-500">
              Featured
            </Badge>
          )}
          
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="secondary" className="h-8 w-8">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex space-x-2">
              <Button size="icon" variant="secondary" className="h-8 w-8">
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" className="h-8 w-8">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className={`${isListView ? 'flex-1' : ''} p-4`}>
          <div className="flex items-start justify-between mb-2">
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">{product.rating}</span>
              <span className="text-xs text-gray-500">({product.reviews})</span>
            </div>
          </div>
          
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                )}
              </div>
              <p className="text-xs text-gray-500">by {product.seller}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {product.delivery}
              </p>
              <p className="text-xs text-green-600">{product.sales} sold</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button className="flex-1" size="sm">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" size="sm">
              Quote
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )

  return (
    <PlatformLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace</h1>
          <p className="text-gray-600">Discover products and services from verified businesses</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Categories</label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.name} className="flex items-center space-x-3">
                        <Checkbox
                          checked={selectedCategory === category.name}
                          onCheckedChange={() => setSelectedCategory(category.name)}
                        />
                        <category.icon className="h-4 w-4 text-gray-500" />
                        <span className="text-sm flex-1">{category.name}</span>
                        <span className="text-xs text-gray-500">({category.count})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Price Range</label>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={2000}
                      step={10}
                      className="mb-4"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Rating</label>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox />
                        <div className="flex items-center">
                          {Array.from({ length: rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          {Array.from({ length: 5 - rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-gray-300" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">& up</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full">Apply Filters</Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">1,245 products found</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <Select defaultValue="relevance">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Featured Products */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
                Featured Products
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.filter(p => p.featured).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>

            {/* All Products */}
            <div>
              <h2 className="text-xl font-semibold mb-4">All Products</h2>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isListView={viewMode === "list"}
                  />
                ))}
              </motion.div>
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Load More Products
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PlatformLayout>
  )
} 