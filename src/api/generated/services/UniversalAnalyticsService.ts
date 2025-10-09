/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UniversalAnalyticsService {
    /**
     * Get Customer Insights
     * Get customer/client insights across all categories
     * @param businessId Business ID
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getCustomerInsightsApiV1AnalyticsCustomersInsightsGet(
        businessId: string,
    ): CancelablePromise<any> {
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
     * Get Financial Summary
     * Get financial summary across all revenue sources
     * @param businessId Business ID
     * @param startDate Start date
     * @param endDate End date
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getFinancialSummaryApiV1AnalyticsFinancialSummaryGet(
        businessId: string,
        startDate?: (string | null),
        endDate?: (string | null),
    ): CancelablePromise<any> {
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
     * Generate Report
     * Generate comprehensive business report
     * @param businessId Business ID
     * @param reportType Report type: summary, detailed, financial
     * @param startDate
     * @param endDate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static generateReportApiV1AnalyticsReportsGeneratePost(
        businessId: string,
        reportType: string = 'summary',
        startDate?: (string | null),
        endDate?: (string | null),
    ): CancelablePromise<any> {
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
    /**
     * Get Performance Trends
     * Get performance trends over time
     * @param businessId Business ID
     * @param metric Metric to track: revenue, orders, appointments, projects
     * @param period Period: 7d, 30d, 90d
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getPerformanceTrendsApiV1AnalyticsPerformanceTrendsGet(
        businessId: string,
        metric: string = 'revenue',
        period: string = '30d',
    ): CancelablePromise<any> {
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
}
