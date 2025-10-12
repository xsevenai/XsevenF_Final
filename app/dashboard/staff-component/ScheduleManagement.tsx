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
    <div className={`flex-1 ${mainPanelBg} h-screen overflow-y-auto transition-colors duration-300`}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className={`${cardBg} p-8 border shadow-lg relative overflow-hidden`}
          style={{ borderRadius: '1.5rem' }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Schedule Management</h1>
              <p className={`${textSecondary}`}>Manage staff schedules and shifts</p>
            </div>
            <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-4 rounded-2xl`}>
              <Calendar className={`h-8 w-8 ${textPrimary}`} />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
        <div className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
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

        {/* Schedule List */}
        <div className="space-y-4">
          {loading ? (
            <div className={`${cardBg} p-8 border shadow-lg flex items-center justify-center`} style={{ borderRadius: '1.5rem' }}>
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : error ? (
            <div className={`${cardBg} p-8 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
              <div className="flex items-center gap-3 text-red-500">
                <AlertCircle className="h-6 w-6" />
                <p>Error loading schedules: {error}</p>
              </div>
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className={`${cardBg} p-8 border shadow-lg text-center`} style={{ borderRadius: '1.5rem' }}>
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
            filteredSchedules.map((schedule, index) => {
              const staff = staffMembers.find(s => s.id === schedule.staff_id)
              const staffName = staff ? `${staff.first_name} ${staff.last_name}` : 'Unknown Staff'
              
              return (
                <div
                  key={schedule.id}
                  className={`${cardBg} p-6 border shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02]`}
                  style={{ 
                    borderRadius: index % 3 === 0 ? '1.5rem' : index % 3 === 1 ? '2rem' : '1rem'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl flex items-center justify-center`}>
                        <Calendar className={`h-8 w-8 ${textPrimary}`} />
                      </div>
                      <div>
                        <h3 className={`${textPrimary} font-semibold text-lg`}>
                          {staffName}
                        </h3>
                        <p className={`${textSecondary} text-sm`}>
                          {schedule.shift_date} • {schedule.shift_start} - {schedule.shift_end}
                        </p>
                        {schedule.notes && (
                          <p className={`${textSecondary} text-xs mt-1`}>{schedule.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditClick(schedule)
                        }}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteSchedule(schedule.id)
                        }}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })
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
