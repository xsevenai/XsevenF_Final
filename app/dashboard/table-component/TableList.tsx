// app/dashboard/table-components/TableList.tsx

"use client"

import { useState, useEffect } from "react"
import { Plus, Filter, Grid3X3, List, Search, Users, Clock, CheckCircle, AlertCircle, Loader2, RefreshCw, Trash2, UserPlus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useTheme } from "@/hooks/useTheme"
import type { TableWithDetails } from "@/src/api/generated/models/TableWithDetails"
import CustomerAssignment from "./CustomerAssignment"

interface TableListProps {
  tables: TableWithDetails[]
  loading: boolean
  error: string | null
  onTableUpdate?: () => void
  onUpdateTable: (tableId: string, data: any) => Promise<void>
  onAssignTable: (assignment: any) => Promise<void>
  onReleaseTable: (tableId: string) => Promise<void>
}

export default function TableList({ 
  tables, 
  loading, 
  error, 
  onTableUpdate, 
  onUpdateTable, 
  onAssignTable, 
  onReleaseTable 
}: TableListProps) {
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [updating, setUpdating] = useState<string | null>(null)
  
  // Customer assignment modal state
  const [assignmentModal, setAssignmentModal] = useState<{ 
    tableId: string; 
    tableNumber: number; 
    tableCapacity: number;
  } | null>(null)

  // Calculate table stats
  const tableStats = {
    total: tables.length,
    available: tables.filter(t => t.status === "available").length,
    occupied: tables.filter(t => t.status === "occupied").length,
    maintenance: tables.filter(t => t.status === "maintenance").length,
    reserved: tables.filter(t => t.status === "reserved").length,
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!themeLoaded || !mounted) {
    return null
  }

  // Theme variables matching MainPanel
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const textTertiary = isDark ? 'text-gray-500' : 'text-gray-500'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const inputBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-white border-gray-300'
  const hoverBg = isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'
  const hoverBorder = isDark ? 'hover:border-purple-500/30' : 'hover:border-purple-400/50'
  const modalBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'

  // Handle table status update
  const handleUpdateTableStatus = async (tableId: string, newStatus: string) => {
    try {
      setUpdating(tableId)
      await onUpdateTable(tableId, { status: newStatus })
      onTableUpdate?.()
    } catch (err) {
      console.error('Failed to update table status:', err)
    } finally {
      setUpdating(null)
    }
  }

  // Customer assignment handlers
  const openAssignmentModal = (tableId: string, tableNumber: number, tableCapacity: number) => {
    setAssignmentModal({ tableId, tableNumber, tableCapacity })
  }

  const closeAssignmentModal = () => {
    setAssignmentModal(null)
  }

  const handleAssignmentSuccess = (orderId: string) => {
    console.log('Customer assigned successfully, order ID:', orderId)
    onTableUpdate?.()
  }

  // Filter tables based on search and status
  const filteredTables = tables.filter((table) => {
    const matchesSearch = table.table_number.toString().includes(searchTerm) || 
                         table.section.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || table.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "occupied":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "maintenance":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "reserved":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-4 w-4" />
      case "occupied":
        return <Users className="h-4 w-4" />
      case "maintenance":
        return <Clock className="h-4 w-4" />
      case "reserved":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const renderTableCard = (table: any) => (
    <Card
      key={table.id}
      className={`${cardBg} border shadow-lg p-6 ${hoverBorder} transition-all duration-300 group relative`}
      style={{ borderRadius: '1.5rem' }}
    >
      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex gap-1 z-10">
        {/* Assign Customer Button - only for available tables */}
        {table.status === 'available' && (
          <button
            onClick={() => openAssignmentModal(table.id, table.table_number, table.capacity)}
            className={`p-2 ${textTertiary} hover:text-blue-400 hover:bg-blue-500/10 transition-colors`}
            style={{ borderRadius: '0.5rem' }}
            title="Assign Customer"
          >
            <UserPlus className="h-4 w-4" />
          </button>
        )}
        
        {/* Release Table Button - only for occupied tables */}
        {table.status === 'occupied' && (
          <button
            onClick={() => onReleaseTable(table.id)}
            className={`p-2 ${textTertiary} hover:text-orange-400 hover:bg-orange-500/10 transition-colors`}
            style={{ borderRadius: '0.5rem' }}
            title="Release Table"
          >
            <Users className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="text-center space-y-4">
        {/* Table Number */}
        <div className="flex items-center justify-between pr-20">
          <h3 className={`${textPrimary} font-bold text-lg`}>Table {table.table_number}</h3>
          <span className={`${textSecondary} text-sm`}>{table.capacity} seats</span>
        </div>

        {/* Table Visual */}
        <div className={`w-20 h-20 mx-auto flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${getStatusColor(table.status)}`}
          style={{ borderRadius: '0.75rem' }}>
          {getStatusIcon(table.status)}
        </div>

        {/* Location */}
        <p className={`${textSecondary} text-sm`}>{table.section}</p>

        {/* Status Badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-medium ${getStatusColor(table.status)}`}
          style={{ borderRadius: '9999px' }}>
          {getStatusIcon(table.status)}
          <span className="capitalize">{table.status}</span>
        </div>

        {/* Status Controls */}
        <div className="relative">
          <select
            value={table.status}
            onChange={(e) => handleUpdateTableStatus(table.id, e.target.value)}
            disabled={updating === table.id}
            className={`w-full ${inputBg} border ${textPrimary} px-3 py-2 text-sm ${hoverBg} transition-colors focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed`}
            style={{ borderRadius: '0.5rem' }}
          >
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
            <option value="reserved">Reserved</option>
          </select>
          {updating === table.id && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
            </div>
          )}
        </div>
      </div>
    </Card>
  )

  const renderTableList = (table: any) => (
    <Card
      key={table.id}
      className={`${cardBg} border shadow-lg p-4 ${hoverBorder} transition-all duration-300`}
      style={{ borderRadius: '1rem' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 flex items-center justify-center ${getStatusColor(table.status)}`}
            style={{ borderRadius: '0.5rem' }}>
            {getStatusIcon(table.status)}
          </div>
          <div>
            <h3 className={`${textPrimary} font-semibold`}>Table {table.table_number}</h3>
            <p className={`${textSecondary} text-sm`}>{table.section} • {table.capacity} seats</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-medium ${getStatusColor(table.status)}`}
            style={{ borderRadius: '9999px' }}>
            <span className="capitalize">{table.status}</span>
          </div>
          <div className="relative">
            <select
              value={table.status}
              onChange={(e) => handleUpdateTableStatus(table.id, e.target.value)}
              disabled={updating === table.id}
              className={`${inputBg} border ${textPrimary} px-3 py-2 text-sm ${hoverBg} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              style={{ borderRadius: '0.5rem' }}
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
              <option value="reserved">Reserved</option>
            </select>
            {updating === table.id && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
              </div>
            )}
          </div>
          
          {/* Action Buttons for List View */}
          <div className="flex items-center gap-1">
            {/* Assign Customer Button - only for available tables */}
            {table.status === 'available' && (
              <button
                onClick={() => openAssignmentModal(table.id, table.table_number, table.capacity)}
                className={`p-2 ${textTertiary} hover:text-blue-400 hover:bg-blue-500/10 transition-colors`}
                style={{ borderRadius: '0.5rem' }}
                title="Assign Customer"
              >
                <UserPlus className="h-4 w-4" />
              </button>
            )}
            
            {/* Release Table Button - only for occupied tables */}
            {table.status === 'occupied' && (
              <button
                onClick={() => onReleaseTable(table.id)}
                className={`p-2 ${textTertiary} hover:text-orange-400 hover:bg-orange-500/10 transition-colors`}
                style={{ borderRadius: '0.5rem' }}
                title="Release Table"
              >
                <Users className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto mb-4" />
          <p className={`${textSecondary}`}>Loading tables...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-500/10 border border-red-500/20 p-6 max-w-md mx-auto"
          style={{ borderRadius: '0.5rem' }}>
          <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-4" />
          <h3 className="text-red-400 font-semibold mb-2">Error Loading Tables</h3>
          <p className={`${textSecondary} text-sm mb-4`}>{error}</p>
          <button
            onClick={onTableUpdate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white transition-colors"
            style={{ borderRadius: '0.5rem' }}
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Customer Assignment Modal */}
      {assignmentModal && (
        <CustomerAssignment
          tableId={assignmentModal.tableId}
          tableNumber={assignmentModal.tableNumber}
          tableCapacity={assignmentModal.tableCapacity}
          isOpen={true}
          onClose={closeAssignmentModal}
          onSuccess={handleAssignmentSuccess}
          onAssignTable={onAssignTable}
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className={`${cardBg} border shadow-lg p-4 hover:shadow-xl transition-all duration-300`}
          style={{ borderRadius: '1rem' }}>
          <h3 className={`${textSecondary} font-medium mb-2`}>Total Tables</h3>
          <div className={`text-2xl font-bold ${textPrimary}`}>{tableStats.total}</div>
        </Card>
        <Card className={`${cardBg} border shadow-lg p-4 hover:shadow-xl transition-all duration-300`}
          style={{ borderRadius: '1rem' }}>
          <h3 className="text-green-400 font-medium mb-2">Available</h3>
          <div className={`text-2xl font-bold ${textPrimary}`}>{tableStats.available}</div>
        </Card>
        <Card className={`${cardBg} border shadow-lg p-4 hover:shadow-xl transition-all duration-300`}
          style={{ borderRadius: '1rem' }}>
          <h3 className="text-red-400 font-medium mb-2">Occupied</h3>
          <div className={`text-2xl font-bold ${textPrimary}`}>{tableStats.occupied}</div>
        </Card>
        <Card className={`${cardBg} border shadow-lg p-4 hover:shadow-xl transition-all duration-300`}
          style={{ borderRadius: '1rem' }}>
          <h3 className="text-yellow-400 font-medium mb-2">Maintenance</h3>
          <div className={`text-2xl font-bold ${textPrimary}`}>{tableStats.maintenance}</div>
        </Card>
        <Card className={`${cardBg} border shadow-lg p-4 hover:shadow-xl transition-all duration-300`}
          style={{ borderRadius: '1rem' }}>
          <h3 className="text-blue-400 font-medium mb-2">Reserved</h3>
          <div className={`text-2xl font-bold ${textPrimary}`}>{tableStats.reserved}</div>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondary} h-4 w-4`} />
            <input
              type="text"
              placeholder="Search tables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 ${inputBg} border ${textPrimary} placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors w-full sm:w-64`}
              style={{ borderRadius: '0.5rem' }}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondary} h-4 w-4`} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`pl-10 pr-8 py-2 ${inputBg} border ${textPrimary} focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors appearance-none cursor-pointer`}
              style={{ borderRadius: '0.5rem' }}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={onTableUpdate}
            disabled={loading}
            className={`p-2 ${innerCardBg} ${hoverBg} ${textSecondary} hover:${textPrimary} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            style={{ borderRadius: '0.5rem' }}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* View Mode Toggle */}
          <div className={`flex items-center ${innerCardBg} p-1`}
            style={{ borderRadius: '0.5rem' }}>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${
                viewMode === "grid"
                  ? "bg-purple-600 text-white"
                  : `${textSecondary} hover:${textPrimary}`
              }`}
              style={{ borderRadius: '0.25rem' }}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${
                viewMode === "list"
                  ? "bg-purple-600 text-white"
                  : `${textSecondary} hover:${textPrimary}`
              }`}
              style={{ borderRadius: '0.25rem' }}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tables Display */}
      <div className={
        viewMode === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
      }>
        {filteredTables.length > 0 ? (
          filteredTables.map((table) =>
            viewMode === "grid" ? renderTableCard(table) : renderTableList(table)
          )
        ) : (
          <div className="col-span-full">
            <Card className={`${cardBg} border shadow-lg p-12 text-center`}
              style={{ borderRadius: '1.5rem' }}>
              <Users className={`h-12 w-12 ${textSecondary} mx-auto mb-4`} />
              <h3 className={`text-xl font-semibold ${textPrimary} mb-2`}>No Tables Found</h3>
              <p className={`${textSecondary} mb-6`}>
                {searchTerm || filterStatus !== "all"
                  ? "No tables match your current filters."
                  : "No tables available."}
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}