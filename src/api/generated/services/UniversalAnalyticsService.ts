/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UniversalAnalyticsService {
    /**
     * Get Financial Summary
     * Get financial summary across all revenue sources
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getFinancialSummaryApiV1AnalyticsFinancialSummaryGet({
        businessId,
        startDate,
        endDate,
    }: {
        /**
         * Business ID
         */
        businessId: string,
        /**
         * Start date
         */
        startDate?: (string | null),
        /**
         * End date
         */
        endDate?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/financial/summary',
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
     * Get Customer Insights
     * Get customer/client insights across all categories
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getCustomerInsightsApiV1AnalyticsCustomersInsightsGet({
        businessId,
    }: {
        /**
         * Business ID
         */
        businessId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/customers/insights',
            query: {
                'business_id': businessId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Performance Trends
     * Get performance trends over time
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getPerformanceTrendsApiV1AnalyticsPerformanceTrendsGet({
        businessId,
        metric = 'revenue',
        period = '30d',
    }: {
        /**
         * Business ID
         */
        businessId: string,
        /**
         * Metric to track: revenue, orders, appointments, projects
         */
        metric?: string,
        /**
         * Period: 7d, 30d, 90d
         */
        period?: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/performance/trends',
            query: {
                'business_id': businessId,
                'metric': metric,
                'period': period,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Generate Report
     * Generate comprehensive business report
     * @returns any Successful Response
     * @throws ApiError
     */
    public static generateReportApiV1AnalyticsReportsGeneratePost({
        businessId,
        reportType = 'summary',
        startDate,
        endDate,
    }: {
        /**
         * Business ID
         */
        businessId: string,
        /**
         * Report type: summary, detailed, financial
         */
        reportType?: string,
        startDate?: (string | null),
        endDate?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/analytics/reports/generate',
            query: {
                'business_id': businessId,
                'report_type': reportType,
                'start_date': startDate,
                'end_date': endDate,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
