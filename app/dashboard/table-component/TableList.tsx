// app/dashboard/table-components/TableList.tsx

"use client"

import { useState } from "react"
import { Plus, Filter, Grid3X3, List, Search, Users, Clock, CheckCircle, AlertCircle, Loader2, RefreshCw } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useTables, useTableStats } from "@/hooks/use-tables"

interface TableListProps {
  onTableUpdate?: () => void
}

export default function TableList({ onTableUpdate }: TableListProps) {
  const {
    tables,
    loading,
    error,
    refresh,
    updateTableStatus,
  } = useTables()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [updating, setUpdating] = useState<string | null>(null)

  const tableStats = useTableStats(tables)

  // Handle table status update
  const handleUpdateTableStatus = async (tableId: string, newStatus: string) => {
    try {
      setUpdating(tableId)
      await updateTableStatus(tableId, newStatus)
      onTableUpdate?.()
    } catch (err) {
      console.error('Failed to update table status:', err)
      // Error is already handled in the hook
    } finally {
      setUpdating(null)
    }
  }

  // Filter tables based on search and status
  const filteredTables = tables.filter((table) => {
    const matchesSearch = table.number.toString().includes(searchTerm) || 
                         table.location.toLowerCase().includes(searchTerm.toLowerCase())
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
      className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6 hover:border-purple-500/30 transition-all duration-300 group"
    >
      <div className="text-center space-y-4">
        {/* Table Number */}
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-lg">Table {table.number}</h3>
          <span className="text-gray-400 text-sm">{table.seats} seats</span>
        </div>

        {/* Table Visual */}
        <div className={`w-20 h-20 mx-auto rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${getStatusColor(table.status)}`}>
          {getStatusIcon(table.status)}
        </div>

        {/* Location */}
        <p className="text-gray-400 text-sm">{table.location}</p>

        {/* Status Badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(table.status)}`}>
          {getStatusIcon(table.status)}
          <span className="capitalize">{table.status}</span>
        </div>

        {/* Status Controls */}
        <div className="relative">
          <select
            value={table.status}
            onChange={(e) => handleUpdateTableStatus(table.id, e.target.value)}
            disabled={updating === table.id}
            className="w-full bg-gray-700/50 border border-gray-600/50 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-600/50 transition-colors focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="cleaning">Cleaning</option>
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
      className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4 hover:border-purple-500/30 transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getStatusColor(table.status)}`}>
            {getStatusIcon(table.status)}
          </div>
          <div>
            <h3 className="text-white font-semibold">Table {table.number}</h3>
            <p className="text-gray-400 text-sm">{table.location} • {table.seats} seats</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(table.status)}`}>
            <span className="capitalize">{table.status}</span>
          </div>
          <div className="relative">
            <select
              value={table.status}
              onChange={(e) => handleUpdateTableStatus(table.id, e.target.value)}
              disabled={updating === table.id}
              className="bg-gray-700/50 border border-gray-600/50 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-600/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading tables...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
          <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-4" />
          <h3 className="text-red-400 font-semibold mb-2">Error Loading Tables</h3>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <button
            onClick={refresh}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
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
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4">
          <h3 className="text-gray-400 font-medium mb-2">Total Tables</h3>
          <div className="text-2xl font-bold text-white">{tableStats.total}</div>
        </Card>
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4">
          <h3 className="text-green-400 font-medium mb-2">Available</h3>
          <div className="text-2xl font-bold text-white">{tableStats.available}</div>
        </Card>
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4">
          <h3 className="text-red-400 font-medium mb-2">Occupied</h3>
          <div className="text-2xl font-bold text-white">{tableStats.occupied}</div>
        </Card>
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4">
          <h3 className="text-yellow-400 font-medium mb-2">Maintenance</h3>
          <div className="text-2xl font-bold text-white">{tableStats.maintenance}</div>
        </Card>
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4">
          <h3 className="text-blue-400 font-medium mb-2">Reserved</h3>
          <div className="text-2xl font-bold text-white">{tableStats.reserved}</div>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search tables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors w-full sm:w-64"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors appearance-none cursor-pointer"
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
            onClick={refresh}
            disabled={loading}
            className="p-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 hover:text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-700/50 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
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
            <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Tables Found</h3>
              <p className="text-gray-400 mb-6">
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