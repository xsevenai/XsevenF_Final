// app/dashboard/table-components/TableComponent.tsx

"use client"

import { useState } from "react"
import { Plus, BarChart3, Settings, Search } from "lucide-react"
import TableList from "./TableList"
import TablePostingForm from "./TablePostingForm"
import TableAvailabilitySearch from "./TableAvailabiltySearch"
import TableLayoutManager from "./TableLayoutManager"

export default function TableComponent() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [showAddForm, setShowAddForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'availability' | 'layout'>('overview')

  // Handle table updates
  const handleTableUpdate = () => {
    setRefreshTrigger(prev => prev + 1)
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

  // Handle layout update
  const handleLayoutUpdate = () => {
    handleTableUpdate()
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Table Management
            </h2>
            <p className="text-gray-400">Monitor and manage restaurant table status and reservations</p>
          </div>
          
          {/* Add Table Button */}
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25"
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
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
            activeTab === 'overview'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('availability')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
            activeTab === 'availability'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
          }`}
        >
          <Search className="h-4 w-4" />
          Availability
        </button>
        <button
          onClick={() => setActiveTab('layout')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
            activeTab === 'layout'
              ? 'bg-green-600 text-white shadow-lg shadow-green-500/25'
              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
          }`}
        >
          <Settings className="h-4 w-4" />
          Layout Manager
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab - Default Table List */}
        {activeTab === 'overview' && (
          <>
            <TableList onTableUpdate={handleTableUpdate} />
          </>
        )}

        {/* Availability Tab */}
        {activeTab === 'availability' && (
          <TableAvailabilitySearch 
            onAvailabilityCheck={handleAvailabilityCheck} 
            autoExpanded={true}
          />
        )}

        {/* Layout Manager Tab */}
        {activeTab === 'layout' && (
          <TableLayoutManager 
            onLayoutUpdate={handleLayoutUpdate} 
            autoExpanded={true}
          />
        )}
      </div>

      {/* Table Posting Form Modal */}
      <TablePostingForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSuccess={handleTableCreated}
      />
    </div>
  )
}