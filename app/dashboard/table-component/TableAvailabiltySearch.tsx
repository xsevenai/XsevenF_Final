// app/dashboard/table-components/TableAvailabilitySearch.tsx

"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Users, TrendingUp, Loader2, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useTheme } from "@/hooks/useTheme"

interface TableAvailabilitySearchProps {
  checkTableAvailability: (params: {
    party_size: number
    location_id?: string
    time_slot?: string
    business_id?: string
  }) => Promise<any>
  onAvailabilityCheck?: (data: any) => void
  autoExpanded?: boolean
  businessId?: string
}

interface AvailabilityData {
  total_tables: number
  available_count: number
  occupied_count: number
  reserved_count: number
  maintenance_count: number
  available_tables: Array<{
    id: string
    table_number: number
    capacity: number
    section: string
  }>
}

export default function TableAvailabilitySearch({ 
  checkTableAvailability, 
  onAvailabilityCheck, 
  autoExpanded = false,
  businessId 
}: TableAvailabilitySearchProps) {
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [filters, setFilters] = useState({
    section: '',
    capacity: '2' // Default to 2 instead of empty
  })
  const [availability, setAvailability] = useState<AvailabilityData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(autoExpanded)

  const sections = [
    'Main Dining',
    'VIP Section', 
    'Patio',
    'Bar Area',
    'Private Dining',
    'Window Side',
    'Terrace',
    'Garden',
    'Lounge',
    'Outdoor'
  ]

  const checkAvailability = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Prepare parameters - ensure party_size is at least 1
      const partySize = parseInt(filters.capacity) || 1
      if (partySize < 1) {
        setError('Party size must be at least 1')
        return
      }

      const params: any = {
        party_size: partySize
      }
      
      // Add business_id if available
      if (businessId) {
        params.business_id = businessId
      }
      
      // Add location_id if we have a section filter
      if (filters.section) {
        params.location_id = filters.section
      }
      
      console.log('Calling checkTableAvailability with params:', params)
      
      const data = await checkTableAvailability(params)
      console.log('Availability response:', data)
      
      // Transform the response to match your expected format
      const transformedData: AvailabilityData = {
        total_tables: data.length,
        available_count: data.length, // All returned tables are available
        occupied_count: 0, // You might need to calculate this from your tables data
        reserved_count: 0, // You might need to calculate this from your tables data
        maintenance_count: 0, // You might need to calculate this from your tables data
        available_tables: data.map((table: any) => ({
          id: table.id,
          table_number: table.table_number || 0,
          capacity: table.capacity || 0,
          section: table.section || 'Unknown'
        }))
      }
      
      setAvailability(transformedData)
      onAvailabilityCheck?.(transformedData)
    } catch (err: any) {
      console.error('Availability check error:', err)
      
      // More detailed error handling
      if (err.response?.data?.detail) {
        setError(`API Error: ${err.response.data.detail}`)
      } else if (err.message?.includes('Validation Error')) {
        setError('Invalid parameters. Please check your filters and try again.')
      } else {
        setError(err.message || 'Failed to check table availability')
      }
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setFilters({ section: '', capacity: '2' })
    setAvailability(null)
    setError(null)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-check availability when component mounts
  useEffect(() => {
    if (mounted && businessId) {
      checkAvailability()
    }
  }, [mounted, businessId])

  if (!themeLoaded || !mounted) {
    return null
  }

  // Theme variables matching MainPanel
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const textTertiary = isDark ? 'text-gray-500' : 'text-gray-500'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const inputBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-white border-gray-300'
  const hoverBg = isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'
  const iconBg = isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'
  const borderColor = isDark ? 'border-gray-700/50' : 'border-gray-200'
  const statCardBg = isDark ? 'bg-[#1a1a1a]' : 'bg-gray-100'
  const tableCardBg = isDark ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'

  return (
    <Card className={`${cardBg} border shadow-lg p-6 transition-colors duration-300`}
      style={{ borderRadius: '1.5rem' }}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${textPrimary}`}>Table Availability</h3>
              <p className={`${textSecondary} text-sm`}>Check current table status and availability</p>
            </div>
          </div>
          {!autoExpanded && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`px-3 py-1 ${innerCardBg} ${hoverBg} ${textSecondary} text-sm transition-colors`}
              style={{ borderRadius: '0.5rem' }}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
          )}
        </div>

        {/* Quick Stats */}
        {availability && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className={`text-center p-3 ${statCardBg}`}
              style={{ borderRadius: '0.5rem' }}>
              <div className="text-xl font-bold text-green-400">{availability.available_count}</div>
              <div className={`text-xs ${textSecondary}`}>Available</div>
            </div>
            <div className={`text-center p-3 ${statCardBg}`}
              style={{ borderRadius: '0.5rem' }}>
              <div className="text-xl font-bold text-red-400">{availability.occupied_count}</div>
              <div className={`text-xs ${textSecondary}`}>Occupied</div>
            </div>
            <div className={`text-center p-3 ${statCardBg}`}
              style={{ borderRadius: '0.5rem' }}>
              <div className="text-xl font-bold text-blue-400">{availability.reserved_count}</div>
              <div className={`text-xs ${textSecondary}`}>Reserved</div>
            </div>
            <div className={`text-center p-3 ${statCardBg}`}
              style={{ borderRadius: '0.5rem' }}>
              <div className="text-xl font-bold text-yellow-400">{availability.maintenance_count}</div>
              <div className={`text-xs ${textSecondary}`}>Maintenance</div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20"
            style={{ borderRadius: '0.5rem' }}>
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-400 text-sm">{error}</p>
              <p className="text-red-400/80 text-xs mt-1">
                Please check that business ID is valid and party size is at least 1.
              </p>
            </div>
          </div>
        )}

        {/* Expanded Search Filters */}
        {isExpanded && (
          <div className={`space-y-4 pt-4 border-t ${borderColor}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Section Filter */}
              <div>
                <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
                  <MapPin className="h-4 w-4 inline mr-2" />
                  Section
                </label>
                <select
                  value={filters.section}
                  onChange={(e) => setFilters(prev => ({ ...prev, section: e.target.value }))}
                  className={`w-full px-3 py-2 ${inputBg} border ${textPrimary} focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors`}
                  style={{ borderRadius: '0.5rem' }}
                >
                  <option value="">All Sections</option>
                  {sections.map(section => (
                    <option key={section} value={section}>{section}</option>
                  ))}
                </select>
              </div>

              {/* Capacity Filter */}
              <div>
                <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
                  <Users className="h-4 w-4 inline mr-2" />
                  Party Size
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={filters.capacity}
                  onChange={(e) => setFilters(prev => ({ ...prev, capacity: e.target.value }))}
                  className={`w-full px-3 py-2 ${inputBg} border ${textPrimary} placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors`}
                  style={{ borderRadius: '0.5rem' }}
                  placeholder="Enter party size"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-end gap-2">
                <button
                  onClick={checkAvailability}
                  disabled={loading || !businessId}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white transition-colors"
                  style={{ borderRadius: '0.5rem' }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Check
                    </>
                  )}
                </button>
                <button
                  onClick={clearFilters}
                  className={`px-3 py-2 ${innerCardBg} ${hoverBg} ${textSecondary} transition-colors text-sm`}
                  style={{ borderRadius: '0.5rem' }}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Available Tables List */}
            {availability && availability.available_tables.length > 0 && (
              <div>
                <h4 className={`${textPrimary} font-medium mb-3 flex items-center gap-2`}>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Available Tables ({availability.available_tables.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                  {availability.available_tables.map(table => (
                    <div key={table.id} className={`p-3 ${tableCardBg} border`}
                      style={{ borderRadius: '0.5rem' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500/20 flex items-center justify-center"
                          style={{ borderRadius: '0.5rem' }}>
                          <Users className="h-4 w-4 text-green-400" />
                        </div>
                        <div>
                          <div className={`${textPrimary} font-medium text-sm`}>Table {table.table_number}</div>
                          <div className={`${textSecondary} text-xs`}>{table.capacity} seats • {table.section}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Available Tables */}
            {availability && availability.available_tables.length === 0 && (
              <div className="text-center py-6">
                <Clock className={`h-8 w-8 ${textSecondary} mx-auto mb-3`} />
                <p className={`${textSecondary}`}>No available tables match your criteria</p>
                <p className={`${textTertiary} text-sm`}>Try adjusting your filters or check back later</p>
              </div>
            )}
          </div>
        )}

        {/* Business ID Debug Info */}
        {!businessId && (
          <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20"
            style={{ borderRadius: '0.5rem' }}>
            <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
            <p className="text-yellow-400 text-sm">No business ID available. Please ensure you're logged in.</p>
          </div>
        )}
      </div>
    </Card>
  )
}