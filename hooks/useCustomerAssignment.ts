// hooks/useCustomerAssignment.ts

"use client"

import { useState, useCallback } from 'react'
import { tablesApi, CustomerAssignmentData, CustomerAssignmentResponse } from '@/lib/tables-api'

export interface UseCustomerAssignmentReturn {
  loading: boolean
  error: string | null
  success: string | null
  assignCustomer: (tableId: string, customerData: CustomerAssignmentData) => Promise<CustomerAssignmentResponse>
  clearState: () => void
}

export function useCustomerAssignment(): UseCustomerAssignmentReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Assign customer to table
  const assignCustomer = useCallback(async (
    tableId: string, 
    customerData: CustomerAssignmentData
  ): Promise<CustomerAssignmentResponse> => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      
      const response = await tablesApi.assignCustomerToTable(tableId, customerData)
      setSuccess(response.message)
      
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to assign customer to table'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Clear all states
  const clearState = useCallback(() => {
    setLoading(false)
    setError(null)
    setSuccess(null)
  }, [])

  return {
    loading,
    error,
    success,
    assignCustomer,
    clearState,
  }
}