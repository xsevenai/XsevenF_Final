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
     * @param requestBody
     * @returns ProjectResponse Successful Response
     * @throws ApiError
     */
    public static createProjectApiV1ProfessionalProjectsPost(
        requestBody: ProjectCreate,
    ): CancelablePromise<ProjectResponse> {
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
     * @param businessId Business ID
     * @param clientId Filter by client
     * @param status Filter by status
     * @param priority Filter by priority
     * @param limit
     * @param offset
     * @returns ProjectResponse Successful Response
     * @throws ApiError
     */
    public static listProjectsApiV1ProfessionalProjectsGet(
        businessId: string,
        clientId?: (string | null),
        status?: (string | null),
        priority?: (string | null),
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<Array<ProjectResponse>> {
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
     * @param projectId
     * @returns ProjectResponse Successful Response
     * @throws ApiError
     */
    public static getProjectApiV1ProfessionalProjectsProjectIdGet(
        projectId: string,
    ): CancelablePromise<ProjectResponse> {
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
     * @param projectId
     * @param requestBody
     * @returns ProjectResponse Successful Response
     * @throws ApiError
     */
    public static updateProjectApiV1ProfessionalProjectsProjectIdPut(
        projectId: string,
        requestBody: ProjectUpdate,
    ): CancelablePromise<ProjectResponse> {
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
     * @param projectId
     * @returns void
     * @throws ApiError
     */
    public static deleteProjectApiV1ProfessionalProjectsProjectIdDelete(
        projectId: string,
    ): CancelablePromise<void> {
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
     * @param requestBody
     * @returns TimeEntryResponse Successful Response
     * @throws ApiError
     */
    public static createTimeEntryApiV1ProfessionalTimeEntriesPost(
        requestBody: TimeEntryCreate,
    ): CancelablePromise<TimeEntryResponse> {
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
     * @param businessId Business ID
     * @param projectId Filter by project
     * @param staffId Filter by staff
     * @param status Filter by status
     * @param startDate Filter from date
     * @param endDate Filter to date
     * @param billable Filter by billable status
     * @param limit
     * @param offset
     * @returns TimeEntryResponse Successful Response
     * @throws ApiError
     */
    public static listTimeEntriesApiV1ProfessionalTimeEntriesGet(
        businessId: string,
        projectId?: (string | null),
        staffId?: (string | null),
        status?: (string | null),
        startDate?: (string | null),
        endDate?: (string | null),
        billable?: (boolean | null),
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<Array<TimeEntryResponse>> {
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
     * @param entryId
     * @returns TimeEntryResponse Successful Response
     * @throws ApiError
     */
    public static getTimeEntryApiV1ProfessionalTimeEntriesEntryIdGet(
        entryId: string,
    ): CancelablePromise<TimeEntryResponse> {
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
     * @param entryId
     * @param requestBody
     * @returns TimeEntryResponse Successful Response
     * @throws ApiError
     */
    public static updateTimeEntryApiV1ProfessionalTimeEntriesEntryIdPut(
        entryId: string,
        requestBody: TimeEntryUpdate,
    ): CancelablePromise<TimeEntryResponse> {
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
     * @param entryId
     * @returns void
     * @throws ApiError
     */
    public static deleteTimeEntryApiV1ProfessionalTimeEntriesEntryIdDelete(
        entryId: string,
    ): CancelablePromise<void> {
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
     * @param requestBody
     * @returns InvoiceResponse Successful Response
     * @throws ApiError
     */
    public static createInvoiceApiV1ProfessionalInvoicesPost(
        requestBody: InvoiceCreate,
    ): CancelablePromise<InvoiceResponse> {
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
     * @param businessId Business ID
     * @param clientId Filter by client
     * @param projectId Filter by project
     * @param status Filter by status
     * @param limit
     * @param offset
     * @returns InvoiceResponse Successful Response
     * @throws ApiError
     */
    public static listInvoicesApiV1ProfessionalInvoicesGet(
        businessId: string,
        clientId?: (string | null),
        projectId?: (string | null),
        status?: (string | null),
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<Array<InvoiceResponse>> {
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
     * @param invoiceId
     * @returns InvoiceResponse Successful Response
     * @throws ApiError
     */
    public static getInvoiceApiV1ProfessionalInvoicesInvoiceIdGet(
        invoiceId: string,
    ): CancelablePromise<InvoiceResponse> {
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
     * @param invoiceId
     * @param requestBody
     * @returns InvoiceResponse Successful Response
     * @throws ApiError
     */
    public static updateInvoiceApiV1ProfessionalInvoicesInvoiceIdPut(
        invoiceId: string,
        requestBody: InvoiceUpdate,
    ): CancelablePromise<InvoiceResponse> {
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
     * @param invoiceId
     * @returns void
     * @throws ApiError
     */
    public static deleteInvoiceApiV1ProfessionalInvoicesInvoiceIdDelete(
        invoiceId: string,
    ): CancelablePromise<void> {
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
     * @param invoiceId
     * @param paymentMethod Payment method used
     * @returns any Successful Response
     * @throws ApiError
     */
    public static markInvoicePaidApiV1ProfessionalInvoicesInvoiceIdMarkPaidPost(
        invoiceId: string,
        paymentMethod?: (string | null),
    ): CancelablePromise<any> {
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
     * @param requestBody
     * @returns ResourceResponse Successful Response
     * @throws ApiError
     */
    public static createResourceApiV1ProfessionalResourcesPost(
        requestBody: ResourceCreate,
    ): CancelablePromise<ResourceResponse> {
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
     * @param businessId Business ID
     * @param type Filter by resource type
     * @param status Filter by status
     * @param limit
     * @param offset
     * @returns ResourceResponse Successful Response
     * @throws ApiError
     */
    public static listResourcesApiV1ProfessionalResourcesGet(
        businessId: string,
        type?: (string | null),
        status?: (string | null),
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<Array<ResourceResponse>> {
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
     * @param resourceId
     * @returns ResourceResponse Successful Response
     * @throws ApiError
     */
    public static getResourceApiV1ProfessionalResourcesResourceIdGet(
        resourceId: string,
    ): CancelablePromise<ResourceResponse> {
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
     * @param resourceId
     * @param requestBody
     * @returns ResourceResponse Successful Response
     * @throws ApiError
     */
    public static updateResourceApiV1ProfessionalResourcesResourceIdPut(
        resourceId: string,
        requestBody: ResourceUpdate,
    ): CancelablePromise<ResourceResponse> {
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
     * @param resourceId
     * @returns void
     * @throws ApiError
     */
    public static deleteResourceApiV1ProfessionalResourcesResourceIdDelete(
        resourceId: string,
    ): CancelablePromise<void> {
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
     * @param requestBody
     * @returns ResourceAllocationResponse Successful Response
     * @throws ApiError
     */
    public static createResourceAllocationApiV1ProfessionalResourceAllocationsPost(
        requestBody: ResourceAllocationCreate,
    ): CancelablePromise<ResourceAllocationResponse> {
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
     * @param businessId Business ID
     * @param resourceId Filter by resource
     * @param projectId Filter by project
     * @param limit
     * @param offset
     * @returns ResourceAllocationResponse Successful Response
     * @throws ApiError
     */
    public static listResourceAllocationsApiV1ProfessionalResourceAllocationsGet(
        businessId: string,
        resourceId?: (string | null),
        projectId?: (string | null),
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<Array<ResourceAllocationResponse>> {
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
     * @param allocationId
     * @returns void
     * @throws ApiError
     */
    public static deleteResourceAllocationApiV1ProfessionalResourceAllocationsAllocationIdDelete(
        allocationId: string,
    ): CancelablePromise<void> {
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
     * @param businessId
     * @param startDate
     * @param endDate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getProjectProfitabilityApiV1ProfessionalAnalyticsProjectProfitabilityGet(
        businessId: string,
        startDate?: (string | null),
        endDate?: (string | null),
    ): CancelablePromise<Record<string, any>> {
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
     * @param businessId
     * @param startDate
     * @param endDate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getBillableAnalysisApiV1ProfessionalAnalyticsBillableVsNonBillableGet(
        businessId: string,
        startDate?: (string | null),
        endDate?: (string | null),
    ): CancelablePromise<Record<string, any>> {
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
     * @param businessId
     * @param startDate
     * @param endDate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getStaffUtilizationProfessionalApiV1ProfessionalAnalyticsStaffUtilizationGet(
        businessId: string,
        startDate?: (string | null),
        endDate?: (string | null),
    ): CancelablePromise<Record<string, any>> {
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
     * @param businessId
     * @param startDate
     * @param endDate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getProjectTimelineAnalysisApiV1ProfessionalAnalyticsProjectTimelineGet(
        businessId: string,
        startDate?: (string | null),
        endDate?: (string | null),
    ): CancelablePromise<Record<string, any>> {
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
     * @param businessId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getInvoiceAgingApiV1ProfessionalAnalyticsInvoiceAgingGet(
        businessId: string,
    ): CancelablePromise<Record<string, any>> {
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
     * @param businessId
     * @param startDate
     * @param endDate
     * @param limit
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getRevenueByClientApiV1ProfessionalAnalyticsRevenueByClientGet(
        businessId: string,
        startDate?: (string | null),
        endDate?: (string | null),
        limit: number = 10,
    ): CancelablePromise<Record<string, any>> {
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
     * @param businessId
     * @param startDate
     * @param endDate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getResourceAllocationAnalysisApiV1ProfessionalAnalyticsResourceAllocationGet(
        businessId: string,
        startDate?: (string | null),
        endDate?: (string | null),
    ): CancelablePromise<Record<string, any>> {
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
     * @param businessId
     * @param projectId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getBudgetVarianceApiV1ProfessionalAnalyticsBudgetVarianceGet(
        businessId: string,
        projectId?: (string | null),
    ): CancelablePromise<Record<string, any>> {
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
