// hooks/use-tables.ts

"use client"

import { useState, useEffect, useCallback } from 'react'
import { tablesApi } from '@/lib/tables-api'

export interface Table {
  id: string
  business_id: string
  table_number: number
  capacity: number
  section: string
  location_notes?: string
  status: "available" | "occupied" | "reserved" | "maintenance"
  qr_code_id?: string | null
  qr_code_url?: string | null
  created_at?: string
  updated_at?: string
  // Legacy fields for compatibility with existing UI
  number: number
  seats: number
  location: string
}

export interface CreateTableData {
  table_number: string // Backend expects string, not number
  capacity: number
  section: string
  location_notes: string
}

export interface UseTablesReturn {
  tables: Table[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  updateTableStatus: (id: string, status: string) => Promise<void>
  addTable: (tableData: Omit<Table, 'id' | 'business_id' | 'created_at' | 'updated_at' | 'qr_code_id' | 'qr_code_url'>) => Promise<void>
  deleteTable: (id: string) => Promise<void>
}

export function useTables(): UseTablesReturn {
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Transform backend data to include legacy fields for UI compatibility
  const transformTableData = (backendTable: any): Table => ({
    ...backendTable,
    number: backendTable.table_number,
    seats: backendTable.capacity,
    location: backendTable.section
  })

  const fetchTables = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await tablesApi.getTables()
      const transformedData = data.map(transformTableData)
      setTables(transformedData)
    } catch (err) {
      console.error('Error fetching tables:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch tables')
    } finally {
      setLoading(false)
    }
  }, [])

  const updateTableStatus = useCallback(async (id: string, status: string) => {
    try {
      setError(null)
      const updatedTable = await tablesApi.updateTableStatus(id, status)
      const transformedTable = transformTableData(updatedTable)
      
      setTables(prevTables => 
        prevTables.map(table => 
          table.id === id ? { ...table, ...transformedTable } : table
        )
      )
    } catch (err) {
      console.error('Error updating table status:', err)
      setError(err instanceof Error ? err.message : 'Failed to update table')
      throw err // Re-throw to handle in component
    }
  }, [])

  const addTable = useCallback(async (tableData: Omit<Table, 'id' | 'business_id' | 'created_at' | 'updated_at' | 'qr_code_id' | 'qr_code_url'>) => {
    try {
      setError(null)
      
      // Transform UI data to backend format - backend expects table_number as string
      const backendData: CreateTableData = {
        table_number: String(tableData.number), // Convert to string as backend expects
        capacity: Number(tableData.seats), // Keep as number
        section: String(tableData.location), // Ensure it's a string
        location_notes: String(tableData.location_notes || "") // Ensure it's a string
      }
      
      console.log('Sending to backend:', JSON.stringify(backendData, null, 2)) // Debug log
      
      const newTable = await tablesApi.createTable(backendData)
      const transformedTable = transformTableData(newTable)
      setTables(prevTables => [...prevTables, transformedTable])
    } catch (err) {
      console.error('Error adding table:', err)
      setError(err instanceof Error ? err.message : 'Failed to add table')
      throw err
    }
  }, [])

  const deleteTable = useCallback(async (id: string) => {
    try {
      setError(null)
      await tablesApi.deleteTable(id)
      setTables(prevTables => prevTables.filter(table => table.id !== id))
    } catch (err) {
      console.error('Error deleting table:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete table')
      throw err
    }
  }, [])

  const refresh = useCallback(async () => {
    await fetchTables()
  }, [fetchTables])

  useEffect(() => {
    fetchTables()
  }, [fetchTables])

  return {
    tables,
    loading,
    error,
    refresh,
    updateTableStatus,
    addTable,
    deleteTable,
  }
}

// Export table statistics helper
export function useTableStats(tables: Table[]) {
  return {
    total: tables.length,
    available: tables.filter(t => t.status === "available").length,
    occupied: tables.filter(t => t.status === "occupied").length,
    maintenance: tables.filter(t => t.status === "maintenance").length,
    reserved: tables.filter(t => t.status === "reserved").length,
  }
}