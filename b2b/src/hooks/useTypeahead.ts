"use client"

import { useState, useEffect, useRef, useCallback } from 'react'

interface UseTypeaheadOptions<T> {
  items: T[]
  getItemValue: (item: T) => string
  onSelect?: (item: T) => void
  minLength?: number
  debounceMs?: number
  maxResults?: number
}

export function useTypeahead<T>({
  items,
  getItemValue,
  onSelect,
  minLength = 2,
  debounceMs = 300,
  maxResults = 10
}: UseTypeaheadOptions<T>) {
  const [query, setQuery] = useState('')
  const [filteredItems, setFilteredItems] = useState<T[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const filterItems = useCallback((searchQuery: string) => {
    if (searchQuery.length < minLength) {
      setFilteredItems([])
      setIsOpen(false)
      return
    }

    const filtered = items
      .filter(item => 
        getItemValue(item).toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, maxResults)

    setFilteredItems(filtered)
    setIsOpen(filtered.length > 0)
    setSelectedIndex(-1)
  }, [items, getItemValue, minLength, maxResults])

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      filterItems(newQuery)
    }, debounceMs)
  }, [filterItems, debounceMs])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < filteredItems.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredItems.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < filteredItems.length) {
          const selectedItem = filteredItems[selectedIndex]
          setQuery(getItemValue(selectedItem))
          setIsOpen(false)
          onSelect?.(selectedItem)
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }, [isOpen, selectedIndex, filteredItems, getItemValue, onSelect])

  const handleItemSelect = useCallback((item: T) => {
    setQuery(getItemValue(item))
    setIsOpen(false)
    setSelectedIndex(-1)
    onSelect?.(item)
  }, [getItemValue, onSelect])

  const clear = useCallback(() => {
    setQuery('')
    setFilteredItems([])
    setIsOpen(false)
    setSelectedIndex(-1)
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return {
    query,
    filteredItems,
    isOpen,
    selectedIndex,
    handleQueryChange,
    handleItemSelect,
    clear
  }
}
