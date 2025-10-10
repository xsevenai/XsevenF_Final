// app/dashboard/table-components/TableComponent.tsx

"use client"

import { useState, useEffect } from "react"
import { Plus, BarChart3, Settings, Search } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"
import { useTables } from "@/hooks/use-operations"
import TableList from "./TableList"
import TablePostingForm from "./TablePostingForm"
import TableAvailabilitySearch from "./TableAvailabiltySearch"

export default function TableComponent() {
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [businessId, setBusinessId] = useState<string>("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'availability'>('overview')

  // Get business ID from localStorage
  useEffect(() => {
    const storedBusinessId = localStorage.getItem('businessId')
    if (storedBusinessId) {
      setBusinessId(storedBusinessId)
    } else {
      console.warn('No business ID found. Please ensure user is logged in.')
    }
  }, [])

  // Use the tables hook from use-operations
  const { 
    tables, 
    loading, 
    error, 
    refresh: refreshTables,
    createTable,
    updateTable,
    assignTable,
    releaseTable,
    checkTableAvailability
  } = useTables(businessId)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!themeLoaded || !mounted) {
    return null
  }

  // Theme variables matching MainPanel
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const gradientText = isDark 
    ? 'bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent'
    : 'bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 bg-clip-text text-transparent'
  const buttonPrimary = isDark ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'
  const tabInactive = isDark ? 'bg-[#1f1f1f] text-gray-400 hover:bg-[#2a2a2a] hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'

  // Handle table updates
  const handleTableUpdate = () => {
    refreshTables()
  }

  // Handle successful table creation
  const handleTableCreated = () => {
    handleTableUpdate()
    setShowAddForm(false)
  }

  // Handle availability check
  const handleAvailabilityCheck = (data: any) => {
    // You can use this data to show notifications or update other components
    console.log('Availability data:', data)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-3xl font-bold mb-2 ${gradientText}`}>
              Table Management
            </h2>
            <p className={`${textSecondary}`}>Monitor and manage restaurant table status and reservations</p>
          </div>
          
          {/* Add Table Button */}
          <button
            onClick={() => setShowAddForm(true)}
            className={`flex items-center gap-2 px-4 py-2 ${buttonPrimary} transition-all duration-300 transform hover:scale-105 shadow-lg`}
            style={{ borderRadius: '0.5rem' }}
          >
            <Plus className="h-4 w-4" />
            Add Table
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 transition-all duration-300 ${
            activeTab === 'overview'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
              : tabInactive
          }`}
          style={{ borderRadius: '0.5rem' }}
        >
          <BarChart3 className="h-4 w-4" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('availability')}
          className={`flex items-center gap-2 px-4 py-2 transition-all duration-300 ${
            activeTab === 'availability'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
              : tabInactive
          }`}
          style={{ borderRadius: '0.5rem' }}
        >
          <Search className="h-4 w-4" />
          Availability
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab - Default Table List */}
        {activeTab === 'overview' && (
          <>
            <TableList 
              tables={tables}
              loading={loading}
              error={error}
              onTableUpdate={handleTableUpdate}
              onUpdateTable={updateTable}
              onAssignTable={assignTable}
              onReleaseTable={releaseTable}
            />
          </>
        )}

        {/* Availability Tab */}
        {activeTab === 'availability' && (
  <TableAvailabilitySearch 
    checkTableAvailability={checkTableAvailability}
    onAvailabilityCheck={handleAvailabilityCheck} 
    autoExpanded={true}
    businessId={businessId} // Make sure to pass this
  />
)}
      </div>

      {/* Table Posting Form Modal */}
      <TablePostingForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSuccess={handleTableCreated}
        createTable={createTable}
        tables={tables}
      />
    </div>
  )
}