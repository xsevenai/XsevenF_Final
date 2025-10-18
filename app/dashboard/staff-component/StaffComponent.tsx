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
import StaffFormComponent from './StaffFormComponent'

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
  const [expandedView, setExpandedView] = useState<'add-staff-member' | 'edit-staff-member' | null>(null)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [positionFilter, setPositionFilter] = useState<string>('all')

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCloseEdit = () => {
    setExpandedView(null)
    setEditingStaff(null)
  }

  const handleStaffMemberCreated = () => {
    console.log('Staff member created successfully')
    // Refresh the staff list
    refresh()
  }

  const handleStaffMemberUpdated = () => {
    console.log('Staff member updated successfully')
    // Refresh the staff list
    refresh()
  }

  const handleEditClick = (staff: StaffMember) => {
    setEditingStaff(staff)
    setExpandedView('edit-staff-member')
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

  // Handle expanded views (like MenuComponent does)
  if (expandedView) {
    return (
      <StaffFormComponent
        formType={expandedView}
        onBack={handleCloseEdit}
        onStaffMemberCreated={handleStaffMemberCreated}
        onStaffMemberUpdated={handleStaffMemberUpdated}
        editStaff={editingStaff || undefined}
        businessId={businessId}
      />
    )
  }

  const mainPanelBg = isDark ? 'bg-[#111111]' : 'bg-gray-50'
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const buttonTheme = isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'

  return (
    <div className={`flex-1 ${mainPanelBg} h-screen flex flex-col transition-colors duration-300`}>
      <div className="px-6 pt-6 pb-0 flex flex-col flex-1">
        {/* Header */}
        <div className={`${cardBg} p-8 border shadow-lg relative overflow-hidden mb-6`}
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
        <div className="flex justify-center gap-3 mb-6">
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
        <div className={`${cardBg} p-6 border shadow-lg mb-6`} style={{ borderRadius: '1.5rem' }}>
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
                  setExpandedView('add-staff-member')
                }}
                className={`${buttonTheme} px-6 py-2 rounded-lg flex items-center gap-2`}
              >
                <UserPlus className="h-4 w-4" />
                Add Staff Member
              </Button>
            </div>
          </div>
        </div>

        {/* Staff Table */}
        <div className={`${cardBg} border-l border-r border-t shadow-lg transition-colors duration-300 overflow-hidden flex-1`} style={{ borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem' }}>
          {loading ? (
            <div className="p-8 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : error ? (
            <div className="p-8">
              <div className="flex items-center gap-3 text-red-500">
                <AlertCircle className="h-6 w-6" />
                <p>Error loading staff members: {error}</p>
              </div>
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="p-8 text-center">
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
            <div className="overflow-x-auto overflow-y-auto flex-1">
              <table className="w-full">
                {/* Table Header */}
                <thead className="sticky top-0 z-10">
                  <tr className={`${isDark ? "bg-[#171717] border-b border-[#2a2a2a]" : "bg-white border-b border-gray-200"}`}>
                    <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                      Staff Member
                    </th>
                    <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                      Position
                    </th>
                    <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                      Contact
                    </th>
                    <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                      Hourly Rate
                    </th>
                    <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                      Hire Date
                    </th>
                    <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                      Status
                    </th>
                    <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                
                {/* Table Body */}
                <tbody>
                  {filteredStaff.map((staff, index) => (
                    <tr 
                      key={staff.id}
                      className={`${isDark ? "border-b border-[#2a2a2a] hover:bg-[#1f1f1f]" : "border-b border-gray-200 hover:bg-gray-50"} transition-colors duration-200`}
                    >
                      {/* Staff Member */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-full flex items-center justify-center`}>
                            <span className={`${textPrimary} font-bold text-sm`}>
                              {(staff.first_name?.charAt(0) || '')}{(staff.last_name?.charAt(0) || '')}
                            </span>
                          </div>
                          <div>
                            <div className={`${textPrimary} font-semibold text-sm`}>
                              {staff.first_name} {staff.last_name}
                            </div>
                            <div className={`${textSecondary} text-xs`}>ID: {staff.id}</div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Position */}
                      <td className="py-4 px-6">
                        <div className={`${textPrimary} text-sm font-medium`}>
                          {staff.position || 'No position'}
                        </div>
                      </td>
                      
                      {/* Contact */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <span className={`${textSecondary} text-xs`}>{staff.email}</span>
                          </div>
                          {staff.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span className={`${textSecondary} text-xs`}>{staff.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      
                      {/* Hourly Rate */}
                      <td className="py-4 px-6">
                        <div className={`${textPrimary} text-sm font-medium`}>
                          ${staff.hourly_rate ? parseFloat(staff.hourly_rate).toFixed(2) : '0.00'}/hr
                        </div>
                      </td>
                      
                      {/* Hire Date */}
                      <td className="py-4 px-6">
                        <div className={`${textPrimary} text-sm`}>
                          {staff.hire_date ? new Date(staff.hire_date).toLocaleDateString() : 'Not set'}
                        </div>
                      </td>
                      
                      {/* Status */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${staff.status === 'active' ? "bg-green-500" : "bg-gray-400"}`}></div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              staff.status === 'active' 
                                ? isDark ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800"
                                : isDark ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {staff.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      
                      {/* Actions */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleEditClick(staff)}
                            size="sm"
                            className={`${buttonTheme}`}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

          </>
        ) : (
          <div className="flex flex-col flex-1">
            <ScheduleManagement businessId={businessId} />
          </div>
        )}
      </div>
    </div>
  )
}