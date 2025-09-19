"use client"

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  ShoppingBag, 
  Heart,
  ExternalLink
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Product } from '@/types/feed'

// Animation variants
const carouselVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  }
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

interface MarketplaceCarouselProps {
  products: Product[]
  onProductClick: (product: Product) => void
  onLike: (productId: string) => void
  className?: string
}

export function MarketplaceCarousel({
  products,
  onProductClick,
  onLike,
  className
}: MarketplaceCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const itemsPerView = 3
  const maxIndex = Math.max(0, products.length - itemsPerView)

  const scrollToIndex = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, maxIndex))
    setCurrentIndex(clampedIndex)
    
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.scrollWidth / products.length
      scrollRef.current.scrollTo({
        left: clampedIndex * itemWidth,
        behavior: 'smooth'
      })
    }
  }

  const handlePrevious = () => {
    scrollToIndex(currentIndex - 1)
  }

  const handleNext = () => {
    scrollToIndex(currentIndex + 1)
  }

  const canScrollLeft = currentIndex > 0
  const canScrollRight = currentIndex < maxIndex

  if (products.length === 0) {
    return null
  }

  return (
    <motion.div
      variants={carouselVariants}
      initial="hidden"
      animate="visible"
      className={cn('relative', className)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Trending in Marketplace</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={!canScrollLeft}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={!canScrollRight}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex gap-4"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                className="flex-shrink-0 w-72"
              >
                <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden rounded-t-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                        <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
                      </div>
                      
                      {/* Like button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onLike(product.id)
                        }}
                        className="absolute top-2 right-2 h-8 w-8 p-0 bg-background/80 hover:bg-background"
                      >
                        <Heart 
                          className={cn(
                            'h-4 w-4',
                            product.userInteractions?.liked && 'fill-current text-red-500'
                          )} 
                        />
                      </Button>

                      {/* Badge */}
                      {product.badge && (
                        <Badge 
                          variant="secondary" 
                          className="absolute top-2 left-2"
                        >
                          {product.badge}
                        </Badge>
                      )}

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          onClick={(e) => {
                            e.stopPropagation()
                            onProductClick(product)
                          }}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h4>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current text-yellow-500" />
                            <span className="text-xs font-medium">
                              {product.rating}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({product.reviewCount})
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="text-lg font-bold">
                              ${product.price}
                            </div>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <div className="text-sm text-muted-foreground line-through">
                                ${product.originalPrice}
                              </div>
                            )}
                          </div>
                          
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              onProductClick(product)
                            }}
                            className="h-8"
                          >
                            <ShoppingBag className="h-3 w-3 mr-1" />
                            Buy
                          </Button>
                        </div>

                        {/* Seller info */}
                        <div className="text-xs text-muted-foreground">
                          by {product.seller.name}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicators */}
        <div className="flex justify-center gap-1 mt-4">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={cn(
                'h-2 w-2 rounded-full transition-all duration-300',
                index === currentIndex 
                  ? 'bg-primary w-6' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              )}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
