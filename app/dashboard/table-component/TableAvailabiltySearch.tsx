// app/dashboard/table-components/TableAvailabilitySearch.tsx

"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Users, TrendingUp, Loader2, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { tablesApi } from "@/lib/tables-api"

interface TableAvailabilitySearchProps {
  onAvailabilityCheck?: (data: any) => void
  autoExpanded?: boolean
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

export default function TableAvailabilitySearch({ onAvailabilityCheck, autoExpanded = false }: TableAvailabilitySearchProps) {
  const [filters, setFilters] = useState({
    section: '',
    capacity: ''
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
      
      const filterParams: any = {}
      if (filters.section) filterParams.section = filters.section
      if (filters.capacity) filterParams.capacity = parseInt(filters.capacity)
      
      const data = await tablesApi.checkTableAvailability(filterParams)
      setAvailability(data)
      onAvailabilityCheck?.(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check availability')
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setFilters({ section: '', capacity: '' })
    setAvailability(null)
  }

  // Auto-check availability when component mounts
  useEffect(() => {
    checkAvailability()
  }, [])

  return (
    <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Table Availability</h3>
              <p className="text-gray-400 text-sm">Check current table status and availability</p>
            </div>
          </div>
          {!autoExpanded && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-1 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg text-sm transition-colors"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
          )}
        </div>

        {/* Quick Stats */}
        {availability && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-gray-700/30 rounded-lg">
              <div className="text-xl font-bold text-green-400">{availability.available_count}</div>
              <div className="text-xs text-gray-400">Available</div>
            </div>
            <div className="text-center p-3 bg-gray-700/30 rounded-lg">
              <div className="text-xl font-bold text-red-400">{availability.occupied_count}</div>
              <div className="text-xs text-gray-400">Occupied</div>
            </div>
            <div className="text-center p-3 bg-gray-700/30 rounded-lg">
              <div className="text-xl font-bold text-blue-400">{availability.reserved_count}</div>
              <div className="text-xs text-gray-400">Reserved</div>
            </div>
            <div className="text-center p-3 bg-gray-700/30 rounded-lg">
              <div className="text-xl font-bold text-yellow-400">{availability.maintenance_count}</div>
              <div className="text-xs text-gray-400">Maintenance</div>
            </div>
          </div>
        )}

        {/* Expanded Search Filters */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-gray-700/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Section Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  Section
                </label>
                <select
                  value={filters.section}
                  onChange={(e) => setFilters(prev => ({ ...prev, section: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors"
                >
                  <option value="">All Sections</option>
                  {sections.map(section => (
                    <option key={section} value={section}>{section}</option>
                  ))}
                </select>
              </div>

              {/* Capacity Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Users className="h-4 w-4 inline mr-2" />
                  Minimum Capacity
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={filters.capacity}
                  onChange={(e) => setFilters(prev => ({ ...prev, capacity: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors"
                  placeholder="Any capacity"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-end gap-2">
                <button
                  onClick={checkAvailability}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white rounded-lg transition-colors"
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
                  className="px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-colors text-sm"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Available Tables List */}
            {availability && availability.available_tables.length > 0 && (
              <div>
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Available Tables ({availability.available_tables.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                  {availability.available_tables.map(table => (
                    <div key={table.id} className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <Users className="h-4 w-4 text-green-400" />
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">Table {table.table_number}</div>
                          <div className="text-gray-400 text-xs">{table.capacity} seats • {table.section}</div>
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
                <Clock className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400">No available tables match your criteria</p>
                <p className="text-gray-500 text-sm">Try adjusting your filters or check back later</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}