"use client"

import { useState, useEffect } from 'react'
import { useTimeClock, useStaffMembers } from '@/hooks/use-operations'
import { useTheme } from '@/hooks/useTheme'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Clock, 
  Plus, 
  Search, 
  Filter,
  Loader2,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Play,
  Square,
  Timer
} from 'lucide-react'
import type { TimeClock } from '@/src/api/generated/models/TimeClock'
import type { TimeClockCreate } from '@/src/api/generated/models/TimeClockCreate'

interface TimeClockComponentProps {
  businessId: string
}

export default function TimeClockComponent({ businessId }: TimeClockComponentProps) {
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()
  const { 
    timeClockEntries, 
    clockedInStaff,
    loading, 
    error, 
    refresh, 
    refreshClockedInStaff,
    clockIn, 
    clockOut
  } = useTimeClock(businessId)
  
  const { staffMembers } = useStaffMembers(businessId)

  const [mounted, setMounted] = useState(false)
  const [showClockInForm, setShowClockInForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [staffFilter, setStaffFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('')

  // Form state for clock in
  const [clockInFormData, setClockInFormData] = useState<TimeClockCreate>({
    staff_id: '',
    clock_in: new Date().toISOString(),
    location_id: null,
    notes: null,
    business_id: businessId
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClockIn = async () => {
    try {
      console.log('🔄 Clocking in staff with data:', clockInFormData)
      await clockIn(clockInFormData)
      setShowClockInForm(false)
      resetClockInForm()
      await refresh() // Refresh the list
      await refreshClockedInStaff() // Refresh clocked-in staff
    } catch (error) {
      console.error('Failed to clock in:', error)
    }
  }

  const handleClockOut = async (clockId: string) => {
    try {
      console.log('🔄 Clocking out:', clockId)
      await clockOut(clockId)
      await refresh() // Refresh the list
      await refreshClockedInStaff() // Refresh clocked-in staff
    } catch (error) {
      console.error('Failed to clock out:', error)
    }
  }

  const resetClockInForm = () => {
    setClockInFormData({
      staff_id: '',
      clock_in: new Date().toISOString(),
      location_id: null,
      notes: null,
      business_id: businessId
    })
  }

  // Filter time clock entries
  const filteredEntries = timeClockEntries.filter(entry => {
    const staff = staffMembers.find(s => s.id === entry.staff_id)
    const staffName = staff ? `${staff.first_name} ${staff.last_name}` : ''
    
    const matchesSearch = 
      staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.notes?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    
    const matchesStaff = staffFilter === 'all' || entry.staff_id === staffFilter
    
    const entryDate = entry.clock_in ? new Date(entry.clock_in).toISOString().split('T')[0] : ''
    const matchesDate = !dateFilter || entryDate === dateFilter
    
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
    <div className={`flex-1 ${mainPanelBg} h-screen flex flex-col transition-colors duration-300`}>
      <div className="px-6 pt-6 pb-0 flex flex-col flex-1">
        {/* Header */}
        <div className={`${cardBg} p-8 border shadow-lg relative overflow-hidden`}
          style={{ borderRadius: '1.5rem' }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Time Clock Management</h1>
              <p className={`${textSecondary}`}>Track staff clock in/out times and manage attendance</p>
            </div>
            <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-4 rounded-2xl`}>
              <Clock className={`h-8 w-8 ${textPrimary}`} />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className={`${cardBg} p-6 border shadow-lg hover:shadow-xl transition-all duration-300`}
            style={{ borderRadius: '1.5rem' }}>
            <div className="flex items-center justify-between mb-4">
              <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-3 rounded-xl`}>
                <Clock className={`h-6 w-6 ${textPrimary}`} />
              </div>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <h3 className={`${textSecondary} text-sm font-medium uppercase tracking-wider mb-2`}>Total Entries</h3>
            <div className={`${textPrimary} text-3xl font-bold`}>
              {loading ? <Loader2 className="h-6 w-6 animate-spin inline" /> : timeClockEntries.length}
            </div>
          </div>

          <div className={`${cardBg} p-6 border shadow-lg hover:shadow-xl transition-all duration-300`}
            style={{ borderRadius: '1.5rem' }}>
            <div className="flex items-center justify-between mb-4">
              <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-3 rounded-xl`}>
                <Users className={`h-6 w-6 ${textPrimary}`} />
              </div>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className={`${textSecondary} text-sm font-medium uppercase tracking-wider mb-2`}>Clocked In</h3>
            <div className={`${textPrimary} text-3xl font-bold`}>
              {loading ? <Loader2 className="h-6 w-6 animate-spin inline" /> : clockedInStaff.length}
            </div>
          </div>

          <div className={`${cardBg} p-6 border shadow-lg hover:shadow-xl transition-all duration-300`}
            style={{ borderRadius: '1.5rem' }}>
            <div className="flex items-center justify-between mb-4">
              <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-3 rounded-xl`}>
                <Calendar className={`h-6 w-6 ${textPrimary}`} />
              </div>
              <Calendar className="h-5 w-5 text-orange-500" />
            </div>
            <h3 className={`${textSecondary} text-sm font-medium uppercase tracking-wider mb-2`}>Today's Entries</h3>
            <div className={`${textPrimary} text-3xl font-bold`}>
              {loading ? <Loader2 className="h-6 w-6 animate-spin inline" /> : 
                timeClockEntries.filter(entry => {
                  const entryDate = entry.clock_in ? new Date(entry.clock_in).toISOString().split('T')[0] : ''
                  return entryDate === new Date().toISOString().split('T')[0]
                }).length
              }
            </div>
          </div>

          <div className={`${cardBg} p-6 border shadow-lg hover:shadow-xl transition-all duration-300`}
            style={{ borderRadius: '1.5rem' }}>
            <div className="flex items-center justify-between mb-4">
              <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-3 rounded-xl`}>
                <Timer className={`h-6 w-6 ${textPrimary}`} />
              </div>
              <Timer className="h-5 w-5 text-purple-500" />
            </div>
            <h3 className={`${textSecondary} text-sm font-medium uppercase tracking-wider mb-2`}>Active Shifts</h3>
            <div className={`${textPrimary} text-3xl font-bold`}>
              {loading ? <Loader2 className="h-6 w-6 animate-spin inline" /> : 
                timeClockEntries.filter(entry => !entry.clock_out).length
              }
            </div>
          </div>
        </div>

        {/* Clocked In Staff Section */}
        {clockedInStaff.length > 0 && (
          <div className={`${cardBg} p-6 border shadow-lg mb-6`} style={{ borderRadius: '1.5rem' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold ${textPrimary}`}>Currently Clocked In</h2>
              <div className={`px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800`}>
                {clockedInStaff.length} Active
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clockedInStaff.map((staff, index) => (
                <div
                  key={staff.id || index}
                  className={`${innerCardBg} p-4 border rounded-lg flex items-center justify-between`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-full flex items-center justify-center`}>
                      <span className={`${textPrimary} font-bold text-sm`}>
                        {(staff.first_name?.charAt(0) || '')}{(staff.last_name?.charAt(0) || '')}
                      </span>
                    </div>
                    <div>
                      <p className={`${textPrimary} font-medium`}>
                        {staff.first_name} {staff.last_name}
                      </p>
                      <p className={`${textSecondary} text-xs`}>
                        Clocked in: {staff.clock_in ? new Date(staff.clock_in).toLocaleTimeString() : 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleClockOut(staff.id)}
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Square className="h-3 w-3 mr-1" />
                    Clock Out
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className={`${cardBg} p-6 border shadow-lg mb-6`} style={{ borderRadius: '1.5rem' }}>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${textSecondary}`} />
                <Input
                  placeholder="Search time entries..."
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
                resetClockInForm()
                setShowClockInForm(true)
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Clock In Staff
            </Button>
          </div>
        </div>

        {/* Time Clock Entries Table */}
        <div className={`${cardBg} border-l border-r border-t shadow-lg transition-colors duration-300 overflow-hidden flex-1`} style={{ borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem' }}>
          {loading ? (
            <div className="p-8 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : error ? (
            <div className="p-8">
              <div className="flex items-center gap-3 text-red-500">
                <AlertCircle className="h-6 w-6" />
                <p>Error loading time clock entries: {error}</p>
              </div>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="p-8 text-center">
              <Clock className={`h-12 w-12 ${textSecondary} mx-auto mb-4`} />
              <h3 className={`${textPrimary} text-lg font-semibold mb-2`}>No Time Entries Found</h3>
              <p className={`${textSecondary}`}>
                {searchTerm || staffFilter !== 'all' || dateFilter
                  ? 'Try adjusting your search or filters' 
                  : 'Get started by clocking in your first staff member'
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
                      Clock In
                    </th>
                    <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                      Clock Out
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
                  {filteredEntries.map((entry, index) => {
                    const staff = staffMembers.find(s => s.id === entry.staff_id)
                    const staffName = staff ? `${staff.first_name} ${staff.last_name}` : 'Unknown Staff'
                    const clockInTime = entry.clock_in ? new Date(entry.clock_in) : null
                    const clockOutTime = entry.clock_out ? new Date(entry.clock_out) : null
                    const isActive = !clockOutTime
                    
                    // Calculate duration
                    const calculateDuration = () => {
                      if (!clockInTime) return 'Unknown'
                      const endTime = clockOutTime || new Date()
                      const diffMs = endTime.getTime() - clockInTime.getTime()
                      const hours = Math.floor(diffMs / (1000 * 60 * 60))
                      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
                      return `${hours}h ${minutes}m`
                    }
                    
                    return (
                      <tr 
                        key={entry.id}
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
                              <div className={`${textSecondary} text-xs`}>{staff?.position || 'Unknown Position'}</div>
                            </div>
                          </div>
                        </td>
                        
                        {/* Clock In */}
                        <td className="py-4 px-6">
                          <div>
                            <div className={`${textPrimary} text-sm font-medium`}>
                              {clockInTime ? clockInTime.toLocaleDateString() : 'Unknown'}
                            </div>
                            <div className={`${textSecondary} text-xs`}>
                              {clockInTime ? clockInTime.toLocaleTimeString() : 'Unknown'}
                            </div>
                          </div>
                        </td>
                        
                        {/* Clock Out */}
                        <td className="py-4 px-6">
                          <div>
                            {clockOutTime ? (
                              <>
                                <div className={`${textPrimary} text-sm font-medium`}>
                                  {clockOutTime.toLocaleDateString()}
                                </div>
                                <div className={`${textSecondary} text-xs`}>
                                  {clockOutTime.toLocaleTimeString()}
                                </div>
                              </>
                            ) : (
                              <div className={`${textSecondary} text-sm italic`}>Still Active</div>
                            )}
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
                            <div className={`w-2 h-2 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`}></div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                isActive 
                                  ? isDark ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800"
                                  : isDark ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {isActive ? 'Active' : 'Completed'}
                            </span>
                          </div>
                        </td>
                        
                        {/* Notes */}
                        <td className="py-4 px-6">
                          <div className={`${textSecondary} text-sm max-w-xs truncate`}>
                            {entry.notes || 'No notes'}
                          </div>
                        </td>
                        
                        {/* Actions */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {isActive && (
                              <Button
                                onClick={() => handleClockOut(entry.id)}
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                <Square className="h-3 w-3 mr-1" />
                                Clock Out
                              </Button>
                            )}
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

        {/* Clock In Form Modal */}
        {showClockInForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${cardBg} p-8 border shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto`}
              style={{ borderRadius: '1.5rem' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${textPrimary}`}>
                  Clock In Staff Member
                </h2>
                <Button
                  onClick={() => {
                    setShowClockInForm(false)
                    resetClockInForm()
                  }}
                  variant="outline"
                  size="sm"
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className={`${textPrimary} font-medium`}>Staff Member *</Label>
                  <select
                    value={clockInFormData.staff_id}
                    onChange={(e) => setClockInFormData({ ...clockInFormData, staff_id: e.target.value })}
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
                  <Label className={`${textPrimary} font-medium`}>Clock In Time *</Label>
                  <Input
                    type="datetime-local"
                    value={clockInFormData.clock_in ? new Date(clockInFormData.clock_in).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setClockInFormData({ ...clockInFormData, clock_in: new Date(e.target.value).toISOString() })}
                    className={`${innerCardBg} ${textPrimary} mt-1`}
                    required
                  />
                </div>

                <div>
                  <Label className={`${textPrimary} font-medium`}>Notes</Label>
                  <Input
                    value={clockInFormData.notes || ''}
                    onChange={(e) => setClockInFormData({ ...clockInFormData, notes: e.target.value })}
                    className={`${innerCardBg} ${textPrimary} mt-1`}
                    placeholder="Optional notes"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <Button
                  onClick={() => {
                    setShowClockInForm(false)
                    resetClockInForm()
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleClockIn}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={!clockInFormData.staff_id || !clockInFormData.clock_in}
                >
                  Clock In
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
