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
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createServiceSimpleApiV1ServiceBasedServicesPost({
        requestBody,
    }: {
        requestBody: Record<string, any>,
    }): CancelablePromise<Record<string, any>> {
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
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listServicesSimpleApiV1ServiceBasedServicesGet({
        businessId,
    }: {
        businessId: string,
    }): CancelablePromise<Array<any>> {
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
     * @returns ServiceResponse Successful Response
     * @throws ApiError
     */
    public static createServiceApiV1ServiceBasedOfferingsPost({
        requestBody,
    }: {
        requestBody: ServiceCreate,
    }): CancelablePromise<ServiceResponse> {
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
     * @returns ServiceResponse Successful Response
     * @throws ApiError
     */
    public static listServicesApiV1ServiceBasedOfferingsGet({
        businessId,
        category,
        isActive,
        limit = 100,
        offset,
    }: {
        /**
         * Business ID
         */
        businessId: string,
        /**
         * Filter by category
         */
        category?: (string | null),
        /**
         * Filter by active status
         */
        isActive?: (boolean | null),
        limit?: number,
        offset?: number,
    }): CancelablePromise<Array<ServiceResponse>> {
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
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createServiceCategorySimpleApiV1ServiceBasedServiceCategoriesPost({
        requestBody,
    }: {
        requestBody: Record<string, any>,
    }): CancelablePromise<Record<string, any>> {
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
     * @returns ServiceResponse Successful Response
     * @throws ApiError
     */
    public static getServiceApiV1ServiceBasedOfferingsServiceIdGet({
        serviceId,
    }: {
        serviceId: string,
    }): CancelablePromise<ServiceResponse> {
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
     * @returns ServiceResponse Successful Response
     * @throws ApiError
     */
    public static updateServiceApiV1ServiceBasedOfferingsServiceIdPut({
        serviceId,
        requestBody,
    }: {
        serviceId: string,
        requestBody: ServiceUpdate,
    }): CancelablePromise<ServiceResponse> {
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
     * @returns void
     * @throws ApiError
     */
    public static deleteServiceApiV1ServiceBasedOfferingsServiceIdDelete({
        serviceId,
    }: {
        serviceId: string,
    }): CancelablePromise<void> {
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
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createAppointmentFlexibleApiV1ServiceBasedAppointmentsPost({
        requestBody,
    }: {
        requestBody: Record<string, any>,
    }): CancelablePromise<Record<string, any>> {
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
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listAppointmentsApiV1ServiceBasedAppointmentsGet({
        businessId,
        clientId,
        staffId,
        status,
        startDate,
        endDate,
        limit = 100,
        offset,
    }: {
        /**
         * Business ID
         */
        businessId: string,
        /**
         * Filter by client
         */
        clientId?: (string | null),
        /**
         * Filter by staff
         */
        staffId?: (string | null),
        /**
         * Filter by status
         */
        status?: (string | null),
        /**
         * Filter from date
         */
        startDate?: (string | null),
        /**
         * Filter to date
         */
        endDate?: (string | null),
        limit?: number,
        offset?: number,
    }): CancelablePromise<Array<any>> {
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
     * @returns AppointmentResponse Successful Response
     * @throws ApiError
     */
    public static createAppointmentApiV1ServiceBasedAppointmentsStrictPost({
        requestBody,
    }: {
        requestBody: AppointmentCreate,
    }): CancelablePromise<AppointmentResponse> {
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
     * @returns AppointmentResponse Successful Response
     * @throws ApiError
     */
    public static getAppointmentApiV1ServiceBasedAppointmentsAppointmentIdGet({
        appointmentId,
    }: {
        appointmentId: string,
    }): CancelablePromise<AppointmentResponse> {
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
     * @returns AppointmentResponse Successful Response
     * @throws ApiError
     */
    public static updateAppointmentApiV1ServiceBasedAppointmentsAppointmentIdPut({
        appointmentId,
        requestBody,
    }: {
        appointmentId: string,
        requestBody: AppointmentUpdate,
    }): CancelablePromise<AppointmentResponse> {
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
     * @returns void
     * @throws ApiError
     */
    public static deleteAppointmentApiV1ServiceBasedAppointmentsAppointmentIdDelete({
        appointmentId,
    }: {
        appointmentId: string,
    }): CancelablePromise<void> {
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
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createServicePackageApiV1ServiceBasedPackagesPost({
        requestBody,
    }: {
        requestBody: Record<string, any>,
    }): CancelablePromise<Record<string, any>> {
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
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listServicePackagesApiV1ServiceBasedPackagesGet({
        businessId,
        isActive,
        limit = 100,
        offset,
    }: {
        /**
         * Business ID
         */
        businessId: string,
        /**
         * Filter by active status
         */
        isActive?: (boolean | null),
        limit?: number,
        offset?: number,
    }): CancelablePromise<Array<any>> {
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
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getServicePackageApiV1ServiceBasedPackagesPackageIdGet({
        packageId,
    }: {
        packageId: string,
    }): CancelablePromise<Record<string, any>> {
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
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateServicePackageApiV1ServiceBasedPackagesPackageIdPut({
        packageId,
        requestBody,
    }: {
        packageId: string,
        requestBody: Record<string, any>,
    }): CancelablePromise<Record<string, any>> {
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
     * @returns void
     * @throws ApiError
     */
    public static deleteServicePackageApiV1ServiceBasedPackagesPackageIdDelete({
        packageId,
    }: {
        packageId: string,
    }): CancelablePromise<void> {
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
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createMembershipPlanApiV1ServiceBasedMembershipsPost({
        requestBody,
    }: {
        requestBody: Record<string, any>,
    }): CancelablePromise<Record<string, any>> {
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
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listMembershipPlansApiV1ServiceBasedMembershipsGet({
        businessId,
        isActive,
        limit = 100,
        offset,
    }: {
        /**
         * Business ID
         */
        businessId: string,
        isActive?: (boolean | null),
        limit?: number,
        offset?: number,
    }): CancelablePromise<Array<any>> {
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
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getMembershipPlanApiV1ServiceBasedMembershipsMembershipIdGet({
        membershipId,
    }: {
        membershipId: string,
    }): CancelablePromise<Record<string, any>> {
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
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateMembershipPlanApiV1ServiceBasedMembershipsMembershipIdPut({
        membershipId,
        requestBody,
    }: {
        membershipId: string,
        requestBody: Record<string, any>,
    }): CancelablePromise<Record<string, any>> {
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
     * @returns void
     * @throws ApiError
     */
    public static deleteMembershipPlanApiV1ServiceBasedMembershipsMembershipIdDelete({
        membershipId,
    }: {
        membershipId: string,
    }): CancelablePromise<void> {
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
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createClassSessionApiV1ServiceBasedClassesPost({
        requestBody,
    }: {
        requestBody: Record<string, any>,
    }): CancelablePromise<Record<string, any>> {
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
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listClassSessionsApiV1ServiceBasedClassesGet({
        businessId,
        instructorId,
        startDate,
        endDate,
        limit = 100,
        offset,
    }: {
        /**
         * Business ID
         */
        businessId: string,
        instructorId?: (string | null),
        startDate?: (string | null),
        endDate?: (string | null),
        limit?: number,
        offset?: number,
    }): CancelablePromise<Array<any>> {
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
     * @returns any Successful Response
     * @throws ApiError
     */
    public static bookClassSessionApiV1ServiceBasedClassesClassIdBookPost({
        classId,
        requestBody,
    }: {
        classId: string,
        requestBody: Record<string, any>,
    }): CancelablePromise<Record<string, any>> {
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
     * @returns any Successful Response
     * @throws ApiError
     */
    public static addToWaitlistApiV1ServiceBasedWaitlistPost({
        requestBody,
    }: {
        requestBody: Record<string, any>,
    }): CancelablePromise<Record<string, any>> {
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
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listWaitlistApiV1ServiceBasedWaitlistGet({
        businessId,
        status,
        limit = 100,
        offset,
    }: {
        /**
         * Business ID
         */
        businessId: string,
        status?: (string | null),
        limit?: number,
        offset?: number,
    }): CancelablePromise<Array<any>> {
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
     * @returns any Successful Response
     * @throws ApiError
     */
    public static convertWaitlistToAppointmentApiV1ServiceBasedWaitlistEntryIdConvertPut({
        entryId,
        requestBody,
    }: {
        entryId: string,
        requestBody: Record<string, any>,
    }): CancelablePromise<Record<string, any>> {
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
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAppointmentTrendsApiV1ServiceBasedAnalyticsAppointmentTrendsGet({
        businessId,
        startDate,
        endDate,
    }: {
        businessId: string,
        startDate?: (string | null),
        endDate?: (string | null),
    }): CancelablePromise<Record<string, any>> {
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
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getServicePerformanceApiV1ServiceBasedAnalyticsServicePerformanceGet({
        businessId,
        startDate,
        endDate,
    }: {
        businessId: string,
        startDate?: (string | null),
        endDate?: (string | null),
    }): CancelablePromise<Record<string, any>> {
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
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getNoShowRateApiV1ServiceBasedAnalyticsNoShowRateGet({
        businessId,
        startDate,
        endDate,
    }: {
        businessId: string,
        startDate?: (string | null),
        endDate?: (string | null),
    }): CancelablePromise<Record<string, any>> {
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
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getStaffUtilizationApiV1ServiceBasedAnalyticsStaffUtilizationGet({
        businessId,
        startDate,
        endDate,
    }: {
        businessId: string,
        startDate?: (string | null),
        endDate?: (string | null),
    }): CancelablePromise<Record<string, any>> {
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
