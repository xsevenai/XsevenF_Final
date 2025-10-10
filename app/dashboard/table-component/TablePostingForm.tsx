// app/dashboard/table-components/TablePostingForm.tsx

"use client"

import { useState, useEffect } from "react"
import { X, Plus, Loader2, MapPin, Users, Hash, Home } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useTheme } from "@/hooks/useTheme"
import type { TableWithDetails } from "@/src/api/generated/models/TableWithDetails"
import type { TableCreate } from "@/src/api/generated/models/TableCreate"

interface TablePostingFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  createTable: (data: TableCreate) => Promise<any>
  tables: TableWithDetails[]
}

interface TableFormData {
  table_number: number
  capacity: number
  section: string
  location_notes: string
}

const initialFormData: TableFormData = {
  table_number: 1,
  capacity: 4,
  section: "",
  location_notes: ""
}

export default function TablePostingForm({ isOpen, onClose, onSuccess, createTable, tables }: TablePostingFormProps) {
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState<TableFormData>(initialFormData)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<TableFormData>>({})

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isOpen || !themeLoaded || !mounted) return null

  // Theme variables matching MainPanel
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const textTertiary = isDark ? 'text-gray-500' : 'text-gray-500'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const inputBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-white border-gray-300'
  const hoverBg = isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'
  const borderColor = isDark ? 'border-gray-700/50' : 'border-gray-200'
  const previewCardBg = isDark ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-gray-100 border-gray-200'
  const buttonPrimary = isDark ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'

  // Common section options for restaurants
  const sectionOptions = [
    "Main Dining",
    "VIP Section",
    "Patio",
    "Bar Area",
    "Private Dining",
    "Window Side",
    "Terrace",
    "Garden",
    "Lounge",
    "Outdoor"
  ]

  // Get next available table number
  const getNextTableNumber = () => {
    if (tables.length === 0) return 1
    const maxNumber = Math.max(...tables.map(table => table.table_number || 0))
    return maxNumber + 1
  }

  // Reset form when opened
  const handleOpen = () => {
    setFormData({
      ...initialFormData,
      table_number: getNextTableNumber()
    })
    setErrors({})
  }

  // Handle form field changes
  const handleChange = (field: keyof TableFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Partial<TableFormData> = {}

    // Validate table number
    if (!formData.table_number || formData.table_number < 1) {
      newErrors.table_number = 1
    } else if (tables.some(table => table.table_number === formData.table_number)) {
      newErrors.table_number = formData.table_number
    }

    // Validate capacity
    if (!formData.capacity || formData.capacity < 1 || formData.capacity > 20) {
      newErrors.capacity = formData.capacity
    }

    // Validate section
    if (!formData.section.trim()) {
      newErrors.section = ""
    } else if (formData.section.trim().length < 2) {
      newErrors.section = formData.section
    }

    // Validate location notes (optional but if provided, must be valid)
    if (formData.location_notes && formData.location_notes.trim().length < 3) {
      newErrors.location_notes = formData.location_notes
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Get error message for field
  const getErrorMessage = (field: keyof TableFormData): string => {
    if (!errors[field] && errors[field] !== 0) return ""

    switch (field) {
      case "table_number":
        if (!formData.table_number || formData.table_number < 1) {
          return "Table number must be greater than 0"
        }
        return "This table number already exists"
      case "capacity":
        if (!formData.capacity || formData.capacity < 1) {
          return "Capacity must be at least 1"
        }
        if (formData.capacity > 20) {
          return "Maximum 20 seats allowed"
        }
        return ""
      case "section":
        if (!formData.section.trim()) {
          return "Section is required"
        }
        return "Section must be at least 2 characters"
      case "location_notes":
        return "Location notes must be at least 3 characters if provided"
      default:
        return ""
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      
      // Transform data to match the TableCreate interface
      const tableData: TableCreate = {
        table_number: formData.table_number.toString(),
        capacity: formData.capacity,
        section: formData.section,
        location_notes: formData.location_notes.trim() || "",
        status: "available"
      }

      console.log('Form data being sent:', tableData) // Debug log

      await createTable(tableData)
      
      // Success
      onSuccess?.()
      onClose()
      
      // Reset form
      setFormData(initialFormData)
      setErrors({})
      
    } catch (error) {
      console.error('Error creating table:', error)
      // Error is handled by the hook, but we can show additional feedback here if needed
    } finally {
      setLoading(false)
    }
  }

  // Handle modal close
  const handleClose = () => {
    if (loading) return // Prevent closing while submitting
    onClose()
    setFormData(initialFormData)
    setErrors({})
  }

  // Initialize form when opened
  if (isOpen && formData.table_number === 1 && tables.length > 0) {
    handleOpen()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className={`${cardBg} border shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto transition-colors duration-300`}
        style={{ borderRadius: '1.5rem' }}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${borderColor}`}>
          <div>
            <h2 className={`text-xl font-bold ${textPrimary}`}>Add New Table</h2>
            <p className={`${textSecondary} text-sm`}>Create a new table for your restaurant</p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className={`p-2 ${hoverBg} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            style={{ borderRadius: '0.5rem' }}
          >
            <X className={`h-5 w-5 ${textSecondary}`} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Table Number */}
          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
              <Hash className="h-4 w-4 inline mr-2" />
              Table Number
            </label>
            <input
              type="number"
              min="1"
              max="999"
              value={formData.table_number}
              onChange={(e) => handleChange("table_number", parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 ${inputBg} border ${textPrimary} placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 transition-colors ${
                errors.table_number ? "border-red-500/50" : ""
              }`}
              style={{ borderRadius: '0.5rem' }}
              placeholder="Enter table number"
              disabled={loading}
            />
            {errors.table_number !== undefined && (
              <p className="text-red-400 text-sm mt-1">{getErrorMessage("table_number")}</p>
            )}
          </div>

          {/* Capacity */}
          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
              <Users className="h-4 w-4 inline mr-2" />
              Capacity (Number of Seats)
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={formData.capacity}
              onChange={(e) => handleChange("capacity", parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 ${inputBg} border ${textPrimary} placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 transition-colors ${
                errors.capacity ? "border-red-500/50" : ""
              }`}
              style={{ borderRadius: '0.5rem' }}
              placeholder="Enter seating capacity"
              disabled={loading}
            />
            {errors.capacity !== undefined && (
              <p className="text-red-400 text-sm mt-1">{getErrorMessage("capacity")}</p>
            )}
          </div>

          {/* Section */}
          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
              <Home className="h-4 w-4 inline mr-2" />
              Section
            </label>
            <div className="space-y-2">
              <select
                value={formData.section}
                onChange={(e) => handleChange("section", e.target.value)}
                className={`w-full px-3 py-2 ${inputBg} border ${textPrimary} focus:ring-2 focus:ring-purple-500/50 transition-colors ${
                  errors.section ? "border-red-500/50" : ""
                }`}
                style={{ borderRadius: '0.5rem' }}
                disabled={loading}
              >
                <option value="">Select a section</option>
                {sectionOptions.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
                <option value="custom">Custom Section</option>
              </select>
              
              {formData.section === "custom" && (
                <input
                  type="text"
                  value={formData.section === "custom" ? "" : formData.section}
                  onChange={(e) => handleChange("section", e.target.value)}
                  className={`w-full px-3 py-2 ${inputBg} border ${textPrimary} placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 transition-colors`}
                  style={{ borderRadius: '0.5rem' }}
                  placeholder="Enter custom section name"
                  disabled={loading}
                  maxLength={50}
                />
              )}
            </div>
            {errors.section !== undefined && (
              <p className="text-red-400 text-sm mt-1">{getErrorMessage("section")}</p>
            )}
          </div>

          {/* Location Notes */}
          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
              <MapPin className="h-4 w-4 inline mr-2" />
              Location Notes <span className={`${textTertiary}`}>(Optional)</span>
            </label>
            <textarea
              value={formData.location_notes}
              onChange={(e) => handleChange("location_notes", e.target.value)}
              className={`w-full px-3 py-2 ${inputBg} border ${textPrimary} placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 transition-colors resize-none ${
                errors.location_notes ? "border-red-500/50" : ""
              }`}
              style={{ borderRadius: '0.5rem' }}
              placeholder="e.g., Near window, Corner table, Next to kitchen"
              disabled={loading}
              rows={3}
              maxLength={200}
            />
            {errors.location_notes !== undefined && (
              <p className="text-red-400 text-sm mt-1">{getErrorMessage("location_notes")}</p>
            )}
            <div className={`text-right text-xs ${textTertiary} mt-1`}>
              {formData.location_notes.length}/200
            </div>
          </div>

          {/* Preview */}
          <div className={`${previewCardBg} border p-4`}
            style={{ borderRadius: '0.5rem' }}>
            <h3 className={`text-sm font-medium ${textPrimary} mb-3`}>Preview</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 text-green-400 flex items-center justify-center"
                style={{ borderRadius: '0.5rem' }}>
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className={`${textPrimary} font-medium`}>
                  Table {formData.table_number || "?"}
                </p>
                <p className={`${textSecondary} text-sm`}>
                  {formData.capacity || "?"} seats • {formData.section || "No section"}
                </p>
                {formData.location_notes && (
                  <p className={`${textTertiary} text-xs mt-1`}>
                    {formData.location_notes}
                  </p>
                )}
                <span className="inline-block px-2 py-1 text-xs bg-green-500/20 text-green-400 mt-1"
                  style={{ borderRadius: '9999px' }}>
                  Available
                </span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className={`flex-1 px-4 py-2 ${innerCardBg} ${hoverBg} ${textSecondary} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              style={{ borderRadius: '0.5rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 ${buttonPrimary} transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              style={{ borderRadius: '0.5rem' }}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Table
                </>
              )}
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}