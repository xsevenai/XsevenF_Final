// app/dashboard/table-components/TableLayoutManager.tsx

"use client"

import { useState, useEffect } from "react"
import { LayoutGrid, Edit3, Save, X, Plus, Trash2, MapPin, Users, Home, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useTheme } from "@/hooks/useTheme"
import { useTables } from "@/hooks/use-tables"
import { tablesApi } from "@/lib/tables-api"

interface TableLayoutManagerProps {
  onLayoutUpdate?: () => void
  autoExpanded?: boolean
}

interface SelectedTable {
  id: string
  table_number: number
  capacity: number
  section: string
  location_notes?: string
  newSection?: string
  newCapacity?: number
  newLocationNotes?: string
  isModified?: boolean
}

export default function TableLayoutManager({ onLayoutUpdate, autoExpanded = false }: TableLayoutManagerProps) {
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { tables, refresh } = useTables()
  const [isOpen, setIsOpen] = useState(autoExpanded)
  const [selectedTables, setSelectedTables] = useState<SelectedTable[]>([])
  const [updating, setUpdating] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

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
  const tableCardBg = isDark ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const tableCardHover = isDark ? 'hover:bg-[#252525] hover:border-purple-500/30' : 'hover:bg-gray-100 hover:border-purple-400/50'
  const modifiedCardBg = isDark ? 'bg-purple-500/10 border-purple-500/30' : 'bg-purple-50 border-purple-200'
  const modifiedIconBg = isDark ? 'bg-purple-500/20' : 'bg-purple-100'

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

  // Add table to selection
  const addTableToSelection = (table: any) => {
    const exists = selectedTables.find(t => t.id === table.id)
    if (exists) return

    const newTable: SelectedTable = {
      id: table.id,
      table_number: table.number,
      capacity: table.seats,
      section: table.location,
      location_notes: table.location_notes || '',
      newSection: table.location,
      newCapacity: table.seats,
      newLocationNotes: table.location_notes || '',
      isModified: false
    }

    setSelectedTables(prev => [...prev, newTable])
  }

  // Remove table from selection
  const removeTableFromSelection = (tableId: string) => {
    setSelectedTables(prev => prev.filter(t => t.id !== tableId))
  }

  // Update table properties
  const updateTableProperty = (tableId: string, field: string, value: any) => {
    setSelectedTables(prev => 
      prev.map(table => {
        if (table.id !== tableId) return table

        const updated = { ...table, [field]: value }
        
        // Check if table is modified
        const isModified = 
          updated.newSection !== updated.section ||
          updated.newCapacity !== updated.capacity ||
          updated.newLocationNotes !== updated.location_notes

        return { ...updated, isModified }
      })
    )
  }

  // Apply layout changes
  const applyLayoutChanges = async () => {
    const modifiedTables = selectedTables.filter(t => t.isModified)
    
    if (modifiedTables.length === 0) {
      setError('No changes to apply')
      return
    }

    try {
      setUpdating(true)
      setError(null)

      const layoutData = {
        tables: modifiedTables.map(table => ({
          id: table.id,
          section: table.newSection,
          capacity: table.newCapacity,
          location_notes: table.newLocationNotes
        }))
      }

      const result = await tablesApi.updateTableLayout(layoutData)
      setSuccess(result.message)
      
      // Refresh tables data
      await refresh()
      onLayoutUpdate?.()
      
      // Clear selection
      setSelectedTables([])
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update layout')
    } finally {
      setUpdating(false)
    }
  }

  // Clear all selections
  const clearSelections = () => {
    setSelectedTables([])
    setError(null)
  }

  // Get available tables for selection
  const availableTables = tables.filter(table => 
    !selectedTables.find(selected => selected.id === table.id)
  )

  const modifiedCount = selectedTables.filter(t => t.isModified).length

  // When auto-expanded, always show the full interface
  if (autoExpanded || isOpen) {
    return (
      <Card className={`${cardBg} border shadow-lg p-6 transition-colors duration-300`}
        style={{ borderRadius: '1.5rem' }}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <LayoutGrid className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${textPrimary}`}>Table Layout Manager</h3>
                <p className={`${textSecondary} text-sm`}>
                  {selectedTables.length > 0 
                    ? `${selectedTables.length} tables selected ${modifiedCount > 0 ? `(${modifiedCount} modified)` : ''}`
                    : 'Select tables to modify their layout'
                  }
                </p>
              </div>
            </div>
            {!autoExpanded && (
              <button
                onClick={() => setIsOpen(false)}
                className={`p-2 ${hoverBg} transition-colors`}
                style={{ borderRadius: '0.5rem' }}
              >
                <X className={`h-5 w-5 ${textSecondary}`} />
              </button>
            )}
          </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20"
            style={{ borderRadius: '0.5rem' }}>
            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
            <p className="text-green-400 text-sm">{success}</p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20"
            style={{ borderRadius: '0.5rem' }}>
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Table Selection */}
        {availableTables.length > 0 && (
          <div>
            <h4 className={`${textPrimary} font-medium mb-3`}>Available Tables</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-40 overflow-y-auto">
              {availableTables.map(table => (
                <button
                  key={table.id}
                  onClick={() => addTableToSelection(table)}
                  className={`p-3 ${tableCardBg} ${tableCardHover} border transition-all text-left`}
                  style={{ borderRadius: '0.5rem' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 flex items-center justify-center"
                      style={{ borderRadius: '0.5rem' }}>
                      <Users className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <div className={`${textPrimary} font-medium text-sm`}>Table {table.number}</div>
                      <div className={`${textSecondary} text-xs`}>{table.seats} seats • {table.location}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Tables for Editing */}
        {selectedTables.length > 0 && (
          <div>
            <h4 className={`${textPrimary} font-medium mb-3`}>Selected Tables</h4>
            <div className="space-y-4">
              {selectedTables.map(table => (
                <div 
                  key={table.id} 
                  className={`p-4 border transition-all ${
                    table.isModified 
                      ? modifiedCardBg
                      : `${tableCardBg} border`
                  }`}
                  style={{ borderRadius: '0.5rem' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 flex items-center justify-center ${
                        table.isModified ? modifiedIconBg : iconBg
                      }`}
                        style={{ borderRadius: '0.5rem' }}>
                        {table.isModified ? (
                          <Edit3 className="h-4 w-4 text-purple-400" />
                        ) : (
                          <Users className={`h-4 w-4 ${textSecondary}`} />
                        )}
                      </div>
                      <div>
                        <div className={`${textPrimary} font-medium`}>Table {table.table_number}</div>
                        <div className={`${textSecondary} text-xs`}>
                          Original: {table.capacity} seats • {table.section}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeTableFromSelection(table.id)}
                      className="p-1 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                      style={{ borderRadius: '0.25rem' }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Section */}
                    <div>
                      <label className={`block text-xs ${textSecondary} mb-1`}>
                        <Home className="h-3 w-3 inline mr-1" />
                        Section
                      </label>
                      <select
                        value={table.newSection}
                        onChange={(e) => updateTableProperty(table.id, 'newSection', e.target.value)}
                        className={`w-full px-2 py-1 ${inputBg} border ${textPrimary} text-sm focus:ring-2 focus:ring-purple-500/50`}
                        style={{ borderRadius: '0.25rem' }}
                      >
                        {sections.map(section => (
                          <option key={section} value={section}>{section}</option>
                        ))}
                      </select>
                    </div>

                    {/* Capacity */}
                    <div>
                      <label className={`block text-xs ${textSecondary} mb-1`}>
                        <Users className="h-3 w-3 inline mr-1" />
                        Capacity
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={table.newCapacity}
                        onChange={(e) => updateTableProperty(table.id, 'newCapacity', parseInt(e.target.value) || table.capacity)}
                        className={`w-full px-2 py-1 ${inputBg} border ${textPrimary} text-sm focus:ring-2 focus:ring-purple-500/50`}
                        style={{ borderRadius: '0.25rem' }}
                      />
                    </div>

                    {/* Location Notes */}
                    <div>
                      <label className={`block text-xs ${textSecondary} mb-1`}>
                        <MapPin className="h-3 w-3 inline mr-1" />
                        Location Notes
                      </label>
                      <input
                        type="text"
                        value={table.newLocationNotes}
                        onChange={(e) => updateTableProperty(table.id, 'newLocationNotes', e.target.value)}
                        className={`w-full px-2 py-1 ${inputBg} border ${textPrimary} text-sm focus:ring-2 focus:ring-purple-500/50`}
                        style={{ borderRadius: '0.25rem' }}
                        placeholder="e.g., Near window"
                        maxLength={200}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={clearSelections}
                disabled={updating}
                className={`px-4 py-2 ${innerCardBg} ${hoverBg} ${textSecondary} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                style={{ borderRadius: '0.5rem' }}
              >
                Clear All
              </button>
              <button
                onClick={applyLayoutChanges}
                disabled={updating || modifiedCount === 0}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-50 text-white transition-colors"
                style={{ borderRadius: '0.5rem' }}
              >
                {updating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Apply Changes {modifiedCount > 0 && `(${modifiedCount})`}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {selectedTables.length === 0 && availableTables.length === 0 && (
          <div className="text-center py-8">
            <LayoutGrid className={`h-12 w-12 ${textSecondary} mx-auto mb-3`} />
            <p className={`${textSecondary}`}>All tables are selected for editing</p>
            <p className={`${textTertiary} text-sm`}>Clear selections to add more tables</p>
          </div>
        )}
      </div>
    </Card>
  )
}
}