/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_upload_pdf_api_v1_pdf_upload_post } from '../models/Body_upload_pdf_api_v1_pdf_upload_post';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Get Dashboard Analytics
     * Get dashboard analytics for business
     *
     * Includes: orders, revenue, customer metrics, top items
     * @param businessId
     * @param period
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getDashboardAnalyticsApiV1AnalyticsDashboardBusinessIdGet(
        businessId: string,
        period: string = '7d',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/dashboard/{business_id}',
            path: {
                'business_id': businessId,
            },
            query: {
                'period': period,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Health Check
     * Health check
     * @returns any Successful Response
     * @throws ApiError
     */
    public static healthCheckHealthGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health',
        });
    }
    /**
     * Liveness
     * Liveness probe
     * @returns any Successful Response
     * @throws ApiError
     */
    public static livenessHealthLiveGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health/live',
        });
    }
    /**
     * Readiness
     * Readiness probe
     * @returns any Successful Response
     * @throws ApiError
     */
    public static readinessHealthReadyGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health/ready',
        });
    }
    /**
     * Root
     * Root endpoint
     * @returns any Successful Response
     * @throws ApiError
     */
    public static rootGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/',
        });
    }
    /**
     * Get Top Categories
     * Get top-5 category assessments
     *
     * Analyzes performance by category
     * @param businessId
     * @param limit
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getTopCategoriesApiV1AnalyticsTopCategoriesBusinessIdGet(
        businessId: string,
        limit: number = 5,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/top-categories/{business_id}',
            path: {
                'business_id': businessId,
            },
            query: {
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Customer Insights
     * Get customer behavior insights
     *
     * Includes: demographics, preferences, retention
     * @param businessId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getCustomerInsightsApiV1AnalyticsCustomerInsightsBusinessIdGet(
        businessId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/customer-insights/{business_id}',
            path: {
                'business_id': businessId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Realtime Metrics
     * Get real-time metrics
     *
     * Live data from Kafka streams
     * @param businessId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getRealtimeMetricsApiV1AnalyticsRealTimeBusinessIdGet(
        businessId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/real-time/{business_id}',
            path: {
                'business_id': businessId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upload Pdf
     * Upload and process PDF
     *
     * Intelligent extraction for:
     * - Menus with photos
     * - Categories and items
     * - Pricing information
     * - Business documents
     *
     * Uses OCR (Tesseract/Google Vision) and AI (OpenAI) for extraction
     * @param formData
     * @param businessId
     * @param category
     * @returns any Successful Response
     * @throws ApiError
     */
    public static uploadPdfApiV1PdfUploadPost(
        formData: Body_upload_pdf_api_v1_pdf_upload_post,
        businessId?: string,
        category: string = 'menu',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/pdf/upload',
            query: {
                'business_id': businessId,
                'category': category,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Extracted Content
     * Get extracted content from processed PDF
     * @param fileId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getExtractedContentApiV1PdfExtractFileIdGet(
        fileId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/pdf/extract/{file_id}',
            path: {
                'file_id': fileId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Categorize Content
     * AI-powered content categorization
     *
     * Uses OpenAI to categorize extracted content into relevant sections
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static categorizeContentApiV1PdfCategorizePost(
        requestBody: Record<string, any>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/pdf/categorize',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Generate Report
     * Generate business report
     *
     * Types: summary, detailed, financial, customer
     * @param businessId
     * @param reportType
     * @param startDate
     * @param endDate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static generateReportApiV1ReportsGenerateBusinessIdGet(
        businessId: string,
        reportType: string = 'summary',
        startDate?: (string | null),
        endDate?: (string | null),
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/reports/generate/{business_id}',
            path: {
                'business_id': businessId,
            },
            query: {
                'report_type': reportType,
                'start_date': startDate,
                'end_date': endDate,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Export Data
     * Export business data
     *
     * Formats: csv, json, excel
     * Types: orders, customers, inventory, analytics
     * @param businessId
     * @param dataType
     * @param format
     * @returns any Successful Response
     * @throws ApiError
     */
    public static exportDataApiV1ExportBusinessIdGet(
        businessId: string,
        dataType: string = 'orders',
        format: string = 'csv',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/export/{business_id}',
            path: {
                'business_id': businessId,
            },
            query: {
                'data_type': dataType,
                'format': format,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
