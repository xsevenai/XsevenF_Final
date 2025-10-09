/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppointmentCreate } from '../models/AppointmentCreate';
import type { AppointmentResponse } from '../models/AppointmentResponse';
import type { AppointmentUpdate } from '../models/AppointmentUpdate';
import type { ServiceCreate } from '../models/ServiceCreate';
import type { ServiceResponse } from '../models/ServiceResponse';
import type { ServiceUpdate } from '../models/ServiceUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ServiceBasedTemplateService {
    /**
     * Create Service Simple
     * Create a new service offering (simplified)
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createServiceSimpleApiV1ServiceBasedServicesPost(
        requestBody: Record<string, any>,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/service-based/services',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Services Simple
     * List all services for a business (simplified)
     * @param businessId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listServicesSimpleApiV1ServiceBasedServicesGet(
        businessId: string,
    ): CancelablePromise<Array<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/service-based/services',
            query: {
                'business_id': businessId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Service
     * Create a new service offering
     * @param requestBody
     * @returns ServiceResponse Successful Response
     * @throws ApiError
     */
    public static createServiceApiV1ServiceBasedOfferingsPost(
        requestBody: ServiceCreate,
    ): CancelablePromise<ServiceResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/service-based/offerings',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Services
     * List all service offerings for a business
     * @param businessId Business ID
     * @param category Filter by category
     * @param isActive Filter by active status
     * @param limit
     * @param offset
     * @returns ServiceResponse Successful Response
     * @throws ApiError
     */
    public static listServicesApiV1ServiceBasedOfferingsGet(
        businessId: string,
        category?: (string | null),
        isActive?: (boolean | null),
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<Array<ServiceResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/service-based/offerings',
            query: {
                'business_id': businessId,
                'category': category,
                'is_active': isActive,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Service Category Simple
     * Create service category (simplified)
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createServiceCategorySimpleApiV1ServiceBasedServiceCategoriesPost(
        requestBody: Record<string, any>,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/service-based/service-categories',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Service
     * Get a specific service offering by ID
     * @param serviceId
     * @returns ServiceResponse Successful Response
     * @throws ApiError
     */
    public static getServiceApiV1ServiceBasedOfferingsServiceIdGet(
        serviceId: string,
    ): CancelablePromise<ServiceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/service-based/offerings/{service_id}',
            path: {
                'service_id': serviceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Service
     * Update a service offering
     * @param serviceId
     * @param requestBody
     * @returns ServiceResponse Successful Response
     * @throws ApiError
     */
    public static updateServiceApiV1ServiceBasedOfferingsServiceIdPut(
        serviceId: string,
        requestBody: ServiceUpdate,
    ): CancelablePromise<ServiceResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/service-based/offerings/{service_id}',
            path: {
                'service_id': serviceId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Service
     * Delete a service offering
     * @param serviceId
     * @returns void
     * @throws ApiError
     */
    public static deleteServiceApiV1ServiceBasedOfferingsServiceIdDelete(
        serviceId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/service-based/offerings/{service_id}',
            path: {
                'service_id': serviceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Appointment Flexible
     * Create appointment (enterprise-grade flexible endpoint)
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createAppointmentFlexibleApiV1ServiceBasedAppointmentsPost(
        requestBody: Record<string, any>,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/service-based/appointments',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Appointments
     * List all appointments for a business
     * @param businessId Business ID
     * @param clientId Filter by client
     * @param staffId Filter by staff
     * @param status Filter by status
     * @param startDate Filter from date
     * @param endDate Filter to date
     * @param limit
     * @param offset
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listAppointmentsApiV1ServiceBasedAppointmentsGet(
        businessId: string,
        clientId?: (string | null),
        staffId?: (string | null),
        status?: (string | null),
        startDate?: (string | null),
        endDate?: (string | null),
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<Array<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/service-based/appointments',
            query: {
                'business_id': businessId,
                'client_id': clientId,
                'staff_id': staffId,
                'status': status,
                'start_date': startDate,
                'end_date': endDate,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Appointment
     * Create a new appointment (strict validation)
     * @param requestBody
     * @returns AppointmentResponse Successful Response
     * @throws ApiError
     */
    public static createAppointmentApiV1ServiceBasedAppointmentsStrictPost(
        requestBody: AppointmentCreate,
    ): CancelablePromise<AppointmentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/service-based/appointments/strict',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Appointment
     * Get a specific appointment by ID
     * @param appointmentId
     * @returns AppointmentResponse Successful Response
     * @throws ApiError
     */
    public static getAppointmentApiV1ServiceBasedAppointmentsAppointmentIdGet(
        appointmentId: string,
    ): CancelablePromise<AppointmentResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/service-based/appointments/{appointment_id}',
            path: {
                'appointment_id': appointmentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Appointment
     * Update an appointment
     * @param appointmentId
     * @param requestBody
     * @returns AppointmentResponse Successful Response
     * @throws ApiError
     */
    public static updateAppointmentApiV1ServiceBasedAppointmentsAppointmentIdPut(
        appointmentId: string,
        requestBody: AppointmentUpdate,
    ): CancelablePromise<AppointmentResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/service-based/appointments/{appointment_id}',
            path: {
                'appointment_id': appointmentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Appointment
     * Cancel/Delete an appointment
     * @param appointmentId
     * @returns void
     * @throws ApiError
     */
    public static deleteAppointmentApiV1ServiceBasedAppointmentsAppointmentIdDelete(
        appointmentId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/service-based/appointments/{appointment_id}',
            path: {
                'appointment_id': appointmentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Service Package
     * Create a service package (bundle multiple services)
     *
     * Example: "Spa Day Package" includes massage + facial + manicure
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createServicePackageApiV1ServiceBasedPackagesPost(
        requestBody: Record<string, any>,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/service-based/packages',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Service Packages
     * List all service packages
     * @param businessId Business ID
     * @param isActive Filter by active status
     * @param limit
     * @param offset
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listServicePackagesApiV1ServiceBasedPackagesGet(
        businessId: string,
        isActive?: (boolean | null),
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<Array<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/service-based/packages',
            query: {
                'business_id': businessId,
                'is_active': isActive,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Service Package
     * Get service package by ID
     * @param packageId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getServicePackageApiV1ServiceBasedPackagesPackageIdGet(
        packageId: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/service-based/packages/{package_id}',
            path: {
                'package_id': packageId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Service Package
     * Update service package
     * @param packageId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateServicePackageApiV1ServiceBasedPackagesPackageIdPut(
        packageId: string,
        requestBody: Record<string, any>,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/service-based/packages/{package_id}',
            path: {
                'package_id': packageId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Service Package
     * Delete service package
     * @param packageId
     * @returns void
     * @throws ApiError
     */
    public static deleteServicePackageApiV1ServiceBasedPackagesPackageIdDelete(
        packageId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/service-based/packages/{package_id}',
            path: {
                'package_id': packageId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Membership Plan
     * Create membership plan (monthly gym membership, salon VIP, etc.)
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createMembershipPlanApiV1ServiceBasedMembershipsPost(
        requestBody: Record<string, any>,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/service-based/memberships',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Membership Plans
     * List all membership plans
     * @param businessId Business ID
     * @param isActive
     * @param limit
     * @param offset
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listMembershipPlansApiV1ServiceBasedMembershipsGet(
        businessId: string,
        isActive?: (boolean | null),
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<Array<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/service-based/memberships',
            query: {
                'business_id': businessId,
                'is_active': isActive,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Membership Plan
     * Get membership plan by ID
     * @param membershipId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getMembershipPlanApiV1ServiceBasedMembershipsMembershipIdGet(
        membershipId: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/service-based/memberships/{membership_id}',
            path: {
                'membership_id': membershipId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Membership Plan
     * Update membership plan
     * @param membershipId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateMembershipPlanApiV1ServiceBasedMembershipsMembershipIdPut(
        membershipId: string,
        requestBody: Record<string, any>,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/service-based/memberships/{membership_id}',
            path: {
                'membership_id': membershipId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Membership Plan
     * Delete membership plan
     * @param membershipId
     * @returns void
     * @throws ApiError
     */
    public static deleteMembershipPlanApiV1ServiceBasedMembershipsMembershipIdDelete(
        membershipId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/service-based/memberships/{membership_id}',
            path: {
                'membership_id': membershipId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Class Session
     * Create class/group session (yoga class, spin class, group training)
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createClassSessionApiV1ServiceBasedClassesPost(
        requestBody: Record<string, any>,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/service-based/classes',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Class Sessions
     * List all class sessions
     * @param businessId Business ID
     * @param instructorId
     * @param startDate
     * @param endDate
     * @param limit
     * @param offset
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listClassSessionsApiV1ServiceBasedClassesGet(
        businessId: string,
        instructorId?: (string | null),
        startDate?: (string | null),
        endDate?: (string | null),
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<Array<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/service-based/classes',
            query: {
                'business_id': businessId,
                'instructor_id': instructorId,
                'start_date': startDate,
                'end_date': endDate,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Book Class Session
     * Book a spot in a class session
     * @param classId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static bookClassSessionApiV1ServiceBasedClassesClassIdBookPost(
        classId: string,
        requestBody: Record<string, any>,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/service-based/classes/{class_id}/book',
            path: {
                'class_id': classId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add To Waitlist
     * Add customer to waitlist when appointments are full
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static addToWaitlistApiV1ServiceBasedWaitlistPost(
        requestBody: Record<string, any>,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/service-based/waitlist',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Waitlist
     * List waitlist entries
     * @param businessId Business ID
     * @param status
     * @param limit
     * @param offset
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listWaitlistApiV1ServiceBasedWaitlistGet(
        businessId: string,
        status?: (string | null),
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<Array<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/service-based/waitlist',
            query: {
                'business_id': businessId,
                'status': status,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Convert Waitlist To Appointment
     * Convert waitlist entry to actual appointment
     * @param entryId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static convertWaitlistToAppointmentApiV1ServiceBasedWaitlistEntryIdConvertPut(
        entryId: string,
        requestBody: Record<string, any>,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/service-based/waitlist/{entry_id}/convert',
            path: {
                'entry_id': entryId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Appointment Trends
     * Analyze appointment booking trends
     * @param businessId
     * @param startDate
     * @param endDate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAppointmentTrendsApiV1ServiceBasedAnalyticsAppointmentTrendsGet(
        businessId: string,
        startDate?: (string | null),
        endDate?: (string | null),
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/service-based/analytics/appointment-trends',
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
     * Get Service Performance
     * Analyze which services are most popular
     * @param businessId
     * @param startDate
     * @param endDate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getServicePerformanceApiV1ServiceBasedAnalyticsServicePerformanceGet(
        businessId: string,
        startDate?: (string | null),
        endDate?: (string | null),
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/service-based/analytics/service-performance',
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
     * Get No Show Rate
     * Calculate no-show and cancellation rates
     * @param businessId
     * @param startDate
     * @param endDate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getNoShowRateApiV1ServiceBasedAnalyticsNoShowRateGet(
        businessId: string,
        startDate?: (string | null),
        endDate?: (string | null),
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/service-based/analytics/no-show-rate',
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
     * Get Staff Utilization
     * Analyze staff booking utilization
     * @param businessId
     * @param startDate
     * @param endDate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getStaffUtilizationApiV1ServiceBasedAnalyticsStaffUtilizationGet(
        businessId: string,
        startDate?: (string | null),
        endDate?: (string | null),
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/service-based/analytics/staff-utilization',
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
