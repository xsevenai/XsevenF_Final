// app/dashboard/table-components/CustomerAssignment.tsx

"use client"

import { useState } from "react"
import { X, Users, Phone, Mail, User, MessageSquare, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { tablesApi, CustomerAssignmentData } from "@/lib/tables-api"

interface CustomerAssignmentProps {
  tableId: string
  tableNumber: number
  tableCapacity: number
  isOpen: boolean
  onClose: () => void
  onSuccess?: (orderId: string) => void
}

interface FormData {
  customer_name: string
  customer_phone: string
  customer_email: string
  party_size: number
  special_requests: string
}

const initialFormData: FormData = {
  customer_name: "",
  customer_phone: "",
  customer_email: "",
  party_size: 1,
  special_requests: ""
}

export default function CustomerAssignment({
  tableId,
  tableNumber,
  tableCapacity,
  isOpen,
  onClose,
  onSuccess
}: CustomerAssignmentProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  // Handle form field changes
  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
    
    // Clear general error
    if (error) setError(null)
  }

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    // Validate party size
    if (!formData.party_size || formData.party_size < 1) {
      newErrors.party_size = formData.party_size
    } else if (formData.party_size > tableCapacity) {
      newErrors.party_size = formData.party_size
    }

    // Validate that at least name or phone is provided
    if (!formData.customer_name.trim() && !formData.customer_phone.trim()) {
      newErrors.customer_name = ""
      newErrors.customer_phone = ""
    }

    // Validate phone format if provided
    if (formData.customer_phone.trim()) {
      const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/
      if (!phoneRegex.test(formData.customer_phone.trim())) {
        newErrors.customer_phone = formData.customer_phone
      }
    }

    // Validate email format if provided
    if (formData.customer_email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.customer_email.trim())) {
        newErrors.customer_email = formData.customer_email
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Get error message for field
  const getErrorMessage = (field: keyof FormData): string => {
    if (!errors[field] && errors[field] !== 0 && errors[field] !== "") return ""

    switch (field) {
      case "party_size":
        if (!formData.party_size || formData.party_size < 1) {
          return "Party size must be at least 1"
        }
        if (formData.party_size > tableCapacity) {
          return `Party size cannot exceed table capacity (${tableCapacity})`
        }
        return ""
      case "customer_name":
        if (!formData.customer_name.trim() && !formData.customer_phone.trim()) {
          return "Either customer name or phone number is required"
        }
        return ""
      case "customer_phone":
        if (!formData.customer_name.trim() && !formData.customer_phone.trim()) {
          return "Either customer name or phone number is required"
        }
        if (formData.customer_phone.trim()) {
          return "Please enter a valid phone number"
        }
        return ""
      case "customer_email":
        return "Please enter a valid email address"
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
      setError(null)
      
      // Prepare assignment data
      const assignmentData: CustomerAssignmentData = {
        party_size: formData.party_size,
        special_requests: formData.special_requests.trim() || undefined
      }

      // Add customer info only if provided
      if (formData.customer_name.trim()) {
        assignmentData.customer_name = formData.customer_name.trim()
      }
      if (formData.customer_phone.trim()) {
        assignmentData.customer_phone = formData.customer_phone.trim()
      }
      if (formData.customer_email.trim()) {
        assignmentData.customer_email = formData.customer_email.trim()
      }

      const response = await tablesApi.assignCustomerToTable(tableId, assignmentData)
      
      setSuccess(response.message)
      onSuccess?.(response.order_id)
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose()
        resetForm()
      }, 2000)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign customer to table')
    } finally {
      setLoading(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData(initialFormData)
    setErrors({})
    setError(null)
    setSuccess(null)
  }

  // Handle modal close
  const handleClose = () => {
    if (loading) return // Prevent closing while submitting
    onClose()
    resetForm()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Assign Table {tableNumber}</h2>
              <p className="text-gray-400 text-sm">Capacity: {tableCapacity} guests</p>
            </div>
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
          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
              <p className="text-green-400">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Party Size */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Users className="h-4 w-4 inline mr-2" />
              Party Size *
            </label>
            <input
              type="number"
              min="1"
              max={tableCapacity}
              value={formData.party_size}
              onChange={(e) => handleChange("party_size", parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 transition-colors ${
                errors.party_size !== undefined ? "border-red-500/50" : "border-gray-600/50"
              }`}
              placeholder="Number of guests"
              disabled={loading}
              required
            />
            {errors.party_size !== undefined && (
              <p className="text-red-400 text-sm mt-1">{getErrorMessage("party_size")}</p>
            )}
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <User className="h-4 w-4 inline mr-2" />
              Customer Name
            </label>
            <input
              type="text"
              value={formData.customer_name}
              onChange={(e) => handleChange("customer_name", e.target.value)}
              className={`w-full px-3 py-2 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 transition-colors ${
                errors.customer_name !== undefined ? "border-red-500/50" : "border-gray-600/50"
              }`}
              placeholder="Enter customer name"
              disabled={loading}
              maxLength={100}
            />
            {errors.customer_name !== undefined && (
              <p className="text-red-400 text-sm mt-1">{getErrorMessage("customer_name")}</p>
            )}
          </div>

          {/* Customer Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Phone className="h-4 w-4 inline mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.customer_phone}
              onChange={(e) => handleChange("customer_phone", e.target.value)}
              className={`w-full px-3 py-2 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 transition-colors ${
                errors.customer_phone !== undefined ? "border-red-500/50" : "border-gray-600/50"
              }`}
              placeholder="Enter phone number"
              disabled={loading}
              maxLength={20}
            />
            {errors.customer_phone !== undefined && (
              <p className="text-red-400 text-sm mt-1">{getErrorMessage("customer_phone")}</p>
            )}
          </div>

          {/* Customer Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Mail className="h-4 w-4 inline mr-2" />
              Email Address <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="email"
              value={formData.customer_email}
              onChange={(e) => handleChange("customer_email", e.target.value)}
              className={`w-full px-3 py-2 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 transition-colors ${
                errors.customer_email !== undefined ? "border-red-500/50" : "border-gray-600/50"
              }`}
              placeholder="Enter email address"
              disabled={loading}
              maxLength={100}
            />
            {errors.customer_email !== undefined && (
              <p className="text-red-400 text-sm mt-1">{getErrorMessage("customer_email")}</p>
            )}
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Special Requests <span className="text-gray-500">(Optional)</span>
            </label>
            <textarea
              value={formData.special_requests}
              onChange={(e) => handleChange("special_requests", e.target.value)}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 transition-colors resize-none"
              placeholder="Any special requests or notes..."
              disabled={loading}
              rows={3}
              maxLength={500}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {formData.special_requests.length}/500
            </div>
          </div>

          {/* Info Note */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <p className="text-blue-400 text-sm">
              <strong>Note:</strong> Either customer name or phone number must be provided. 
              An initial order will be created and the table status will be updated to "occupied".
            </p>
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
              disabled={loading || !!success}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Assigned!
                </>
              ) : (
                <>
                  <Users className="h-4 w-4" />
                  Assign Table
                </>
              )}
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}