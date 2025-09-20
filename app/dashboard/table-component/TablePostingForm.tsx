// app/dashboard/table-components/TablePostingForm.tsx

"use client"

import { useState } from "react"
import { X, Plus, Loader2, MapPin, Users, Hash, Home } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useTables } from "@/hooks/use-tables"

interface TablePostingFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
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

export default function TablePostingForm({ isOpen, onClose, onSuccess }: TablePostingFormProps) {
  const { addTable, tables } = useTables()
  const [formData, setFormData] = useState<TableFormData>(initialFormData)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<TableFormData>>({})

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
    const maxNumber = Math.max(...tables.map(table => table.number || 0))
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
    } else if (tables.some(table => table.number === formData.table_number)) {
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
      
      // Transform data to match what the hook expects (which will then transform to backend format)
      const tableData = {
        number: formData.table_number,
        seats: formData.capacity,
        location: formData.section,
        status: "available" as const,
        location_notes: formData.location_notes.trim() || "" // Always return string, never undefined
      }

      console.log('Form data being sent:', tableData) // Debug log

      await addTable(tableData)
      
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div>
            <h2 className="text-xl font-bold text-white">Add New Table</h2>
            <p className="text-gray-400 text-sm">Create a new table for your restaurant</p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Table Number */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Hash className="h-4 w-4 inline mr-2" />
              Table Number
            </label>
            <input
              type="number"
              min="1"
              max="999"
              value={formData.table_number}
              onChange={(e) => handleChange("table_number", parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 transition-colors ${
                errors.table_number ? "border-red-500/50" : "border-gray-600/50"
              }`}
              placeholder="Enter table number"
              disabled={loading}
            />
            {errors.table_number !== undefined && (
              <p className="text-red-400 text-sm mt-1">{getErrorMessage("table_number")}</p>
            )}
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Users className="h-4 w-4 inline mr-2" />
              Capacity (Number of Seats)
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={formData.capacity}
              onChange={(e) => handleChange("capacity", parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 transition-colors ${
                errors.capacity ? "border-red-500/50" : "border-gray-600/50"
              }`}
              placeholder="Enter seating capacity"
              disabled={loading}
            />
            {errors.capacity !== undefined && (
              <p className="text-red-400 text-sm mt-1">{getErrorMessage("capacity")}</p>
            )}
          </div>

          {/* Section */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Home className="h-4 w-4 inline mr-2" />
              Section
            </label>
            <div className="space-y-2">
              <select
                value={formData.section}
                onChange={(e) => handleChange("section", e.target.value)}
                className={`w-full px-3 py-2 bg-gray-700/50 border rounded-lg text-white focus:ring-2 focus:ring-purple-500/50 transition-colors ${
                  errors.section ? "border-red-500/50" : "border-gray-600/50"
                }`}
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
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 transition-colors"
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
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <MapPin className="h-4 w-4 inline mr-2" />
              Location Notes <span className="text-gray-500">(Optional)</span>
            </label>
            <textarea
              value={formData.location_notes}
              onChange={(e) => handleChange("location_notes", e.target.value)}
              className={`w-full px-3 py-2 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 transition-colors resize-none ${
                errors.location_notes ? "border-red-500/50" : "border-gray-600/50"
              }`}
              placeholder="e.g., Near window, Corner table, Next to kitchen"
              disabled={loading}
              rows={3}
              maxLength={200}
            />
            {errors.location_notes !== undefined && (
              <p className="text-red-400 text-sm mt-1">{getErrorMessage("location_notes")}</p>
            )}
            <div className="text-right text-xs text-gray-500 mt-1">
              {formData.location_notes.length}/200
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Preview</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-white font-medium">
                  Table {formData.table_number || "?"}
                </p>
                <p className="text-gray-400 text-sm">
                  {formData.capacity || "?"} seats • {formData.section || "No section"}
                </p>
                {formData.location_notes && (
                  <p className="text-gray-500 text-xs mt-1">
                    {formData.location_notes}
                  </p>
                )}
                <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 mt-1">
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
              className="flex-1 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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