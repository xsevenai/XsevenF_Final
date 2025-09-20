// app/dashboard/table-components/TableComponent.tsx

"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import TableList from "./TableList"
import TablePostingForm from "./TablePostingForm"

export default function TableComponent() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [showAddForm, setShowAddForm] = useState(false)

  // Handle table updates
  const handleTableUpdate = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  // Handle successful table creation
  const handleTableCreated = () => {
    handleTableUpdate()
    setShowAddForm(false)
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

      {/* Table List Component */}
      <TableList onTableUpdate={handleTableUpdate} />

      {/* Table Posting Form Modal */}
      <TablePostingForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSuccess={handleTableCreated}
      />
    </div>
  )
}