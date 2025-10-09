/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FloorPlan } from '../models/FloorPlan';
import type { FloorPlanCreate } from '../models/FloorPlanCreate';
import type { FloorPlanUpdate } from '../models/FloorPlanUpdate';
import type { KDSOrder } from '../models/KDSOrder';
import type { KDSOrderCreate } from '../models/KDSOrderCreate';
import type { KDSOrderUpdate } from '../models/KDSOrderUpdate';
import type { KDSOrderWithMetrics } from '../models/KDSOrderWithMetrics';
import type { Location } from '../models/Location';
import type { LocationCreate } from '../models/LocationCreate';
import type { LocationUpdate } from '../models/LocationUpdate';
import type { OperationsDashboard } from '../models/OperationsDashboard';
import type { StaffMember } from '../models/StaffMember';
import type { StaffMemberCreate } from '../models/StaffMemberCreate';
import type { StaffMemberUpdate } from '../models/StaffMemberUpdate';
import type { StaffSchedule } from '../models/StaffSchedule';
import type { StaffScheduleCreate } from '../models/StaffScheduleCreate';
import type { StaffScheduleUpdate } from '../models/StaffScheduleUpdate';
import type { Table } from '../models/Table';
import type { TableAssignment } from '../models/TableAssignment';
import type { TableCreate } from '../models/TableCreate';
import type { TableUpdate } from '../models/TableUpdate';
import type { TableWithDetails } from '../models/TableWithDetails';
import type { TimeClock } from '../models/TimeClock';
import type { TimeClockCreate } from '../models/TimeClockCreate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FoodHospitalityOperationsService {
    /**
     * Create Location
     * Create new location for multi-location businesses
     * @param requestBody
     * @returns Location Successful Response
     * @throws ApiError
     */
    public static createLocationApiV1FoodLocationsPost(
        requestBody: LocationCreate,
    ): CancelablePromise<Location> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/food/locations',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Locations
     * List all locations
     * @param businessId
     * @param isActive
     * @returns Location Successful Response
     * @throws ApiError
     */
    public static listLocationsApiV1FoodLocationsGet(
        businessId: string,
        isActive?: (boolean | null),
    ): CancelablePromise<Array<Location>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/locations',
            query: {
                'business_id': businessId,
                'is_active': isActive,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Location
     * Get location details
     * @param locationId
     * @returns Location Successful Response
     * @throws ApiError
     */
    public static getLocationApiV1FoodLocationsLocationIdGet(
        locationId: string,
    ): CancelablePromise<Location> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/locations/{location_id}',
            path: {
                'location_id': locationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Location
     * Update location
     * @param locationId
     * @param requestBody
     * @returns Location Successful Response
     * @throws ApiError
     */
    public static updateLocationApiV1FoodLocationsLocationIdPut(
        locationId: string,
        requestBody: LocationUpdate,
    ): CancelablePromise<Location> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/food/locations/{location_id}',
            path: {
                'location_id': locationId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Floor Plan
     * Create floor plan with visual layout
     *
     * - **Visual designer**: Drag-and-drop table placement
     * - **Multiple plans**: Different layouts for different times
     * @param requestBody
     * @returns FloorPlan Successful Response
     * @throws ApiError
     */
    public static createFloorPlanApiV1FoodFloorPlansPost(
        requestBody: FloorPlanCreate,
    ): CancelablePromise<FloorPlan> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/food/floor-plans',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Floor Plans
     * List floor plans
     * @param businessId
     * @param locationId
     * @returns FloorPlan Successful Response
     * @throws ApiError
     */
    public static listFloorPlansApiV1FoodFloorPlansGet(
        businessId: string,
        locationId?: (string | null),
    ): CancelablePromise<Array<FloorPlan>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/floor-plans',
            query: {
                'business_id': businessId,
                'location_id': locationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Floor Plan
     * Get floor plan with layout data
     * @param planId
     * @returns FloorPlan Successful Response
     * @throws ApiError
     */
    public static getFloorPlanApiV1FoodFloorPlansPlanIdGet(
        planId: string,
    ): CancelablePromise<FloorPlan> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/floor-plans/{plan_id}',
            path: {
                'plan_id': planId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Floor Plan
     * Update floor plan layout
     * @param planId
     * @param requestBody
     * @returns FloorPlan Successful Response
     * @throws ApiError
     */
    public static updateFloorPlanApiV1FoodFloorPlansPlanIdPut(
        planId: string,
        requestBody: FloorPlanUpdate,
    ): CancelablePromise<FloorPlan> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/food/floor-plans/{plan_id}',
            path: {
                'plan_id': planId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Table
     * Create new table
     * @param requestBody
     * @returns Table Successful Response
     * @throws ApiError
     */
    public static createTableApiV1FoodTablesPost(
        requestBody: TableCreate,
    ): CancelablePromise<Table> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/food/tables',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Tables
     * List tables with real-time status
     *
     * - **Live status**: Available, occupied, reserved
     * - **Occupancy**: Current order and duration
     * - **Filtering**: By location and status
     * @param businessId
     * @param locationId
     * @param status
     * @param includeDetails
     * @returns TableWithDetails Successful Response
     * @throws ApiError
     */
    public static listTablesApiV1FoodTablesGet(
        businessId: string,
        locationId?: (string | null),
        status?: (string | null),
        includeDetails: boolean = true,
    ): CancelablePromise<Array<TableWithDetails>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/tables',
            query: {
                'business_id': businessId,
                'location_id': locationId,
                'status': status,
                'include_details': includeDetails,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Table
     * Get table with full details
     * @param tableId
     * @returns TableWithDetails Successful Response
     * @throws ApiError
     */
    public static getTableApiV1FoodTablesTableIdGet(
        tableId: string,
    ): CancelablePromise<TableWithDetails> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/tables/{table_id}',
            path: {
                'table_id': tableId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Table
     * Update table details or status
     * @param tableId
     * @param requestBody
     * @returns Table Successful Response
     * @throws ApiError
     */
    public static updateTableApiV1FoodTablesTableIdPut(
        tableId: string,
        requestBody: TableUpdate,
    ): CancelablePromise<Table> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/food/tables/{table_id}',
            path: {
                'table_id': tableId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Assign Table
     * Assign table to order
     *
     * - **Capacity check**: Validate party size
     * - **Status update**: Mark table as occupied
     * - **Tracking**: Start occupancy timer
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static assignTableApiV1FoodTablesAssignPost(
        requestBody: TableAssignment,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/food/tables/assign',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Release Table
     * Release table after service
     *
     * - **Status update**: Mark as cleaning or available
     * - **Metrics**: Calculate table turnover time
     * @param tableId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static releaseTableApiV1FoodTablesTableIdReleasePost(
        tableId: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/food/tables/{table_id}/release',
            path: {
                'table_id': tableId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Check Table Availability
     * Check table availability for reservations
     *
     * - **Capacity matching**: Find suitable tables
     * - **Time-based**: Check future availability
     * - **Combining tables**: Suggest table combinations
     * @param businessId
     * @param partySize
     * @param locationId
     * @param timeSlot
     * @returns Table Successful Response
     * @throws ApiError
     */
    public static checkTableAvailabilityApiV1FoodTablesAvailabilityGet(
        businessId: string,
        partySize: number,
        locationId?: (string | null),
        timeSlot?: (string | null),
    ): CancelablePromise<Array<Table>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/tables/availability',
            query: {
                'business_id': businessId,
                'location_id': locationId,
                'party_size': partySize,
                'time_slot': timeSlot,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Kds Order
     * Send order to kitchen
     *
     * - **Station routing**: Route to appropriate kitchen station
     * - **Priority**: Set order priority
     * - **Timing**: Calculate target completion time
     * @param requestBody
     * @returns KDSOrder Successful Response
     * @throws ApiError
     */
    public static createKdsOrderApiV1FoodKdsOrdersPost(
        requestBody: KDSOrderCreate,
    ): CancelablePromise<KDSOrder> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/food/kds/orders',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Kds Orders
     * List kitchen orders with metrics
     *
     * - **Real-time**: Live order status
     * - **Metrics**: Prep time, delays
     * - **Filtering**: By station and status
     * @param businessId
     * @param station
     * @param status
     * @param activeOnly
     * @returns KDSOrderWithMetrics Successful Response
     * @throws ApiError
     */
    public static listKdsOrdersApiV1FoodKdsOrdersGet(
        businessId: string,
        station?: (string | null),
        status?: (string | null),
        activeOnly: boolean = true,
    ): CancelablePromise<Array<KDSOrderWithMetrics>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/kds/orders',
            query: {
                'business_id': businessId,
                'station': station,
                'status': status,
                'active_only': activeOnly,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Kds Order
     * Get KDS order with metrics
     * @param orderId
     * @returns KDSOrderWithMetrics Successful Response
     * @throws ApiError
     */
    public static getKdsOrderApiV1FoodKdsOrdersOrderIdGet(
        orderId: string,
    ): CancelablePromise<KDSOrderWithMetrics> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/kds/orders/{order_id}',
            path: {
                'order_id': orderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Kds Order
     * Update KDS order status
     *
     * - **Status transitions**: pending → preparing → ready → served
     * - **Timing**: Track prep start/end times
     * - **Notifications**: Alert servers when ready
     * @param orderId
     * @param requestBody
     * @returns KDSOrder Successful Response
     * @throws ApiError
     */
    public static updateKdsOrderApiV1FoodKdsOrdersOrderIdPut(
        orderId: string,
        requestBody: KDSOrderUpdate,
    ): CancelablePromise<KDSOrder> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/food/kds/orders/{order_id}',
            path: {
                'order_id': orderId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Kitchen Performance
     * Analyze kitchen performance
     *
     * - **Prep times**: Average and by item
     * - **Efficiency**: Orders per hour
     * - **Delays**: Late orders analysis
     * @param businessId
     * @param startDate
     * @param endDate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getKitchenPerformanceApiV1FoodKdsPerformanceGet(
        businessId: string,
        startDate?: (string | null),
        endDate?: (string | null),
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/kds/performance',
            query: {
                'business_id': businessId,
                'start_date': startDate,
                'end_date': endDate,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Staff Member
     * Create new staff member
     * @param requestBody
     * @returns StaffMember Successful Response
     * @throws ApiError
     */
    public static createStaffMemberApiV1FoodStaffPost(
        requestBody: StaffMemberCreate,
    ): CancelablePromise<StaffMember> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/food/staff',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Staff Members
     * List staff members
     * @param businessId
     * @param status
     * @param position
     * @returns StaffMember Successful Response
     * @throws ApiError
     */
    public static listStaffMembersApiV1FoodStaffGet(
        businessId: string,
        status?: (string | null),
        position?: (string | null),
    ): CancelablePromise<Array<StaffMember>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/staff',
            query: {
                'business_id': businessId,
                'status': status,
                'position': position,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Staff Member
     * Get staff member details
     * @param staffId
     * @returns StaffMember Successful Response
     * @throws ApiError
     */
    public static getStaffMemberApiV1FoodStaffStaffIdGet(
        staffId: string,
    ): CancelablePromise<StaffMember> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/staff/{staff_id}',
            path: {
                'staff_id': staffId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Staff Member
     * Update staff member
     * @param staffId
     * @param requestBody
     * @returns StaffMember Successful Response
     * @throws ApiError
     */
    public static updateStaffMemberApiV1FoodStaffStaffIdPut(
        staffId: string,
        requestBody: StaffMemberUpdate,
    ): CancelablePromise<StaffMember> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/food/staff/{staff_id}',
            path: {
                'staff_id': staffId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Schedule
     * Create staff schedule
     * @param requestBody
     * @returns StaffSchedule Successful Response
     * @throws ApiError
     */
    public static createScheduleApiV1FoodSchedulesPost(
        requestBody: StaffScheduleCreate,
    ): CancelablePromise<StaffSchedule> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/food/schedules',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Schedules
     * List staff schedules
     * @param businessId
     * @param staffId
     * @param startDate
     * @param endDate
     * @returns StaffSchedule Successful Response
     * @throws ApiError
     */
    public static listSchedulesApiV1FoodSchedulesGet(
        businessId: string,
        staffId?: (string | null),
        startDate?: (string | null),
        endDate?: (string | null),
    ): CancelablePromise<Array<StaffSchedule>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/schedules',
            query: {
                'business_id': businessId,
                'staff_id': staffId,
                'start_date': startDate,
                'end_date': endDate,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Schedule
     * Update staff schedule
     * @param scheduleId
     * @param requestBody
     * @returns StaffSchedule Successful Response
     * @throws ApiError
     */
    public static updateScheduleApiV1FoodSchedulesScheduleIdPut(
        scheduleId: string,
        requestBody: StaffScheduleUpdate,
    ): CancelablePromise<StaffSchedule> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/food/schedules/{schedule_id}',
            path: {
                'schedule_id': scheduleId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Schedule
     * Delete staff schedule
     * @param scheduleId
     * @returns void
     * @throws ApiError
     */
    public static deleteScheduleApiV1FoodSchedulesScheduleIdDelete(
        scheduleId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/food/schedules/{schedule_id}',
            path: {
                'schedule_id': scheduleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Clock In
     * Clock in staff member
     *
     * - **Validation**: Check scheduled shift
     * - **Location**: Track clock-in location
     * - **Notifications**: Alert manager of early/late clock-in
     * @param requestBody
     * @returns TimeClock Successful Response
     * @throws ApiError
     */
    public static clockInApiV1FoodTimeClockClockInPost(
        requestBody: TimeClockCreate,
    ): CancelablePromise<TimeClock> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/food/time-clock/clock-in',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Clock Out
     * Clock out staff member
     *
     * - **Hours calculation**: Auto-calculate total hours
     * - **Overtime**: Detect and flag overtime
     * - **Breaks**: Account for break time
     * @param clockId
     * @param clockOutTime
     * @returns TimeClock Successful Response
     * @throws ApiError
     */
    public static clockOutApiV1FoodTimeClockClockIdClockOutPut(
        clockId: string,
        clockOutTime?: (string | null),
    ): CancelablePromise<TimeClock> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/food/time-clock/{clock_id}/clock-out',
            path: {
                'clock_id': clockId,
            },
            query: {
                'clock_out_time': clockOutTime,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Time Clock Entries
     * List time clock entries
     * @param businessId
     * @param staffId
     * @param startDate
     * @param endDate
     * @returns TimeClock Successful Response
     * @throws ApiError
     */
    public static listTimeClockEntriesApiV1FoodTimeClockGet(
        businessId: string,
        staffId?: (string | null),
        startDate?: (string | null),
        endDate?: (string | null),
    ): CancelablePromise<Array<TimeClock>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/time-clock',
            query: {
                'business_id': businessId,
                'staff_id': staffId,
                'start_date': startDate,
                'end_date': endDate,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Clocked In Staff
     * Get currently clocked-in staff
     *
     * - **Real-time**: Who's working now
     * - **Duration**: How long they've been clocked in
     * - **Position**: Current role/station
     * @param businessId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getClockedInStaffApiV1FoodTimeClockActiveGet(
        businessId: string,
    ): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/time-clock/active',
            query: {
                'business_id': businessId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Operations Dashboard
     * Real-time operations dashboard
     *
     * - **Tables**: Live table status
     * - **Kitchen**: Active orders and prep times
     * - **Staff**: Who's working, breaks, etc.
     * - **Orders**: Today's order metrics
     * - **Revenue**: Real-time revenue tracking
     * @param businessId
     * @param locationId
     * @returns OperationsDashboard Successful Response
     * @throws ApiError
     */
    public static getOperationsDashboardApiV1FoodDashboardBusinessIdGet(
        businessId: string,
        locationId?: (string | null),
    ): CancelablePromise<OperationsDashboard> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/dashboard/{business_id}',
            path: {
                'business_id': businessId,
            },
            query: {
                'location_id': locationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Analyze Table Turnover
     * Analyze table turnover rates
     *
     * - **Average turnover**: Time per table
     * - **By time of day**: Peak vs. off-peak
     * - **By table**: Identify slow tables
     * @param businessId
     * @param startDate
     * @param endDate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static analyzeTableTurnoverApiV1FoodAnalyticsTableTurnoverGet(
        businessId: string,
        startDate: string,
        endDate: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/analytics/table-turnover',
            query: {
                'business_id': businessId,
                'start_date': startDate,
                'end_date': endDate,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Analyze Labor Costs
     * Analyze labor costs
     *
     * - **Total costs**: Labor expense for period
     * - **Labor percentage**: % of revenue
     * - **Overtime**: Overtime costs
     * - **By position**: Cost breakdown
     * @param businessId
     * @param startDate
     * @param endDate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static analyzeLaborCostsApiV1FoodAnalyticsLaborCostsGet(
        businessId: string,
        startDate: string,
        endDate: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/analytics/labor-costs',
            query: {
                'business_id': businessId,
                'start_date': startDate,
                'end_date': endDate,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
