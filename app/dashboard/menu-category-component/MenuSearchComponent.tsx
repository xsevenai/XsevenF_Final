// app/dashboard/menu-category-component/MenuSearchComponent.tsx

"use client"

import { useState, useEffect } from 'react'
import { Search, Filter, ArrowLeft, Loader2, X, SlidersHorizontal } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useMenu } from '@/hooks/use-menu'
import type { MenuItemSearch } from '@/src/api/generated/models/MenuItemSearch'
import type { MenuItem } from '@/src/api/generated/models/MenuItem'
import type { MenuCategory } from '@/src/api/generated/models/MenuCategory'

interface SearchProps {
  onBack: () => void
}

export default function MenuSearchComponent({ onBack }: SearchProps) {
  const { theme, isLoaded: themeLoaded, isDark } = useTheme()
  const businessId = typeof window !== "undefined" ? localStorage.getItem("businessId") || "" : ""
  const { searchItems, categories } = useMenu(businessId)
  
  const [searchCriteria, setSearchCriteria] = useState<MenuItemSearch>({
    business_id: businessId,
    name: '',
    description: '',
    category_id: '',
    min_price: undefined,
    max_price: undefined,
    is_available: undefined,
    tags: [],
    location_id: '',
    sort_by: 'name',
    sort_order: 'asc',
    limit: 50,
    offset: 0
  })
  
  const [searchResults, setSearchResults] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    if (businessId) {
      setSearchCriteria(prev => ({ ...prev, business_id: businessId }))
    }
  }, [businessId])

  const handleSearch = async () => {
    if (!searchCriteria.name && !searchCriteria.description && !searchCriteria.category_id) {
      setError('Please enter at least one search criteria')
      return
    }

    setLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      const results = await searchItems(searchCriteria)
      setSearchResults(results)
    } catch (err: any) {
      setError(err.message || 'Search failed')
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleClearFilters = () => {
    setSearchCriteria({
      business_id: businessId,
      name: '',
      description: '',
      category_id: '',
      min_price: undefined,
      max_price: undefined,
      is_available: undefined,
      tags: [],
      location_id: '',
      sort_by: 'name',
      sort_order: 'asc',
      limit: 50,
      offset: 0
    })
    setSearchResults([])
    setHasSearched(false)
    setError(null)
  }

  const handleTagAdd = (tag: string) => {
    if (tag.trim() && !searchCriteria.tags?.includes(tag.trim())) {
      setSearchCriteria(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag.trim()]
      }))
    }
  }

  const handleTagRemove = (tagToRemove: string) => {
    setSearchCriteria(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }))
  }

  if (!themeLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  
  const primaryButtonBg = isDark 
    ? 'bg-gradient-to-r from-[#0f0f0f] via-[#1a1a1a] to-[#2a2a2a] hover:from-[#1a1a1a] hover:via-[#222222] hover:to-[#333333] text-white border-[#444444]' 
    : 'bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 hover:from-gray-100 hover:via-gray-200 hover:to-gray-300 text-gray-900 border-gray-300'
  
  const secondaryButtonBg = isDark 
    ? 'bg-gradient-to-r from-[#1a1a1a] via-[#222222] to-[#2a2a2a] hover:from-[#222222] hover:via-[#2a2a2a] hover:to-[#333333] text-gray-300 border-[#333333]' 
    : 'bg-gradient-to-r from-gray-100 via-gray-150 to-gray-200 hover:from-gray-150 hover:via-gray-200 hover:to-gray-250 text-gray-700 border-gray-400'

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className={`${cardBg} p-8 border shadow-lg transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className={`${textSecondary} ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-200'} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2 transition-colors duration-300`}>
              Advanced Menu Search
            </h1>
            <p className={`${textSecondary} transition-colors duration-300`}>
              Search menu items with advanced filters and criteria
            </p>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className={`${cardBg} p-6 border shadow-lg transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
        <div className="space-y-6">
          {/* Basic Search Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block ${textPrimary} font-medium mb-2`}>Item Name</label>
              <input
                type="text"
                value={searchCriteria.name || ''}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full ${innerCardBg} ${textPrimary} px-4 py-3 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                placeholder="Search by item name..."
              />
            </div>
            <div>
              <label className={`block ${textPrimary} font-medium mb-2`}>Description</label>
              <input
                type="text"
                value={searchCriteria.description || ''}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, description: e.target.value }))}
                className={`w-full ${innerCardBg} ${textPrimary} px-4 py-3 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                placeholder="Search by description..."
              />
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className={`block ${textPrimary} font-medium mb-2`}>Category</label>
            <select
              value={searchCriteria.category_id || ''}
              onChange={(e) => setSearchCriteria(prev => ({ ...prev, category_id: e.target.value || undefined }))}
              className={`w-full ${innerCardBg} ${textPrimary} px-4 py-3 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block ${textPrimary} font-medium mb-2`}>Min Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={searchCriteria.min_price || ''}
                onChange={(e) => setSearchCriteria(prev => ({ 
                  ...prev, 
                  min_price: e.target.value ? parseFloat(e.target.value) : undefined 
                }))}
                className={`w-full ${innerCardBg} ${textPrimary} px-4 py-3 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className={`block ${textPrimary} font-medium mb-2`}>Max Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={searchCriteria.max_price || ''}
                onChange={(e) => setSearchCriteria(prev => ({ 
                  ...prev, 
                  max_price: e.target.value ? parseFloat(e.target.value) : undefined 
                }))}
                className={`w-full ${innerCardBg} ${textPrimary} px-4 py-3 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                placeholder="100.00"
              />
            </div>
          </div>

          {/* Availability Filter */}
          <div>
            <label className={`block ${textPrimary} font-medium mb-2`}>Availability</label>
            <select
              value={searchCriteria.is_available === undefined ? '' : searchCriteria.is_available.toString()}
              onChange={(e) => setSearchCriteria(prev => ({ 
                ...prev, 
                is_available: e.target.value === '' ? undefined : e.target.value === 'true'
              }))}
              className={`w-full ${innerCardBg} ${textPrimary} px-4 py-3 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
            >
              <option value="">All Items</option>
              <option value="true">Available Only</option>
              <option value="false">Unavailable Only</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className={`block ${textPrimary} font-medium mb-2`}>Tags</label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a tag..."
                  className={`flex-1 ${innerCardBg} ${textPrimary} px-4 py-3 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleTagAdd(e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Add a tag..."]') as HTMLInputElement
                    if (input?.value) {
                      handleTagAdd(input.value)
                      input.value = ''
                    }
                  }}
                  className={`${primaryButtonBg} px-4 py-3 rounded-lg`}
                >
                  Add
                </button>
              </div>
              {searchCriteria.tags && searchCriteria.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {searchCriteria.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`${innerCardBg} px-3 py-1 rounded-lg text-sm flex items-center gap-2`}
                    >
                      <span className={textPrimary}>{tag}</span>
                      <button
                        onClick={() => handleTagRemove(tag)}
                        className={`${textSecondary} hover:text-red-500 transition-colors`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sort Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block ${textPrimary} font-medium mb-2`}>Sort By</label>
              <select
                value={searchCriteria.sort_by || 'name'}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, sort_by: e.target.value as any }))}
                className={`w-full ${innerCardBg} ${textPrimary} px-4 py-3 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="created_at">Date Created</option>
                <option value="updated_at">Last Updated</option>
              </select>
            </div>
            <div>
              <label className={`block ${textPrimary} font-medium mb-2`}>Sort Order</label>
              <select
                value={searchCriteria.sort_order || 'asc'}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, sort_order: e.target.value as 'asc' | 'desc' }))}
                className={`w-full ${innerCardBg} ${textPrimary} px-4 py-3 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSearch}
              disabled={loading}
              className={`${primaryButtonBg} px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all border font-medium disabled:opacity-50`}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <Search className="h-4 w-4" />
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button
              onClick={handleClearFilters}
              className={`${secondaryButtonBg} px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all border font-medium`}
            >
              <X className="h-4 w-4" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className={`${cardBg} p-6 border shadow-lg transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold ${textPrimary}`}>
              Search Results ({searchResults.length})
            </h2>
            {loading && <Loader2 className="h-5 w-5 animate-spin text-gray-500" />}
          </div>

          {error && (
            <div className={`${innerCardBg} p-4 border border-red-500/20 bg-red-500/10 rounded-lg mb-6`}>
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 text-red-500" />
                <span className="text-red-500 font-medium">Error: {error}</span>
              </div>
            </div>
          )}

          {searchResults.length === 0 && !loading && !error && (
            <div className={`${innerCardBg} p-8 text-center rounded-lg`}>
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className={`${textPrimary} font-medium mb-2`}>No Results Found</h3>
              <p className={`${textSecondary} text-sm`}>
                Try adjusting your search criteria or filters
              </p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((item, index) => {
                const category = categories.find(cat => cat.id === item.category_id)
                return (
                  <div
                    key={item.id}
                    className={`${innerCardBg} p-5 border hover:shadow-xl transition-all duration-300`}
                    style={{
                      borderRadius: index % 4 === 0 ? '2rem' : index % 4 === 1 ? '1rem' : index % 4 === 2 ? '1.5rem' : '2.5rem',
                    }}
                  >
                    {/* Image placeholder */}
                    <div className={`w-full h-36 mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} rounded-xl overflow-hidden transition-colors duration-300`}>
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none' }}
                        />
                      )}
                    </div>

                    {/* Name + price */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className={`${textPrimary} font-semibold text-base mb-1 transition-colors duration-300`}>{item.name}</h4>
                        <p className={`${isDark ? 'text-green-400' : 'text-green-600'} font-bold text-xl`}>
                          ${(parseFloat(String(item.price)) || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    {item.description && (
                      <p className={`${textSecondary} text-sm mb-3 transition-colors duration-300`}>{item.description}</p>
                    )}

                    {/* Availability */}
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-xs font-medium ${item.is_available ? 'text-green-500' : 'text-red-500'}`}>
                        {item.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>

                    {/* Footer */}
                    <div className={`mt-3 pt-3 border-t ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'} transition-colors duration-300`}>
                      <span className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'} transition-colors duration-300`}>
                        {category?.name || 'Uncategorized'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
