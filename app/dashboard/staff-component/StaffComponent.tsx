"use client"

import { useState, useEffect } from 'react'
import { useStaffMembers } from '@/hooks/use-operations'
import { useTheme } from '@/hooks/useTheme'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Loader2,
  UserPlus,
  Clock,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import type { StaffMember } from '@/src/api/generated/models/StaffMember'
import type { StaffMemberCreate } from '@/src/api/generated/models/StaffMemberCreate'
import type { StaffMemberUpdate } from '@/src/api/generated/models/StaffMemberUpdate'
import ScheduleManagement from './ScheduleManagement'

interface StaffComponentProps {
  businessId: string
}

export default function StaffComponent({ businessId }: StaffComponentProps) {
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()
  const { 
    staffMembers, 
    loading, 
    error, 
    refresh, 
    createStaffMember, 
    updateStaffMember 
  } = useStaffMembers(businessId)

  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'staff' | 'schedules'>('staff')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [positionFilter, setPositionFilter] = useState<string>('all')

  // Form state - Fixed: Added missing required fields
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

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCreateStaff = async () => {
    try {
      console.log('🔄 Creating staff member with data:', formData)
      await createStaffMember(formData)
      setShowCreateForm(false)
      resetForm()
      await refresh() // Refresh the list
    } catch (error) {
      console.error('Failed to create staff member:', error)
    }
  }

  const handleUpdateStaff = async () => {
    if (!editingStaff) return
    
    try {
      const updateData: StaffMemberUpdate = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        hourly_rate: formData.hourly_rate?.toString(), // Convert number to string

        hire_date: formData.hire_date,
        status: formData.status
      }
      
      console.log('🔄 Updating staff member:', editingStaff.id, updateData)
      await updateStaffMember(editingStaff.id, updateData)
      setEditingStaff(null)
      setShowCreateForm(false)
      resetForm()
      await refresh() // Refresh the list
    } catch (error) {
      console.error('Failed to update staff member:', error)
    }
  }

  const resetForm = () => {
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
  }

  const handleEditClick = (staff: StaffMember) => {
    setEditingStaff(staff)
    setFormData({
      business_id: businessId,
      first_name: staff.first_name || '',
      last_name: staff.last_name || '',
      email: staff.email || '',
      phone: staff.phone || '',
      position: staff.position || '',
      hourly_rate: staff.hourly_rate ? parseFloat(staff.hourly_rate) : 0,
      hire_date: staff.hire_date || '',
      status: staff.status || 'active'
    })
    setShowCreateForm(true)
  }

  // Fixed: Better filtering with null checks
  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = 
      (staff.first_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (staff.last_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (staff.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (staff.position?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && staff.status === 'active') ||
      (statusFilter === 'inactive' && staff.status !== 'active')
    
    const matchesPosition = positionFilter === 'all' || staff.position === positionFilter
    
    return matchesSearch && matchesStatus && matchesPosition
  })

  // Fixed: Handle empty positions
  const uniquePositions = Array.from(new Set(
    staffMembers
      .map(staff => staff.position)
      .filter(position => position && position.trim() !== '')
  ))

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
  const buttonTheme = isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'

  return (
    <div className={`flex-1 ${mainPanelBg} transition-colors duration-300`}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className={`${cardBg} p-8 border shadow-lg relative overflow-hidden`}
          style={{ borderRadius: '1.5rem' }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Staff Management</h1>
              <p className={`${textSecondary}`}>Manage your restaurant staff members and their schedules</p>
            </div>
            <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-4 rounded-2xl`}>
              <Users className={`h-8 w-8 ${textPrimary}`} />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-3">
          <Button
            onClick={() => setActiveTab('staff')}
            className={`text-xs py-1.5 px-4 ${activeTab === 'staff' 
              ? (isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800')
              : `${innerCardBg} ${textPrimary} ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-200'}`}`}
            style={{ borderRadius: '0.75rem' }}
          >
            <Users className="h-3 w-3 mr-1.5" />
            Staff Members
          </Button>
          <Button
            onClick={() => setActiveTab('schedules')}
            className={`text-xs py-1.5 px-4 ${activeTab === 'schedules' 
              ? (isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800')
              : `${innerCardBg} ${textPrimary} ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-200'}`}`}
            style={{ borderRadius: '0.75rem' }}
          >
            <Calendar className="h-3 w-3 mr-1.5" />
            Schedules
          </Button>
        </div>

        {/* Conditional Content */}
        {activeTab === 'staff' ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className={`${cardBg} p-6 border shadow-lg hover:shadow-xl transition-all duration-300`}
            style={{ borderRadius: '1.5rem' }}>
            <div className="flex items-center justify-between mb-4">
              <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-3 rounded-xl`}>
                <Users className={`h-6 w-6 ${textPrimary}`} />
              </div>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <h3 className={`${textSecondary} text-sm font-medium uppercase tracking-wider mb-2`}>Total Staff</h3>
            <div className={`${textPrimary} text-3xl font-bold`}>
              {loading ? <Loader2 className="h-6 w-6 animate-spin inline" /> : staffMembers.length}
            </div>
          </div>

          <div className={`${cardBg} p-6 border shadow-lg hover:shadow-xl transition-all duration-300`}
            style={{ borderRadius: '1.5rem' }}>
            <div className="flex items-center justify-between mb-4">
              <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-3 rounded-xl`}>
                <CheckCircle className={`h-6 w-6 ${textPrimary}`} />
              </div>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <h3 className={`${textSecondary} text-sm font-medium uppercase tracking-wider mb-2`}>Active Staff</h3>
            <div className={`${textPrimary} text-3xl font-bold`}>
              {loading ? <Loader2 className="h-6 w-6 animate-spin inline" /> : staffMembers.filter(s => s.status === 'active').length}
            </div>
          </div>

          <div className={`${cardBg} p-6 border shadow-lg hover:shadow-xl transition-all duration-300`}
            style={{ borderRadius: '1.5rem' }}>
            <div className="flex items-center justify-between mb-4">
              <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-3 rounded-xl`}>
                <XCircle className={`h-6 w-6 ${textPrimary}`} />
              </div>
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <h3 className={`${textSecondary} text-sm font-medium uppercase tracking-wider mb-2`}>Inactive Staff</h3>
            <div className={`${textPrimary} text-3xl font-bold`}>
              {loading ? <Loader2 className="h-6 w-6 animate-spin inline" /> : staffMembers.filter(s => s.status !== 'active').length}
            </div>
          </div>

          <div className={`${cardBg} p-6 border shadow-lg hover:shadow-xl transition-all duration-300`}
            style={{ borderRadius: '1.5rem' }}>
            <div className="flex items-center justify-between mb-4">
              <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-3 rounded-xl`}>
                <DollarSign className={`h-6 w-6 ${textPrimary}`} />
              </div>
              <DollarSign className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className={`${textSecondary} text-sm font-medium uppercase tracking-wider mb-2`}>Avg. Hourly Rate</h3>
            <div className={`${textPrimary} text-3xl font-bold`}>
              {loading ? <Loader2 className="h-6 w-6 animate-spin inline" /> : 
                staffMembers.length > 0 ? 
                  `$${(staffMembers.reduce((sum, s) => sum + (s.hourly_rate ? parseFloat(s.hourly_rate) : 0), 0) / staffMembers.length).toFixed(2)}` : 
                  '$0.00'
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
                  placeholder="Search staff members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 ${innerCardBg} ${textPrimary} border-0`}
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`${innerCardBg} ${textPrimary} px-4 py-2 rounded-lg border-0`}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              {/* Position Filter */}
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className={`${innerCardBg} ${textPrimary} px-4 py-2 rounded-lg border-0`}
              >
                <option value="all">All Positions</option>
                {uniquePositions.map(position => (
                  <option key={position} value={position || ''}>{position}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  resetForm()
                  setEditingStaff(null)
                  setShowCreateForm(true)
                }}
                className={`${buttonTheme} px-6 py-2 rounded-lg flex items-center gap-2`}
              >
                <UserPlus className="h-4 w-4" />
                Add Staff Member
              </Button>
            </div>
          </div>
        </div>

        {/* Staff List */}
        <div className="space-y-4">
          {loading ? (
            <div className={`${cardBg} p-8 border shadow-lg flex items-center justify-center`} style={{ borderRadius: '1.5rem' }}>
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : error ? (
            <div className={`${cardBg} p-8 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
              <div className="flex items-center gap-3 text-red-500">
                <AlertCircle className="h-6 w-6" />
                <p>Error loading staff members: {error}</p>
              </div>
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className={`${cardBg} p-8 border shadow-lg text-center`} style={{ borderRadius: '1.5rem' }}>
              <Users className={`h-12 w-12 ${textSecondary} mx-auto mb-4`} />
              <h3 className={`${textPrimary} text-lg font-semibold mb-2`}>No Staff Members Found</h3>
              <p className={`${textSecondary}`}>
                {searchTerm || statusFilter !== 'all' || positionFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Get started by adding your first staff member'
                }
              </p>
            </div>
          ) : (
            filteredStaff.map((staff, index) => (
              <div
                key={staff.id}
                className={`${cardBg} p-6 border shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02]`}
                style={{ 
                  borderRadius: index % 3 === 0 ? '1.5rem' : index % 3 === 1 ? '2rem' : '1rem'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl flex items-center justify-center`}>
                      <span className={`${textPrimary} font-bold text-xl`}>
                        {(staff.first_name?.charAt(0) || '')}{(staff.last_name?.charAt(0) || '')}
                      </span>
                    </div>
                    <div>
                      <h3 className={`${textPrimary} font-semibold text-lg`}>
                        {staff.first_name} {staff.last_name}
                      </h3>
                      <p className={`${textSecondary} text-sm`}>{staff.position || 'No position'}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span className={`${textSecondary} text-xs`}>{staff.email}</span>
                        </div>
                        {staff.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span className={`${textSecondary} text-xs`}>{staff.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span className={`${textSecondary} text-xs`}>${staff.hourly_rate ? parseFloat(staff.hourly_rate) : 0}/hr</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      staff.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {staff.status === 'active' ? 'Active' : 'Inactive'}
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditClick(staff)
                      }}
                      className={buttonTheme}
                      size="sm"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create/Edit Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${cardBg} p-8 border shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
              style={{ borderRadius: '1.5rem' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${textPrimary}`}>
                  {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                </h2>
                <Button
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingStaff(null)
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
                  <Label className={`${textPrimary} font-medium`}>First Name *</Label>
                  <Input
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className={`${innerCardBg} ${textPrimary} mt-1`}
                    placeholder="Enter first name"
                    required
                  />
                </div>

                <div>
                  <Label className={`${textPrimary} font-medium`}>Last Name *</Label>
                  <Input
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className={`${innerCardBg} ${textPrimary} mt-1`}
                    placeholder="Enter last name"
                    required
                  />
                </div>

                <div>
                  <Label className={`${textPrimary} font-medium`}>Email *</Label>
                  <Input
                    type="email"
                    value={formData.email ?? ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`${innerCardBg} ${textPrimary} mt-1`}
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div>
                  <Label className={`${textPrimary} font-medium`}>Phone</Label>
                  <Input
                    value={formData.phone ?? ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`${innerCardBg} ${textPrimary} mt-1`}
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <Label className={`${textPrimary} font-medium`}>Position *</Label>
                  <Input
                    value={formData.position ?? ''}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className={`${innerCardBg} ${textPrimary} mt-1`}
                    placeholder="Enter position (e.g., Server, Chef, Manager)"
                    required
                  />
                </div>

                <div>
                  <Label className={`${textPrimary} font-medium`}>Hourly Rate</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.hourly_rate ?? 0}
                    onChange={(e) => setFormData({ ...formData, hourly_rate: parseFloat(e.target.value) || 0 })}
                    className={`${innerCardBg} ${textPrimary} mt-1`}
                    placeholder="Enter hourly rate"
                  />
                </div>

                <div>
                  <Label className={`${textPrimary} font-medium`}>Hire Date</Label>
                  <Input
                    type="date"
                    value={formData.hire_date ?? ''}
                    onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                    className={`${innerCardBg} ${textPrimary} mt-1`}
                  />
                </div>

                <div>
                  <Label className={`${textPrimary} font-medium`}>Status</Label>
                  <select
                    value={formData.status || 'active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className={`${innerCardBg} ${textPrimary} mt-1 w-full px-3 py-2 rounded-lg border`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

              </div>

              <div className="flex justify-end gap-4 mt-8">
                <Button
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingStaff(null)
                    resetForm()
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingStaff ? handleUpdateStaff : handleCreateStaff}
                  className={buttonTheme}
                  disabled={!formData.first_name || !formData.last_name || !formData.email || !formData.position}
                >
                  {editingStaff ? 'Update Staff Member' : 'Add Staff Member'}
                </Button>
              </div>
            </div>
          </div>
        )}
          </>
        ) : (
          <ScheduleManagement businessId={businessId} />
        )}
      </div>
    </div>
  )
}