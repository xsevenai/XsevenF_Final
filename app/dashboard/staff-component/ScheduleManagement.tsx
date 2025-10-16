"use client"

import { useState, useEffect } from 'react'
import { useStaffSchedules, useStaffMembers } from '@/hooks/use-operations'
import { useTheme } from '@/hooks/useTheme'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Loader2,
  Clock,
  User,
  CalendarDays,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import type { StaffSchedule } from '@/src/api/generated/models/StaffSchedule'
import type { StaffScheduleCreate } from '@/src/api/generated/models/StaffScheduleCreate'
import type { StaffScheduleUpdate } from '@/src/api/generated/models/StaffScheduleUpdate'

interface ScheduleManagementProps {
  businessId: string
}

export default function ScheduleManagement({ businessId }: ScheduleManagementProps) {
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()
  const { 
    schedules, 
    loading, 
    error, 
    refresh, 
    createSchedule, 
    updateSchedule,
    deleteSchedule
  } = useStaffSchedules(businessId)
  
  const { staffMembers } = useStaffMembers(businessId)

  const [mounted, setMounted] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<StaffSchedule | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [staffFilter, setStaffFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('')

  // Form state
  const [formData, setFormData] = useState<StaffScheduleCreate>({
    staff_id: '',
    location_id: null,
    shift_date: '',
    shift_start: '',
    shift_end: '',
    break_duration: null,
    position: null,
    notes: null,
    status: 'scheduled',
    business_id: businessId
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCreateSchedule = async () => {
    try {
      console.log('🔄 Creating schedule with data:', formData)
      await createSchedule(formData)
      setShowCreateForm(false)
      resetForm()
      await refresh() // Refresh the list
    } catch (error) {
      console.error('Failed to create schedule:', error)
    }
  }

  const handleUpdateSchedule = async () => {
    if (!editingSchedule) return
    
    try {
      const updateData: StaffScheduleUpdate = {
        staff_id: formData.staff_id,
        location_id: formData.location_id,
        shift_date: formData.shift_date,
        shift_start: formData.shift_start,
        shift_end: formData.shift_end,
        break_duration: formData.break_duration,
        position: formData.position,
        notes: formData.notes,
        status: formData.status
      }
      
      console.log('🔄 Updating schedule:', editingSchedule.id, updateData)
      await updateSchedule(editingSchedule.id, updateData)
      setEditingSchedule(null)
      setShowCreateForm(false)
      resetForm()
      await refresh() // Refresh the list
    } catch (error) {
      console.error('Failed to update schedule:', error)
    }
  }

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return
    
    try {
      console.log('🔄 Deleting schedule:', scheduleId)
      await deleteSchedule(scheduleId)
      await refresh() // Refresh the list
    } catch (error) {
      console.error('Failed to delete schedule:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      staff_id: '',
      location_id: null,
      shift_date: '',
      shift_start: '',
      shift_end: '',
      break_duration: null,
      position: null,
      notes: null,
      status: 'scheduled',
      business_id: businessId
    })
  }

  const handleEditClick = (schedule: StaffSchedule) => {
    setEditingSchedule(schedule)
    setFormData({
      staff_id: schedule.staff_id || '',
      location_id: schedule.location_id || null,
      shift_date: schedule.shift_date || '',
      shift_start: schedule.shift_start || '',
      shift_end: schedule.shift_end || '',
      break_duration: schedule.break_duration || null,
      position: schedule.position || null,
      notes: schedule.notes || null,
      status: schedule.status || 'scheduled',
      business_id: businessId
    })
    setShowCreateForm(true)
  }

  // Filter schedules
  const filteredSchedules = schedules.filter(schedule => {
    const staff = staffMembers.find(s => s.id === schedule.staff_id)
    const staffName = staff ? `${staff.first_name} ${staff.last_name}` : ''
    
    const matchesSearch = 
      staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (schedule.notes?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    
    const matchesStaff = staffFilter === 'all' || schedule.staff_id === staffFilter
    const matchesDate = !dateFilter || schedule.date === dateFilter
    
    return matchesSearch && matchesStaff && matchesDate
  })

  if (!themeLoaded || !mounted) {
    return (
      <div className={`flex-1 ${isDark ? 'bg-[#111111]' : 'bg-gray-50'} flex items-center justify-center transition-all duration-300`}>
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  const mainPanelBg = isDark ? 'bg-[#111111]' : 'bg-gray-50'
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col flex-1">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className={`${cardBg} p-6 border shadow-lg hover:shadow-xl transition-all duration-300`}
            style={{ borderRadius: '1.5rem' }}>
            <div className="flex items-center justify-between mb-4">
              <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-3 rounded-xl`}>
                <Calendar className={`h-6 w-6 ${textPrimary}`} />
              </div>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <h3 className={`${textSecondary} text-sm font-medium uppercase tracking-wider mb-2`}>Total Schedules</h3>
            <div className={`${textPrimary} text-3xl font-bold`}>
              {loading ? <Loader2 className="h-6 w-6 animate-spin inline" /> : schedules.length}
            </div>
          </div>

          <div className={`${cardBg} p-6 border shadow-lg hover:shadow-xl transition-all duration-300`}
            style={{ borderRadius: '1.5rem' }}>
            <div className="flex items-center justify-between mb-4">
              <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-3 rounded-xl`}>
                <User className={`h-6 w-6 ${textPrimary}`} />
              </div>
              <User className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className={`${textSecondary} text-sm font-medium uppercase tracking-wider mb-2`}>Staff Members</h3>
            <div className={`${textPrimary} text-3xl font-bold`}>
              {loading ? <Loader2 className="h-6 w-6 animate-spin inline" /> : staffMembers.length}
            </div>
          </div>

          <div className={`${cardBg} p-6 border shadow-lg hover:shadow-xl transition-all duration-300`}
            style={{ borderRadius: '1.5rem' }}>
            <div className="flex items-center justify-between mb-4">
              <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-3 rounded-xl`}>
                <Clock className={`h-6 w-6 ${textPrimary}`} />
              </div>
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
            <h3 className={`${textSecondary} text-sm font-medium uppercase tracking-wider mb-2`}>Today's Shifts</h3>
            <div className={`${textPrimary} text-3xl font-bold`}>
              {loading ? <Loader2 className="h-6 w-6 animate-spin inline" /> : 
                schedules.filter(s => s.shift_date === new Date().toISOString().split('T')[0]).length
              }
            </div>
          </div>

          <div className={`${cardBg} p-6 border shadow-lg hover:shadow-xl transition-all duration-300`}
            style={{ borderRadius: '1.5rem' }}>
            <div className="flex items-center justify-between mb-4">
              <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-3 rounded-xl`}>
                <CalendarDays className={`h-6 w-6 ${textPrimary}`} />
              </div>
              <CalendarDays className="h-5 w-5 text-purple-500" />
            </div>
            <h3 className={`${textSecondary} text-sm font-medium uppercase tracking-wider mb-2`}>This Week</h3>
            <div className={`${textPrimary} text-3xl font-bold`}>
              {loading ? <Loader2 className="h-6 w-6 animate-spin inline" /> : 
                schedules.filter(s => {
                  const scheduleDate = new Date(s.shift_date || '')
                  const now = new Date()
                  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
                  const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6))
                  return scheduleDate >= weekStart && scheduleDate <= weekEnd
                }).length
              }
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className={`${cardBg} p-6 border shadow-lg mb-6`} style={{ borderRadius: '1.5rem' }}>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${textSecondary}`} />
                <Input
                  placeholder="Search schedules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 ${innerCardBg} ${textPrimary} border-0`}
                />
              </div>

              {/* Staff Filter */}
              <select
                value={staffFilter}
                onChange={(e) => setStaffFilter(e.target.value)}
                className={`${innerCardBg} ${textPrimary} px-4 py-2 rounded-lg border-0`}
              >
                <option value="all">All Staff</option>
                {staffMembers.map(staff => (
                  <option key={staff.id} value={staff.id}>
                    {staff.first_name} {staff.last_name}
                  </option>
                ))}
              </select>

              {/* Date Filter */}
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className={`${innerCardBg} ${textPrimary} border-0`}
                placeholder="Filter by date"
              />
            </div>

            <Button
              onClick={() => {
                resetForm()
                setEditingSchedule(null)
                setShowCreateForm(true)
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Schedule
            </Button>
          </div>
        </div>

        {/* Schedule Table */}
        <div className={`${cardBg} border-l border-r border-t shadow-lg transition-colors duration-300 overflow-hidden flex-1`} style={{ borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem' }}>
          {loading ? (
            <div className="p-8 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : error ? (
            <div className="p-8">
              <div className="flex items-center gap-3 text-red-500">
                <AlertCircle className="h-6 w-6" />
                <p>Error loading schedules: {error}</p>
              </div>
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className={`h-12 w-12 ${textSecondary} mx-auto mb-4`} />
              <h3 className={`${textPrimary} text-lg font-semibold mb-2`}>No Schedules Found</h3>
              <p className={`${textSecondary}`}>
                {searchTerm || staffFilter !== 'all' || dateFilter
                  ? 'Try adjusting your search or filters' 
                  : 'Get started by adding your first schedule'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto overflow-y-auto flex-1">
              <table className="w-full">
                {/* Table Header */}
                <thead className="sticky top-0 z-10">
                  <tr className={`${isDark ? "bg-[#171717] border-b border-[#2a2a2a]" : "bg-white border-b border-gray-200"}`}>
                    <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                      Staff Member
                    </th>
                    <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                      Date
                    </th>
                    <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                      Shift Time
                    </th>
                    <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                      Duration
                    </th>
                    <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                      Status
                    </th>
                    <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                      Notes
                    </th>
                    <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                
                {/* Table Body */}
                <tbody>
                  {filteredSchedules.map((schedule, index) => {
                    const staff = staffMembers.find(s => s.id === schedule.staff_id)
                    const staffName = staff ? `${staff.first_name} ${staff.last_name}` : 'Unknown Staff'
                    
                    // Calculate duration
                    const calculateDuration = () => {
                      if (!schedule.shift_start || !schedule.shift_end) return 'Unknown'
                      const startTime = new Date(`2000-01-01T${schedule.shift_start}`)
                      const endTime = new Date(`2000-01-01T${schedule.shift_end}`)
                      const diffMs = endTime.getTime() - startTime.getTime()
                      const hours = Math.floor(diffMs / (1000 * 60 * 60))
                      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
                      return `${hours}h ${minutes}m`
                    }
                    
                    return (
                      <tr 
                        key={schedule.id}
                        className={`${isDark ? "border-b border-[#2a2a2a] hover:bg-[#1f1f1f]" : "border-b border-gray-200 hover:bg-gray-50"} transition-colors duration-200`}
                      >
                        {/* Staff Member */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-full flex items-center justify-center`}>
                              <span className={`${textPrimary} font-bold text-sm`}>
                                {(staff?.first_name?.charAt(0) || '')}{(staff?.last_name?.charAt(0) || '')}
                              </span>
                            </div>
                            <div>
                              <div className={`${textPrimary} font-semibold text-sm`}>{staffName}</div>
                              <div className={`${textSecondary} text-xs`}>{staff?.position || 'No position'}</div>
                            </div>
                          </div>
                        </td>
                        
                        {/* Date */}
                        <td className="py-4 px-6">
                          <div className={`${textPrimary} text-sm font-medium`}>
                            {schedule.shift_date ? new Date(schedule.shift_date).toLocaleDateString() : 'Not set'}
                          </div>
                        </td>
                        
                        {/* Shift Time */}
                        <td className="py-4 px-6">
                          <div>
                            <div className={`${textPrimary} text-sm font-medium`}>
                              {schedule.shift_start || 'Not set'} - {schedule.shift_end || 'Not set'}
                            </div>
                          </div>
                        </td>
                        
                        {/* Duration */}
                        <td className="py-4 px-6">
                          <div className={`${textPrimary} text-sm font-medium`}>
                            {calculateDuration()}
                          </div>
                        </td>
                        
                        {/* Status */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${schedule.status === 'scheduled' ? "bg-blue-500" : schedule.status === 'confirmed' ? "bg-green-500" : "bg-gray-400"}`}></div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                schedule.status === 'scheduled' 
                                  ? isDark ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-800"
                                  : schedule.status === 'confirmed'
                                  ? isDark ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800"
                                  : isDark ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {schedule.status || 'Unknown'}
                            </span>
                          </div>
                        </td>
                        
                        {/* Notes */}
                        <td className="py-4 px-6">
                          <div className={`${textSecondary} text-sm max-w-xs truncate`}>
                            {schedule.notes || 'No notes'}
                          </div>
                        </td>
                        
                        {/* Actions */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleEditClick(schedule)}
                              size="sm"
                              variant="outline"
                              className="flex items-center justify-center gap-1"
                            >
                              <Edit className="h-3 w-3" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDeleteSchedule(schedule.id)}
                              size="sm"
                              variant="outline"
                              className="flex items-center justify-center gap-1 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create/Edit Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${cardBg} p-8 border shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
              style={{ borderRadius: '1.5rem' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${textPrimary}`}>
                  {editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}
                </h2>
                <Button
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingSchedule(null)
                    resetForm()
                  }}
                  variant="outline"
                  size="sm"
                >
                  ✕
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className={`${textPrimary} font-medium`}>Staff Member *</Label>
                  <select
                    value={formData.staff_id}
                    onChange={(e) => setFormData({ ...formData, staff_id: e.target.value })}
                    className={`${innerCardBg} ${textPrimary} mt-1 w-full px-3 py-2 rounded-lg border`}
                    required
                  >
                    <option value="">Select staff member</option>
                    {staffMembers.map(staff => (
                      <option key={staff.id} value={staff.id}>
                        {staff.first_name} {staff.last_name} - {staff.position}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className={`${textPrimary} font-medium`}>Date *</Label>
                  <Input
                    type="date"
                    value={formData.shift_date}
                    onChange={(e) => setFormData({ ...formData, shift_date: e.target.value })}
                    className={`${innerCardBg} ${textPrimary} mt-1`}
                    required
                  />
                </div>

                <div>
                  <Label className={`${textPrimary} font-medium`}>Start Time *</Label>
                  <Input
                    type="time"
                    value={formData.shift_start}
                    onChange={(e) => setFormData({ ...formData, shift_start: e.target.value })}
                    className={`${innerCardBg} ${textPrimary} mt-1`}
                    required
                  />
                </div>

                <div>
                  <Label className={`${textPrimary} font-medium`}>End Time *</Label>
                  <Input
                    type="time"
                    value={formData.shift_end}
                    onChange={(e) => setFormData({ ...formData, shift_end: e.target.value })}
                    className={`${innerCardBg} ${textPrimary} mt-1`}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label className={`${textPrimary} font-medium`}>Notes</Label>
                  <Input
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className={`${innerCardBg} ${textPrimary} mt-1`}
                    placeholder="Optional notes about this shift"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <Button
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingSchedule(null)
                    resetForm()
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingSchedule ? handleUpdateSchedule : handleCreateSchedule}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!formData.staff_id || !formData.shift_date || !formData.shift_start || !formData.shift_end}
                >
                  {editingSchedule ? 'Update Schedule' : 'Add Schedule'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
