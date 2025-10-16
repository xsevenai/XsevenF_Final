/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InvoiceCreate } from '../models/InvoiceCreate';
import type { InvoiceResponse } from '../models/InvoiceResponse';
import type { InvoiceUpdate } from '../models/InvoiceUpdate';
import type { ProjectCreate } from '../models/ProjectCreate';
import type { ProjectResponse } from '../models/ProjectResponse';
import type { ProjectUpdate } from '../models/ProjectUpdate';
import type { ResourceAllocationCreate } from '../models/ResourceAllocationCreate';
import type { ResourceAllocationResponse } from '../models/ResourceAllocationResponse';
import type { ResourceCreate } from '../models/ResourceCreate';
import type { ResourceResponse } from '../models/ResourceResponse';
import type { ResourceUpdate } from '../models/ResourceUpdate';
import type { TimeEntryCreate } from '../models/TimeEntryCreate';
import type { TimeEntryResponse } from '../models/TimeEntryResponse';
import type { TimeEntryUpdate } from '../models/TimeEntryUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProfessionalServicesTemplateService {
    /**
     * Create Project
     * Create a new project
     * @returns ProjectResponse Successful Response
     * @throws ApiError
     */
    public static createProjectApiV1ProfessionalProjectsPost({
        requestBody,
    }: {
        requestBody: ProjectCreate,
    }): CancelablePromise<ProjectResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/professional/projects',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Projects
     * List all projects for a business
     * @returns ProjectResponse Successful Response
     * @throws ApiError
     */
    public static listProjectsApiV1ProfessionalProjectsGet({
        businessId,
        clientId,
        status,
        priority,
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
         * Filter by status
         */
        status?: (string | null),
        /**
         * Filter by priority
         */
        priority?: (string | null),
        limit?: number,
        offset?: number,
    }): CancelablePromise<Array<ProjectResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/professional/projects',
            query: {
                'business_id': businessId,
                'client_id': clientId,
                'status': status,
                'priority': priority,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Project
     * Get a specific project by ID
     * @returns ProjectResponse Successful Response
     * @throws ApiError
     */
    public static getProjectApiV1ProfessionalProjectsProjectIdGet({
        projectId,
    }: {
        projectId: string,
    }): CancelablePromise<ProjectResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/professional/projects/{project_id}',
            path: {
                'project_id': projectId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Project
     * Update a project
     * @returns ProjectResponse Successful Response
     * @throws ApiError
     */
    public static updateProjectApiV1ProfessionalProjectsProjectIdPut({
        projectId,
        requestBody,
    }: {
        projectId: string,
        requestBody: ProjectUpdate,
    }): CancelablePromise<ProjectResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/professional/projects/{project_id}',
            path: {
                'project_id': projectId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Project
     * Delete a project
     * @returns void
     * @throws ApiError
     */
    public static deleteProjectApiV1ProfessionalProjectsProjectIdDelete({
        projectId,
    }: {
        projectId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/professional/projects/{project_id}',
            path: {
                'project_id': projectId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Time Entry
     * Create a new time entry
     * @returns TimeEntryResponse Successful Response
     * @throws ApiError
     */
    public static createTimeEntryApiV1ProfessionalTimeEntriesPost({
        requestBody,
    }: {
        requestBody: TimeEntryCreate,
    }): CancelablePromise<TimeEntryResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/professional/time-entries',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Time Entries
     * List all time entries for a business
     * @returns TimeEntryResponse Successful Response
     * @throws ApiError
     */
    public static listTimeEntriesApiV1ProfessionalTimeEntriesGet({
        businessId,
        projectId,
        staffId,
        status,
        startDate,
        endDate,
        billable,
        limit = 100,
        offset,
    }: {
        /**
         * Business ID
         */
        businessId: string,
        /**
         * Filter by project
         */
        projectId?: (string | null),
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
        /**
         * Filter by billable status
         */
        billable?: (boolean | null),
        limit?: number,
        offset?: number,
    }): CancelablePromise<Array<TimeEntryResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/professional/time-entries',
            query: {
                'business_id': businessId,
                'project_id': projectId,
                'staff_id': staffId,
                'status': status,
                'start_date': startDate,
                'end_date': endDate,
                'billable': billable,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Time Entry
     * Get a specific time entry by ID
     * @returns TimeEntryResponse Successful Response
     * @throws ApiError
     */
    public static getTimeEntryApiV1ProfessionalTimeEntriesEntryIdGet({
        entryId,
    }: {
        entryId: string,
    }): CancelablePromise<TimeEntryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/professional/time-entries/{entry_id}',
            path: {
                'entry_id': entryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Time Entry
     * Update a time entry
     * @returns TimeEntryResponse Successful Response
     * @throws ApiError
     */
    public static updateTimeEntryApiV1ProfessionalTimeEntriesEntryIdPut({
        entryId,
        requestBody,
    }: {
        entryId: string,
        requestBody: TimeEntryUpdate,
    }): CancelablePromise<TimeEntryResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/professional/time-entries/{entry_id}',
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
     * Delete Time Entry
     * Delete a time entry
     * @returns void
     * @throws ApiError
     */
    public static deleteTimeEntryApiV1ProfessionalTimeEntriesEntryIdDelete({
        entryId,
    }: {
        entryId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/professional/time-entries/{entry_id}',
            path: {
                'entry_id': entryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Invoice
     * Create a new invoice
     * @returns InvoiceResponse Successful Response
     * @throws ApiError
     */
    public static createInvoiceApiV1ProfessionalInvoicesPost({
        requestBody,
    }: {
        requestBody: InvoiceCreate,
    }): CancelablePromise<InvoiceResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/professional/invoices',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Invoices
     * List all invoices for a business
     * @returns InvoiceResponse Successful Response
     * @throws ApiError
     */
    public static listInvoicesApiV1ProfessionalInvoicesGet({
        businessId,
        clientId,
        projectId,
        status,
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
         * Filter by project
         */
        projectId?: (string | null),
        /**
         * Filter by status
         */
        status?: (string | null),
        limit?: number,
        offset?: number,
    }): CancelablePromise<Array<InvoiceResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/professional/invoices',
            query: {
                'business_id': businessId,
                'client_id': clientId,
                'project_id': projectId,
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
     * Get Invoice
     * Get a specific invoice by ID
     * @returns InvoiceResponse Successful Response
     * @throws ApiError
     */
    public static getInvoiceApiV1ProfessionalInvoicesInvoiceIdGet({
        invoiceId,
    }: {
        invoiceId: string,
    }): CancelablePromise<InvoiceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/professional/invoices/{invoice_id}',
            path: {
                'invoice_id': invoiceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Invoice
     * Update an invoice
     * @returns InvoiceResponse Successful Response
     * @throws ApiError
     */
    public static updateInvoiceApiV1ProfessionalInvoicesInvoiceIdPut({
        invoiceId,
        requestBody,
    }: {
        invoiceId: string,
        requestBody: InvoiceUpdate,
    }): CancelablePromise<InvoiceResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/professional/invoices/{invoice_id}',
            path: {
                'invoice_id': invoiceId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Invoice
     * Delete an invoice
     * @returns void
     * @throws ApiError
     */
    public static deleteInvoiceApiV1ProfessionalInvoicesInvoiceIdDelete({
        invoiceId,
    }: {
        invoiceId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/professional/invoices/{invoice_id}',
            path: {
                'invoice_id': invoiceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Mark Invoice Paid
     * Mark an invoice as paid
     * @returns any Successful Response
     * @throws ApiError
     */
    public static markInvoicePaidApiV1ProfessionalInvoicesInvoiceIdMarkPaidPost({
        invoiceId,
        paymentMethod,
    }: {
        invoiceId: string,
        /**
         * Payment method used
         */
        paymentMethod?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/professional/invoices/{invoice_id}/mark-paid',
            path: {
                'invoice_id': invoiceId,
            },
            query: {
                'payment_method': paymentMethod,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Resource
     * Create a new resource
     * @returns ResourceResponse Successful Response
     * @throws ApiError
     */
    public static createResourceApiV1ProfessionalResourcesPost({
        requestBody,
    }: {
        requestBody: ResourceCreate,
    }): CancelablePromise<ResourceResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/professional/resources',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Resources
     * List all resources for a business
     * @returns ResourceResponse Successful Response
     * @throws ApiError
     */
    public static listResourcesApiV1ProfessionalResourcesGet({
        businessId,
        type,
        status,
        limit = 100,
        offset,
    }: {
        /**
         * Business ID
         */
        businessId: string,
        /**
         * Filter by resource type
         */
        type?: (string | null),
        /**
         * Filter by status
         */
        status?: (string | null),
        limit?: number,
        offset?: number,
    }): CancelablePromise<Array<ResourceResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/professional/resources',
            query: {
                'business_id': businessId,
                'type': type,
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
     * Get Resource
     * Get a specific resource by ID
     * @returns ResourceResponse Successful Response
     * @throws ApiError
     */
    public static getResourceApiV1ProfessionalResourcesResourceIdGet({
        resourceId,
    }: {
        resourceId: string,
    }): CancelablePromise<ResourceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/professional/resources/{resource_id}',
            path: {
                'resource_id': resourceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Resource
     * Update a resource
     * @returns ResourceResponse Successful Response
     * @throws ApiError
     */
    public static updateResourceApiV1ProfessionalResourcesResourceIdPut({
        resourceId,
        requestBody,
    }: {
        resourceId: string,
        requestBody: ResourceUpdate,
    }): CancelablePromise<ResourceResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/professional/resources/{resource_id}',
            path: {
                'resource_id': resourceId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Resource
     * Delete a resource
     * @returns void
     * @throws ApiError
     */
    public static deleteResourceApiV1ProfessionalResourcesResourceIdDelete({
        resourceId,
    }: {
        resourceId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/professional/resources/{resource_id}',
            path: {
                'resource_id': resourceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Resource Allocation
     * Create a new resource allocation
     * @returns ResourceAllocationResponse Successful Response
     * @throws ApiError
     */
    public static createResourceAllocationApiV1ProfessionalResourceAllocationsPost({
        requestBody,
    }: {
        requestBody: ResourceAllocationCreate,
    }): CancelablePromise<ResourceAllocationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/professional/resource-allocations',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Resource Allocations
     * List all resource allocations for a business
     * @returns ResourceAllocationResponse Successful Response
     * @throws ApiError
     */
    public static listResourceAllocationsApiV1ProfessionalResourceAllocationsGet({
        businessId,
        resourceId,
        projectId,
        limit = 100,
        offset,
    }: {
        /**
         * Business ID
         */
        businessId: string,
        /**
         * Filter by resource
         */
        resourceId?: (string | null),
        /**
         * Filter by project
         */
        projectId?: (string | null),
        limit?: number,
        offset?: number,
    }): CancelablePromise<Array<ResourceAllocationResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/professional/resource-allocations',
            query: {
                'business_id': businessId,
                'resource_id': resourceId,
                'project_id': projectId,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Resource Allocation
     * Delete a resource allocation
     * @returns void
     * @throws ApiError
     */
    public static deleteResourceAllocationApiV1ProfessionalResourceAllocationsAllocationIdDelete({
        allocationId,
    }: {
        allocationId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/professional/resource-allocations/{allocation_id}',
            path: {
                'allocation_id': allocationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Project Profitability
     * Analyze profitability by project
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getProjectProfitabilityApiV1ProfessionalAnalyticsProjectProfitabilityGet({
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
            url: '/api/v1/professional/analytics/project-profitability',
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
     * Get Billable Analysis
     * Analyze billable vs non-billable hours
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getBillableAnalysisApiV1ProfessionalAnalyticsBillableVsNonBillableGet({
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
            url: '/api/v1/professional/analytics/billable-vs-non-billable',
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
     * Get Staff Utilization Professional
     * Analyze staff utilization and capacity
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getStaffUtilizationProfessionalApiV1ProfessionalAnalyticsStaffUtilizationGet({
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
            url: '/api/v1/professional/analytics/staff-utilization',
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
     * Get Project Timeline Analysis
     * Analyze project timeline performance (on-time vs delayed)
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getProjectTimelineAnalysisApiV1ProfessionalAnalyticsProjectTimelineGet({
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
            url: '/api/v1/professional/analytics/project-timeline',
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
     * Get Invoice Aging
     * Analyze invoice aging and outstanding payments
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getInvoiceAgingApiV1ProfessionalAnalyticsInvoiceAgingGet({
        businessId,
    }: {
        businessId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/professional/analytics/invoice-aging',
            query: {
                'business_id': businessId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Revenue By Client
     * Analyze revenue by client
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getRevenueByClientApiV1ProfessionalAnalyticsRevenueByClientGet({
        businessId,
        startDate,
        endDate,
        limit = 10,
    }: {
        businessId: string,
        startDate?: (string | null),
        endDate?: (string | null),
        limit?: number,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/professional/analytics/revenue-by-client',
            query: {
                'business_id': businessId,
                'start_date': startDate,
                'end_date': endDate,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Resource Allocation Analysis
     * Analyze resource allocation efficiency
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getResourceAllocationAnalysisApiV1ProfessionalAnalyticsResourceAllocationGet({
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
            url: '/api/v1/professional/analytics/resource-allocation',
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
     * Get Budget Variance
     * Analyze budget vs actual spending
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getBudgetVarianceApiV1ProfessionalAnalyticsBudgetVarianceGet({
        businessId,
        projectId,
    }: {
        businessId: string,
        projectId?: (string | null),
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/professional/analytics/budget-variance',
            query: {
                'business_id': businessId,
                'project_id': projectId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
