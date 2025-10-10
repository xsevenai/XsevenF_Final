// hooks/use-floor-plans.ts

'use client'

import { useState, useEffect, useCallback } from 'react'
import React from 'react'
import { FoodHospitalityOperationsService } from '@/src/api/generated/services/FoodHospitalityOperationsService'
import { configureAPI } from '@/lib/api-config'
import type { FloorPlan } from '@/src/api/generated/models/FloorPlan'
import type { FloorPlanCreate } from '@/src/api/generated/models/FloorPlanCreate'
import type { FloorPlanUpdate } from '@/src/api/generated/models/FloorPlanUpdate'

// Hook for floor plans management
export const useFloorPlans = (businessId: string) => {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFloorPlans = useCallback(async (locationId?: string) => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      console.log('Fetching floor plans with businessId:', businessId, 'locationId:', locationId)
      const data = await FoodHospitalityOperationsService.listFloorPlansApiV1FoodFloorPlansGet(
        businessId,
        locationId || null
      )
      console.log('Fetched floor plans:', data.length, 'plans')
      setFloorPlans(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch floor plans')
      console.error('Error fetching floor plans:', err)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  const createFloorPlan = useCallback(async (data: FloorPlanCreate) => {
    try {
      setError(null)
      configureAPI()
      
      console.log('Creating floor plan with data:', data)
      const newFloorPlan = await FoodHospitalityOperationsService.createFloorPlanApiV1FoodFloorPlansPost(data)
      console.log('Floor plan created successfully:', newFloorPlan)
      setFloorPlans(prev => [newFloorPlan, ...prev])
      return newFloorPlan
    } catch (err: any) {
      console.error('Error creating floor plan:', err)
      const errorMessage = err.message || 'Failed to create floor plan'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateFloorPlan = useCallback(async (planId: string, data: FloorPlanUpdate) => {
    try {
      setError(null)
      configureAPI()
      
      console.log('Updating floor plan:', planId, 'with data:', data)
      const updatedFloorPlan = await FoodHospitalityOperationsService.updateFloorPlanApiV1FoodFloorPlansPlanIdPut(planId, data)
      console.log('Floor plan updated successfully:', updatedFloorPlan)
      setFloorPlans(prev => prev.map(plan => plan.id === planId ? updatedFloorPlan : plan))
      return updatedFloorPlan
    } catch (err: any) {
      console.error('Error updating floor plan:', err)
      const errorMessage = err.message || 'Failed to update floor plan'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getFloorPlan = useCallback(async (planId: string) => {
    try {
      setError(null)
      configureAPI()
      
      console.log('Getting floor plan:', planId)
      const floorPlan = await FoodHospitalityOperationsService.getFloorPlanApiV1FoodFloorPlansPlanIdGet(planId)
      console.log('Floor plan retrieved:', floorPlan)
      return floorPlan
    } catch (err: any) {
      console.error('Error getting floor plan:', err)
      const errorMessage = err.message || 'Failed to get floor plan'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteFloorPlan = useCallback(async (planId: string) => {
    try {
      setError(null)
      configureAPI()
      
      // Note: There's no delete endpoint in the API, so we'll just remove from local state
      // If delete functionality is needed, it should be added to the backend API
      console.log('Removing floor plan from local state:', planId)
      setFloorPlans(prev => prev.filter(plan => plan.id !== planId))
    } catch (err: any) {
      console.error('Error deleting floor plan:', err)
      const errorMessage = err.message || 'Failed to delete floor plan'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  useEffect(() => {
    if (businessId) {
      fetchFloorPlans()
    }
  }, [businessId, fetchFloorPlans])

  const refreshFloorPlans = useCallback(async (locationId?: string) => {
    return fetchFloorPlans(locationId)
  }, [fetchFloorPlans])

  return {
    floorPlans,
    loading,
    error,
    refresh: refreshFloorPlans,
    createFloorPlan,
    updateFloorPlan,
    getFloorPlan,
    deleteFloorPlan,
    fetchFloorPlans
  }
}

// Hook for floor plan statistics
export const useFloorPlanStats = (businessId: string) => {
  const { floorPlans, loading: plansLoading } = useFloorPlans(businessId)

  const stats = React.useMemo(() => {
    const totalPlans = floorPlans.length
    const activePlans = floorPlans.filter(plan => plan.is_active).length
    const inactivePlans = floorPlans.filter(plan => !plan.is_active).length
    
    // Group by location
    const plansByLocation = floorPlans.reduce((acc, plan) => {
      const locationId = plan.location_id || 'default'
      acc[locationId] = (acc[locationId] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      overview: {
        totalPlans,
        activePlans,
        inactivePlans,
        plansByLocation
      },
      floorPlans
    }
  }, [floorPlans])

  return {
    stats,
    loading: plansLoading,
    error: null,
    refresh: () => {} // Will be handled by the main hook
  }
}

// Combined hook for complete floor plan management
export const useFloorPlanManagement = (businessId: string) => {
  const floorPlans = useFloorPlans(businessId)
  const stats = useFloorPlanStats(businessId)

  const refreshAll = useCallback(async (locationId?: string) => {
    await Promise.all([
      floorPlans.refresh(locationId)
    ])
  }, [floorPlans.refresh])

  return {
    // Core floor plan management
    floorPlans: floorPlans.floorPlans,
    loading: floorPlans.loading || stats.loading,
    error: floorPlans.error || stats.error,
    refresh: floorPlans.refresh,
    createFloorPlan: floorPlans.createFloorPlan,
    updateFloorPlan: floorPlans.updateFloorPlan,
    getFloorPlan: floorPlans.getFloorPlan,
    deleteFloorPlan: floorPlans.deleteFloorPlan,
    
    // Statistics and analytics
    stats,
    
    // Combined operations
    refreshAll
  }
}
