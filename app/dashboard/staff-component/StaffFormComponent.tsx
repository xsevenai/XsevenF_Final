// app/dashboard/staff-component/StaffFormComponent.tsx

"use client"

import { ArrowLeft, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useStaffMembers } from '@/hooks/use-operations'
import { useTheme } from '@/hooks/useTheme'
import type { StaffMember } from '@/src/api/generated/models/StaffMember'
import type { StaffMemberCreate } from '@/src/api/generated/models/StaffMemberCreate'
import type { StaffMemberUpdate } from '@/src/api/generated/models/StaffMemberUpdate'

interface StaffFormComponentProps {
  formType: 'add-staff-member' | 'edit-staff-member'
  onBack: () => void
  onStaffMemberCreated?: () => void
  onStaffMemberUpdated?: () => void
  editStaff?: StaffMember
  businessId: string
}

export default function StaffFormComponent({ 
  formType, 
  onBack, 
  onStaffMemberCreated,
  onStaffMemberUpdated,
  editStaff,
  businessId
}: StaffFormComponentProps) {
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()
  const { createStaffMember, updateStaffMember } = useStaffMembers(businessId)
  
  // Form state
  const [formData, setFormData] = useState<StaffMemberCreate>({
    business_id: businessId,
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    position: '',
    hourly_rate: 0,
    hire_date: '',
    status: 'active'
  })

  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Simulate loading state like MenuForms
  const [localLoading, setLocalLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (themeLoaded && mounted) {
      setLocalLoading(false)
    }
  }, [themeLoaded, mounted])

  // Initialize form with edit data
  useEffect(() => {
    if (formType === 'edit-staff-member' && editStaff) {
      setFormData({
        business_id: businessId,
        first_name: editStaff.first_name || '',
        last_name: editStaff.last_name || '',
        email: editStaff.email || '',
        phone: editStaff.phone || '',
        position: editStaff.position || '',
        hourly_rate: editStaff.hourly_rate ? parseFloat(editStaff.hourly_rate) : 0,
        hire_date: editStaff.hire_date || '',
        status: editStaff.status || 'active'
      })
    }
  }, [formType, editStaff, businessId])

  if (localLoading) {
    return (
      <div className={`flex-1 flex items-center justify-center min-h-screen ${isDark ? "bg-[#111]" : "bg-gray-50"}`}>
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  // Theme-based styling variables - matching MenuForms
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const inputBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'

  // Button styles matching MenuForms
  const primaryButtonBg = isDark
    ? 'bg-white text-gray-900 hover:bg-gray-100 border-gray-300'
    : 'bg-gray-900 text-white hover:bg-gray-800 border-gray-700'

  const secondaryButtonBg = isDark
    ? 'bg-[#1f1f1f] text-gray-400 border-[#2a2a2a] hover:bg-[#2a2a2a]'
    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      // Validate required fields
      if (!formData.first_name.trim()) {
        throw new Error('First name is required')
      }
      if (!formData.last_name.trim()) {
        throw new Error('Last name is required')
      }
      if (!String(formData.email || '').trim()) {
        throw new Error('Email is required')
      }
      if (!String(formData.position || '').trim()) {
        throw new Error('Position is required')
      }

      if (formType === 'edit-staff-member' && editStaff) {
        // Update existing staff member
        const updateData: StaffMemberUpdate = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          position: formData.position,
          hourly_rate: formData.hourly_rate?.toString(),
          hire_date: formData.hire_date,
          status: formData.status
        }
        
        await updateStaffMember(editStaff.id, updateData)
        setSubmitSuccess(true)
        
        if (onStaffMemberUpdated) {
          onStaffMemberUpdated()
        }
      } else {
        // Create new staff member
        await createStaffMember(formData)
        setSubmitSuccess(true)
        
        // Reset form for new staff member
        setFormData({
          business_id: businessId,
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          position: '',
          hourly_rate: 0,
          hire_date: '',
          status: 'active'
        })
        
        if (onStaffMemberCreated) {
          onStaffMemberCreated()
        }
      }
      
      setTimeout(() => {
        onBack()
      }, 1500)
      
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : `Failed to ${formType === 'edit-staff-member' ? 'update' : 'create'} staff member`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Ensure hire_date year never exceeds 4 digits and keep format YYYY-MM-DD
  const handleHireDateChange = (raw: string) => {
    // Keep only digits and dashes, hard limit to 10 chars (YYYY-MM-DD)
    const cleaned = raw.replace(/[^0-9-]/g, '').slice(0, 10)
    const parts = cleaned.split('-')
    if (parts[0]) parts[0] = parts[0].slice(0, 4)
    const sanitized = parts.join('-').slice(0, 10)
    setFormData(prev => ({ ...prev, hire_date: sanitized }))
  }

  return (
    <div className={`flex-1 min-h-screen overflow-y-auto transition-colors duration-300 ${isDark ? "bg-[#111]" : "bg-gray-50"}`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <div className="p-6 space-y-6">
        {/* Header - matching MenuForms style */}
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
                {formType === 'edit-staff-member' ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h1>
              <p className={`${textSecondary} transition-colors duration-300`}>
                {formType === 'edit-staff-member' ? 'Update staff member details' : 'Add a new staff member to your team'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className={`${cardBg} border shadow-lg transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-8">
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <p className="text-green-500 font-medium">
                  Staff member {formType === 'edit-staff-member' ? 'updated' : 'created'} successfully!
                </p>
              </div>
            )}
            
            {submitError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-500 font-medium">{submitError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block ${textPrimary} font-medium mb-3 transition-colors duration-300`}>
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
                    placeholder="Enter first name"
                    required
                  />
                </div>

                <div>
                  <label className={`block ${textPrimary} font-medium mb-3 transition-colors duration-300`}>
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
                    placeholder="Enter last name"
                    required
                  />
                </div>

                <div>
                  <label className={`block ${textPrimary} font-medium mb-3 transition-colors duration-300`}>
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div>
                  <label className={`block ${textPrimary} font-medium mb-3 transition-colors duration-300`}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className={`block ${textPrimary} font-medium mb-3 transition-colors duration-300`}>
                    Position <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.position || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
                    placeholder="Enter position (e.g., Server, Chef, Manager)"
                    required
                  />
                </div>

                <div>
                  <label className={`block ${textPrimary} font-medium mb-3 transition-colors duration-300`}>
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.hourly_rate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: parseFloat(e.target.value) || 0 }))}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className={`block ${textPrimary} font-medium mb-3 transition-colors duration-300`}>
                    Hire Date
                  </label>
                  <input
                    type="date"
                    value={formData.hire_date || ''}
                    onChange={(e) => handleHireDateChange(e.target.value)}
                    inputMode="numeric"
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
                  />
                </div>

                <div>
                  <label className={`block ${textPrimary} font-medium mb-3 transition-colors duration-300`}>
                    Status
                  </label>
                  <select
                    value={String(formData.status ?? 'active')}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${primaryButtonBg} px-8 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border shadow-lg hover:shadow-xl hover:scale-105`}
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSubmitting ? (formType === 'edit-staff-member' ? 'Updating...' : 'Adding...') : (formType === 'edit-staff-member' ? 'Update Staff Member' : 'Add Staff Member')}
                </button>
                <button
                  type="button"
                  onClick={onBack}
                  disabled={isSubmitting}
                  className={`${secondaryButtonBg} px-8 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl hover:scale-105`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
