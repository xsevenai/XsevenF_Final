// app/dashboard/staff-component/ScheduleFormComponent.tsx

"use client"

import { ArrowLeft, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useStaffSchedules, useStaffMembers } from '@/hooks/use-operations'
import { useTheme } from '@/hooks/useTheme'
import type { StaffSchedule } from '@/src/api/generated/models/StaffSchedule'
import type { StaffScheduleCreate } from '@/src/api/generated/models/StaffScheduleCreate'
import type { StaffScheduleUpdate } from '@/src/api/generated/models/StaffScheduleUpdate'

interface ScheduleFormComponentProps {
  formType: 'add-schedule' | 'edit-schedule'
  onBack: () => void
  onScheduleCreated?: () => void
  onScheduleUpdated?: () => void
  editSchedule?: StaffSchedule
  businessId: string
}

export default function ScheduleFormComponent({ 
  formType, 
  onBack, 
  onScheduleCreated,
  onScheduleUpdated,
  editSchedule,
  businessId
}: ScheduleFormComponentProps) {
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()
  const { createSchedule, updateSchedule } = useStaffSchedules(businessId)
  const { staffMembers } = useStaffMembers(businessId)
  
  // Form state
  const [formData, setFormData] = useState<StaffScheduleCreate>({
    business_id: businessId,
    staff_id: '',
    shift_date: '',
    shift_start: '',
    shift_end: '',
    notes: '',
    status: 'scheduled'
  })

  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Simulate loading state like StaffFormComponent
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
    if (formType === 'edit-schedule' && editSchedule) {
      setFormData({
        business_id: businessId,
        staff_id: editSchedule.staff_id || '',
        shift_date: editSchedule.shift_date || '',
        shift_start: editSchedule.shift_start || '',
        shift_end: editSchedule.shift_end || '',
        notes: editSchedule.notes || '',
        status: editSchedule.status || 'scheduled'
      })
    }
  }, [formType, editSchedule, businessId])

  if (localLoading) {
    return (
      <div className={`flex-1 flex items-center justify-center min-h-screen ${isDark ? "bg-[#111]" : "bg-gray-50"}`}>
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  // Theme-based styling variables - matching StaffFormComponent
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const inputBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'

  // Button styles matching StaffFormComponent
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
      if (!formData.staff_id.trim()) {
        throw new Error('Staff member is required')
      }
      if (!formData.shift_date.trim()) {
        throw new Error('Shift date is required')
      }
      if (!formData.shift_start.trim()) {
        throw new Error('Start time is required')
      }
      if (!formData.shift_end.trim()) {
        throw new Error('End time is required')
      }

      if (formType === 'edit-schedule' && editSchedule) {
        // Update existing schedule
        const updateData: StaffScheduleUpdate = {
          staff_id: formData.staff_id,
          shift_date: formData.shift_date,
          shift_start: formData.shift_start,
          shift_end: formData.shift_end,
          notes: formData.notes,
          status: formData.status
        }
        
        await updateSchedule(editSchedule.id, updateData)
        setSubmitSuccess(true)
        
        if (onScheduleUpdated) {
          onScheduleUpdated()
        }
      } else {
        // Create new schedule
        await createSchedule(formData)
        setSubmitSuccess(true)
        
        // Reset form for new schedule
        setFormData({
          business_id: businessId,
          staff_id: '',
          shift_date: '',
          shift_start: '',
          shift_end: '',
          notes: '',
          status: 'scheduled'
        })
        
        if (onScheduleCreated) {
          onScheduleCreated()
        }
      }
      
      setTimeout(() => {
        onBack()
      }, 1500)
      
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : `Failed to ${formType === 'edit-schedule' ? 'update' : 'create'} schedule`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`flex-1 min-h-screen overflow-y-auto transition-colors duration-300 ${isDark ? "bg-[#111]" : "bg-gray-50"}`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <div className="p-6 space-y-6">
        {/* Form Card */}
        <div className={`${cardBg} border shadow-lg transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={onBack}
                className={`${textSecondary} ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-200'} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className={`text-2xl font-bold ${textPrimary}`}>
                {formType === 'edit-schedule' ? 'Edit Schedule' : 'Schedule'}
              </h1>
            </div>
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <p className="text-green-500 font-medium">
                  Schedule {formType === 'edit-schedule' ? 'updated' : 'created'} successfully!
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
                    Staff Member <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.staff_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, staff_id: e.target.value }))}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
                    required
                  >
                    <option value="">Select a staff member</option>
                    {staffMembers.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.first_name} {staff.last_name} - {staff.position}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block ${textPrimary} font-medium mb-3 transition-colors duration-300`}>
                    Shift Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.shift_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, shift_date: e.target.value }))}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
                    required
                  />
                </div>

                <div>
                  <label className={`block ${textPrimary} font-medium mb-3 transition-colors duration-300`}>
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.shift_start}
                    onChange={(e) => setFormData(prev => ({ ...prev, shift_start: e.target.value }))}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
                    required
                  />
                </div>

                <div>
                  <label className={`block ${textPrimary} font-medium mb-3 transition-colors duration-300`}>
                    End Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.shift_end}
                    onChange={(e) => setFormData(prev => ({ ...prev, shift_end: e.target.value }))}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className={`block ${textPrimary} font-medium mb-3 transition-colors duration-300`}>
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200 resize-none transition-colors duration-300`}
                  placeholder="Optional notes about this shift"
                />
              </div>

              <div>
                <label className={`block ${textPrimary} font-medium mb-3 transition-colors duration-300`}>
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${primaryButtonBg} px-8 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border shadow-lg hover:shadow-xl hover:scale-105`}
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSubmitting ? (formType === 'edit-schedule' ? 'Updating...' : 'Adding...') : (formType === 'edit-schedule' ? 'Update Schedule' : 'Add Schedule')}
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
