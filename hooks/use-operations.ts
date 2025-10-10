// hooks/use-operations.ts

'use client'

import { useState, useEffect, useCallback } from 'react'
import React from 'react'
import { FoodHospitalityOperationsService } from '@/src/api/generated/services/FoodHospitalityOperationsService'
import { configureAPI } from '@/lib/api-config'
import type { Location } from '@/src/api/generated/models/Location'
import type { LocationCreate } from '@/src/api/generated/models/LocationCreate'
import type { LocationUpdate } from '@/src/api/generated/models/LocationUpdate'
import type { FloorPlan } from '@/src/api/generated/models/FloorPlan'
import type { FloorPlanCreate } from '@/src/api/generated/models/FloorPlanCreate'
import type { FloorPlanUpdate } from '@/src/api/generated/models/FloorPlanUpdate'
import type { Table } from '@/src/api/generated/models/Table'
import type { TableCreate } from '@/src/api/generated/models/TableCreate'
import type { TableUpdate } from '@/src/api/generated/models/TableUpdate'
import type { TableWithDetails } from '@/src/api/generated/models/TableWithDetails'
import type { TableAssignment } from '@/src/api/generated/models/TableAssignment'
import type { KDSOrder } from '@/src/api/generated/models/KDSOrder'
import type { KDSOrderCreate } from '@/src/api/generated/models/KDSOrderCreate'
import type { KDSOrderUpdate } from '@/src/api/generated/models/KDSOrderUpdate'
import type { KDSOrderWithMetrics } from '@/src/api/generated/models/KDSOrderWithMetrics'
import type { StaffMember } from '@/src/api/generated/models/StaffMember'
import type { StaffMemberCreate } from '@/src/api/generated/models/StaffMemberCreate'
import type { StaffMemberUpdate } from '@/src/api/generated/models/StaffMemberUpdate'
import type { StaffSchedule } from '@/src/api/generated/models/StaffSchedule'
import type { StaffScheduleCreate } from '@/src/api/generated/models/StaffScheduleCreate'
import type { StaffScheduleUpdate } from '@/src/api/generated/models/StaffScheduleUpdate'
import type { TimeClock } from '@/src/api/generated/models/TimeClock'
import type { TimeClockCreate } from '@/src/api/generated/models/TimeClockCreate'
import type { OperationsDashboard } from '@/src/api/generated/models/OperationsDashboard'

// Hook for locations management
export const useLocations = (businessId: string) => {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLocations = useCallback(async (isActive?: boolean) => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      console.log('Fetching locations for business:', businessId)
      const data = await FoodHospitalityOperationsService.listLocationsApiV1FoodLocationsGet(
        businessId,
        isActive
      )
      console.log('Fetched locations:', data.length, 'locations')
      setLocations(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch locations')
      console.error('Error fetching locations:', err)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  const createLocation = useCallback(async (data: LocationCreate) => {
    try {
      setError(null)
      configureAPI()
      
      const newLocation = await FoodHospitalityOperationsService.createLocationApiV1FoodLocationsPost(data)
      setLocations(prev => [newLocation, ...prev])
      return newLocation
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create location'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateLocation = useCallback(async (locationId: string, data: LocationUpdate) => {
    try {
      setError(null)
      configureAPI()
      
      const updatedLocation = await FoodHospitalityOperationsService.updateLocationApiV1FoodLocationsLocationIdPut(locationId, data)
      setLocations(prev => prev.map(location => location.id === locationId ? updatedLocation : location))
      return updatedLocation
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update location'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getLocation = useCallback(async (locationId: string) => {
    try {
      setError(null)
      configureAPI()
      
      const location = await FoodHospitalityOperationsService.getLocationApiV1FoodLocationsLocationIdGet(locationId)
      return location
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get location'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  useEffect(() => {
    if (businessId) {
      fetchLocations()
    }
  }, [businessId, fetchLocations])

  return {
    locations,
    loading,
    error,
    refresh: fetchLocations,
    createLocation,
    updateLocation,
    getLocation
  }
}

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
      
      console.log('Fetching floor plans for business:', businessId, 'location:', locationId)
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
      
      const newFloorPlan = await FoodHospitalityOperationsService.createFloorPlanApiV1FoodFloorPlansPost(data)
      setFloorPlans(prev => [newFloorPlan, ...prev])
      return newFloorPlan
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create floor plan'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateFloorPlan = useCallback(async (planId: string, data: FloorPlanUpdate) => {
    try {
      setError(null)
      configureAPI()
      
      const updatedFloorPlan = await FoodHospitalityOperationsService.updateFloorPlanApiV1FoodFloorPlansPlanIdPut(planId, data)
      setFloorPlans(prev => prev.map(plan => plan.id === planId ? updatedFloorPlan : plan))
      return updatedFloorPlan
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update floor plan'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getFloorPlan = useCallback(async (planId: string) => {
    try {
      setError(null)
      configureAPI()
      
      const floorPlan = await FoodHospitalityOperationsService.getFloorPlanApiV1FoodFloorPlansPlanIdGet(planId)
      return floorPlan
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get floor plan'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  useEffect(() => {
    if (businessId) {
      fetchFloorPlans()
    }
  }, [businessId, fetchFloorPlans])

  return {
    floorPlans,
    loading,
    error,
    refresh: fetchFloorPlans,
    createFloorPlan,
    updateFloorPlan,
    getFloorPlan
  }
}

// Hook for table management
export const useTables = (businessId: string) => {
  const [tables, setTables] = useState<TableWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTables = useCallback(async (params?: {
    location_id?: string
    status?: string
    include_details?: boolean
  }) => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      console.log('Fetching tables with params:', params)
      console.log('Business ID:', businessId)
      const data = await FoodHospitalityOperationsService.listTablesApiV1FoodTablesGet(
        businessId,
        params?.location_id || null,
        params?.status || null,
        params?.include_details !== false
      )
      console.log('Fetched tables:', data.length, 'tables')
      console.log('Tables data:', data)
      setTables(data)
    } catch (err: any) {
      console.error('Error fetching tables:', err)
      console.error('Error details:', {
        message: err.message,
        status: err.status,
        response: err.response?.data
      })
      setError(err.message || 'Failed to fetch tables')
    } finally {
      setLoading(false)
    }
  }, [businessId])

  const createTable = useCallback(async (data: TableCreate) => {
    try {
      setError(null)
      configureAPI()
      
      console.log('=== DEBUG: Create Table ===')
      console.log('Original data:', data)
      
      // Add business_id to the data object
      const requestData = {
        ...data,
        business_id: businessId, // Add business_id to the request body
        table_number: parseInt(data.table_number.toString()),
    }
      
      console.log('Request data with business_id:', requestData)
      
      const newTable = await FoodHospitalityOperationsService.createTableApiV1FoodTablesPost(
        requestData  // ← Only pass one argument - the complete data object
      )
      
      console.log('Create table response:', newTable)
      setTables(prev => [newTable, ...prev])
      return newTable
    } catch (err: any) {
      console.error('=== DEBUG: Create Table Error ===')
      console.error('Full error:', err)
      console.error('Error response:', err.response?.data)
      
      const errorMessage = err.message || 'Failed to create table'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [businessId]) // ← Add businessId to dependencies

  const updateTable = useCallback(async (tableId: string, data: TableUpdate) => {
    try {
      setError(null)
      configureAPI()
      
      const updatedTable = await FoodHospitalityOperationsService.updateTableApiV1FoodTablesTableIdPut(tableId, data)
      setTables(prev => prev.map(table => table.id === tableId ? updatedTable : table))
      return updatedTable
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update table'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getTable = useCallback(async (tableId: string) => {
    try {
      setError(null)
      configureAPI()
      
      const table = await FoodHospitalityOperationsService.getTableApiV1FoodTablesTableIdGet(tableId)
      return table
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get table'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const assignTable = useCallback(async (assignment: TableAssignment) => {
    try {
      setError(null)
      configureAPI()
      
      const result = await FoodHospitalityOperationsService.assignTableApiV1FoodTablesAssignPost(assignment)
      await fetchTables() // Refresh table data
      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to assign table'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [fetchTables])

  const releaseTable = useCallback(async (tableId: string) => {
    try {
      setError(null)
      configureAPI()
      
      const result = await FoodHospitalityOperationsService.releaseTableApiV1FoodTablesTableIdReleasePost(tableId)
      await fetchTables() // Refresh table data
      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to release table'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [fetchTables])

  const checkTableAvailability = useCallback(async (params: {
    party_size: number
    location_id?: string
    time_slot?: string
  }) => {
    try {
      setError(null)
      configureAPI()
      
      console.log('Checking table availability with params:', params)
      console.log('Business ID:', businessId)
      console.log('Party size type:', typeof params.party_size, 'value:', params.party_size)
      
      const availableTables = await FoodHospitalityOperationsService.checkTableAvailabilityApiV1FoodTablesAvailabilityGet(
        businessId,
        params.party_size.toString() as any,
        params.location_id || null,
        params.time_slot || null
      )
      console.log('Available tables:', availableTables)
      return availableTables
    } catch (err: any) {
      console.error('Error checking table availability:', err)
      console.error('Error details:', {
        message: err.message,
        status: err.status,
        response: err.response?.data
      })
      const errorMessage = err.message || 'Failed to check table availability'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [businessId])

  useEffect(() => {
    if (businessId) {
      console.log('Business ID found:', businessId)
      console.log('Business ID type:', typeof businessId)
      console.log('Business ID length:', businessId.length)
      fetchTables()
    } else {
      console.log('No business ID available')
    }
  }, [businessId, fetchTables])

  return {
    tables,
    loading,
    error,
    refresh: fetchTables,
    createTable,
    updateTable,
    getTable,
    assignTable,
    releaseTable,
    checkTableAvailability
  }
}

// Hook for KDS (Kitchen Display System) orders
export const useKDSOrders = (businessId: string) => {
  const [kdsOrders, setKdsOrders] = useState<KDSOrderWithMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchKDSOrders = useCallback(async (params?: {
    station?: string
    status?: string
    active_only?: boolean
  }) => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      console.log('Fetching KDS orders with params:', params)
      const data = await FoodHospitalityOperationsService.listKdsOrdersApiV1FoodKdsOrdersGet(
        businessId,
        params?.station || null,
        params?.status || null,
        params?.active_only !== false
      )
      console.log('Fetched KDS orders:', data.length, 'orders')
      setKdsOrders(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch KDS orders')
      console.error('Error fetching KDS orders:', err)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  const createKDSOrder = useCallback(async (data: KDSOrderCreate) => {
    try {
      setError(null)
      configureAPI()
      
      const newKDSOrder = await FoodHospitalityOperationsService.createKdsOrderApiV1FoodKdsOrdersPost(data)
      setKdsOrders(prev => [newKDSOrder, ...prev])
      return newKDSOrder
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create KDS order'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateKDSOrder = useCallback(async (orderId: string, data: KDSOrderUpdate) => {
    try {
      setError(null)
      configureAPI()
      
      const updatedKDSOrder = await FoodHospitalityOperationsService.updateKdsOrderApiV1FoodKdsOrdersOrderIdPut(orderId, data)
      setKdsOrders(prev => prev.map(order => order.id === orderId ? updatedKDSOrder : order))
      return updatedKDSOrder
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update KDS order'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getKDSOrder = useCallback(async (orderId: string) => {
    try {
      setError(null)
      configureAPI()
      
      const kdsOrder = await FoodHospitalityOperationsService.getKdsOrderApiV1FoodKdsOrdersOrderIdGet(orderId)
      return kdsOrder
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get KDS order'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getKitchenPerformance = useCallback(async (startDate?: string, endDate?: string) => {
    try {
      setError(null)
      configureAPI()
      
      const performance = await FoodHospitalityOperationsService.getKitchenPerformanceApiV1FoodKdsPerformanceGet(
        businessId,
        startDate || null,
        endDate || null
      )
      return performance
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get kitchen performance'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [businessId])

  useEffect(() => {
    if (businessId) {
      fetchKDSOrders()
    }
  }, [businessId, fetchKDSOrders])

  return {
    kdsOrders,
    loading,
    error,
    refresh: fetchKDSOrders,
    createKDSOrder,
    updateKDSOrder,
    getKDSOrder,
    getKitchenPerformance
  }
}

// Hook for staff management
export const useStaffMembers = (businessId: string) => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStaffMembers = useCallback(async (params?: {
    status?: string
    position?: string
  }) => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      console.log('Fetching staff members with params:', params)
      const data = await FoodHospitalityOperationsService.listStaffMembersApiV1FoodStaffGet(
        businessId,
        params?.status || null,
        params?.position || null
      )
      console.log('Fetched staff members:', data.length, 'members')
      setStaffMembers(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch staff members')
      console.error('Error fetching staff members:', err)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  const createStaffMember = useCallback(async (data: StaffMemberCreate) => {
    try {
      setError(null)
      configureAPI()
      
      const newStaffMember = await FoodHospitalityOperationsService.createStaffMemberApiV1FoodStaffPost(data)
      setStaffMembers(prev => [newStaffMember, ...prev])
      return newStaffMember
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create staff member'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateStaffMember = useCallback(async (staffId: string, data: StaffMemberUpdate) => {
    try {
      setError(null)
      configureAPI()
      
      const updatedStaffMember = await FoodHospitalityOperationsService.updateStaffMemberApiV1FoodStaffStaffIdPut(staffId, data)
      setStaffMembers(prev => prev.map(staff => staff.id === staffId ? updatedStaffMember : staff))
      return updatedStaffMember
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update staff member'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getStaffMember = useCallback(async (staffId: string) => {
    try {
      setError(null)
      configureAPI()
      
      const staffMember = await FoodHospitalityOperationsService.getStaffMemberApiV1FoodStaffStaffIdGet(staffId)
      return staffMember
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get staff member'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  useEffect(() => {
    if (businessId) {
      fetchStaffMembers()
    }
  }, [businessId, fetchStaffMembers])

  return {
    staffMembers,
    loading,
    error,
    refresh: fetchStaffMembers,
    createStaffMember,
    updateStaffMember,
    getStaffMember
  }
}

// Hook for staff scheduling
export const useStaffSchedules = (businessId: string) => {
  const [schedules, setSchedules] = useState<StaffSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSchedules = useCallback(async (params?: {
    staff_id?: string
    start_date?: string
    end_date?: string
  }) => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      console.log('Fetching schedules with params:', params)
      const data = await FoodHospitalityOperationsService.listSchedulesApiV1FoodSchedulesGet(
        businessId,
        params?.staff_id || null,
        params?.start_date || null,
        params?.end_date || null
      )
      console.log('Fetched schedules:', data.length, 'schedules')
      setSchedules(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch schedules')
      console.error('Error fetching schedules:', err)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  const createSchedule = useCallback(async (data: StaffScheduleCreate) => {
    try {
      setError(null)
      configureAPI()
      
      const newSchedule = await FoodHospitalityOperationsService.createScheduleApiV1FoodSchedulesPost(data)
      setSchedules(prev => [newSchedule, ...prev])
      return newSchedule
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create schedule'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateSchedule = useCallback(async (scheduleId: string, data: StaffScheduleUpdate) => {
    try {
      setError(null)
      configureAPI()
      
      const updatedSchedule = await FoodHospitalityOperationsService.updateScheduleApiV1FoodSchedulesScheduleIdPut(scheduleId, data)
      setSchedules(prev => prev.map(schedule => schedule.id === scheduleId ? updatedSchedule : schedule))
      return updatedSchedule
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update schedule'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteSchedule = useCallback(async (scheduleId: string) => {
    try {
      setError(null)
      configureAPI()
      
      await FoodHospitalityOperationsService.deleteScheduleApiV1FoodSchedulesScheduleIdDelete(scheduleId)
      setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId))
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete schedule'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  useEffect(() => {
    if (businessId) {
      fetchSchedules()
    }
  }, [businessId, fetchSchedules])

  return {
    schedules,
    loading,
    error,
    refresh: fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule
  }
}

// Hook for time clock management
export const useTimeClock = (businessId: string) => {
  const [timeClockEntries, setTimeClockEntries] = useState<TimeClock[]>([])
  const [clockedInStaff, setClockedInStaff] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTimeClockEntries = useCallback(async (params?: {
    staff_id?: string
    start_date?: string
    end_date?: string
  }) => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      console.log('Fetching time clock entries with params:', params)
      const data = await FoodHospitalityOperationsService.listTimeClockEntriesApiV1FoodTimeClockGet(
        businessId,
        params?.staff_id || null,
        params?.start_date || null,
        params?.end_date || null
      )
      console.log('Fetched time clock entries:', data.length, 'entries')
      setTimeClockEntries(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch time clock entries')
      console.error('Error fetching time clock entries:', err)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  const fetchClockedInStaff = useCallback(async () => {
    try {
      setError(null)
      configureAPI()
      
      const data = await FoodHospitalityOperationsService.getClockedInStaffApiV1FoodTimeClockActiveGet(businessId)
      console.log('Fetched clocked-in staff:', data.length, 'staff')
      setClockedInStaff(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch clocked-in staff')
      console.error('Error fetching clocked-in staff:', err)
    }
  }, [businessId])

  const clockIn = useCallback(async (data: TimeClockCreate) => {
    try {
      setError(null)
      configureAPI()
      
      const clockInEntry = await FoodHospitalityOperationsService.clockInApiV1FoodTimeClockClockInPost(data)
      await fetchClockedInStaff() // Refresh clocked-in staff
      return clockInEntry
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to clock in'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [fetchClockedInStaff])

  const clockOut = useCallback(async (clockId: string, clockOutTime?: string) => {
    try {
      setError(null)
      configureAPI()
      
      const clockOutEntry = await FoodHospitalityOperationsService.clockOutApiV1FoodTimeClockClockIdClockOutPut(
        clockId,
        clockOutTime || null
      )
      await fetchClockedInStaff() // Refresh clocked-in staff
      return clockOutEntry
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to clock out'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [fetchClockedInStaff])

  useEffect(() => {
    if (businessId) {
      fetchTimeClockEntries()
      fetchClockedInStaff()
    }
  }, [businessId, fetchTimeClockEntries, fetchClockedInStaff])

  return {
    timeClockEntries,
    clockedInStaff,
    loading,
    error,
    refresh: fetchTimeClockEntries,
    refreshClockedInStaff: fetchClockedInStaff,
    clockIn,
    clockOut
  }
}

// Hook for operations dashboard
export const useOperationsDashboard = (businessId: string) => {
  const [dashboard, setDashboard] = useState<OperationsDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = useCallback(async (locationId?: string) => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      console.log('Fetching operations dashboard for business:', businessId, 'location:', locationId)
      const data = await FoodHospitalityOperationsService.getOperationsDashboardApiV1FoodDashboardBusinessIdGet(
        businessId,
        locationId || null
      )
      console.log('Fetched operations dashboard:', data)
      setDashboard(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch operations dashboard')
      console.error('Error fetching operations dashboard:', err)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  useEffect(() => {
    if (businessId) {
      fetchDashboard()
    }
  }, [businessId, fetchDashboard])

  return {
    dashboard,
    loading,
    error,
    refresh: fetchDashboard
  }
}

// Hook for operations analytics
export const useOperationsAnalytics = (businessId: string) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeTableTurnover = useCallback(async (startDate: string, endDate: string) => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      const turnoverData = await FoodHospitalityOperationsService.analyzeTableTurnoverApiV1FoodAnalyticsTableTurnoverGet(
        businessId,
        startDate,
        endDate
      )
      return turnoverData
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to analyze table turnover'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  const analyzeLaborCosts = useCallback(async (startDate: string, endDate: string) => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      const laborData = await FoodHospitalityOperationsService.analyzeLaborCostsApiV1FoodAnalyticsLaborCostsGet(
        businessId,
        startDate,
        endDate
      )
      return laborData
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to analyze labor costs'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  return {
    loading,
    error,
    analyzeTableTurnover,
    analyzeLaborCosts,
    clearError: () => setError(null)
  }
}

// Combined hook for complete operations management
export const useOperationsManagement = (businessId: string) => {
  const locations = useLocations(businessId)
  const floorPlans = useFloorPlans(businessId)
  const tables = useTables(businessId)
  const kdsOrders = useKDSOrders(businessId)
  const staffMembers = useStaffMembers(businessId)
  const schedules = useStaffSchedules(businessId)
  const timeClock = useTimeClock(businessId)
  const dashboard = useOperationsDashboard(businessId)
  const analytics = useOperationsAnalytics(businessId)

  const refreshAll = useCallback(async () => {
    await Promise.all([
      locations.refresh(),
      floorPlans.refresh(),
      tables.refresh(),
      kdsOrders.refresh(),
      staffMembers.refresh(),
      schedules.refresh(),
      timeClock.refresh(),
      dashboard.refresh()
    ])
  }, [
    locations.refresh,
    floorPlans.refresh,
    tables.refresh,
    kdsOrders.refresh,
    staffMembers.refresh,
    schedules.refresh,
    timeClock.refresh,
    dashboard.refresh
  ])

  return {
    // Core operations management
    locations,
    floorPlans,
    tables,
    kdsOrders,
    
    // Staff management
    staffMembers,
    schedules,
    timeClock,
    
    // Dashboard and analytics
    dashboard,
    analytics,
    
    // Combined operations
    refreshAll,
    
    // Loading and error states
    loading: locations.loading || floorPlans.loading || tables.loading || kdsOrders.loading || 
             staffMembers.loading || schedules.loading || timeClock.loading || dashboard.loading || analytics.loading,
    error: locations.error || floorPlans.error || tables.error || kdsOrders.error || 
           staffMembers.error || schedules.error || timeClock.error || dashboard.error || analytics.error
  }
}
