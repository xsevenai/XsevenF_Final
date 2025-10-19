/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */ 
/* eslint-disable */
import type { PaymentMethodsResponse } from '../models/PaymentMethodsResponse';
import type { RevenueAnalyticsResponse } from '../models/RevenueAnalyticsResponse';
import type { RevenueByCategoryResponse } from '../models/RevenueByCategoryResponse';
import type { RevenueByChannelResponse } from '../models/RevenueByChannelResponse';
import type { RevenueByHourResponse } from '../models/RevenueByHourResponse';
import type { RevenueOverview } from '../models/RevenueOverview';
import type { RevenueProjectionResponse } from '../models/RevenueProjectionResponse';
import type { RevenueTrendResponse } from '../models/RevenueTrendResponse';
import type { TopRevenueItemsResponse } from '../models/TopRevenueItemsResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RevenueAnalyticsService {
    /**
     * Get Revenue Overview
     * Get comprehensive revenue analytics overview
     *
     * - **Key Metrics**: Total revenue, daily/weekly/monthly revenue
     * - **Growth Trends**: Period-over-period growth calculations
     * - **Performance Indicators**: Revenue per customer, average order value
     * @returns RevenueOverview Successful Response
     * @throws ApiError
     */
    public static getRevenueOverviewApiV1AnalyticsRevenueOverviewBusinessIdGet({
        businessId,
        period = '7d',
        includeTrends = true,
    }: {
        businessId: string,
        period?: string,
        includeTrends?: boolean,
    }): CancelablePromise<RevenueOverview> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/revenue/overview/{business_id}',
            path: {
                'business_id': businessId,
            },
            query: {
                'period': period,
                'include_trends': includeTrends,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Revenue Trend
     * Get daily revenue trend data for charts
     *
     * - **Daily Volume**: Revenue by day with order counts
     * - **Chart Data**: Formatted for line/bar charts
     * - **Time Period**: Configurable date ranges
     * @returns RevenueTrendResponse Successful Response
     * @throws ApiError
     */
    public static getRevenueTrendApiV1AnalyticsRevenueTrendBusinessIdGet({
        businessId,
        period = '7d',
    }: {
        businessId: string,
        period?: string,
    }): CancelablePromise<RevenueTrendResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/revenue/trend/{business_id}',
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
     * Get Revenue By Channel
     * Get revenue distribution by channel (dine-in, takeout, delivery)
     *
     * - **Channel Breakdown**: Revenue and percentage by channel
     * - **Chart Data**: Formatted for pie charts
     * - **Performance**: Channel performance comparison
     * @returns RevenueByChannelResponse Successful Response
     * @throws ApiError
     */
    public static getRevenueByChannelApiV1AnalyticsRevenueByChannelBusinessIdGet({
        businessId,
        period = '7d',
    }: {
        businessId: string,
        period?: string,
    }): CancelablePromise<RevenueByChannelResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/revenue/by-channel/{business_id}',
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
     * Get Revenue By Hour
     * Get revenue distribution by hour for peak time analysis
     *
     * - **Hourly Distribution**: Revenue by hour of day
     * - **Peak Hours**: Identify highest revenue times
     * - **Chart Data**: Formatted for bar charts
     * @returns RevenueByHourResponse Successful Response
     * @throws ApiError
     */
    public static getRevenueByHourApiV1AnalyticsRevenueByHourBusinessIdGet({
        businessId,
        period = '7d',
    }: {
        businessId: string,
        period?: string,
    }): CancelablePromise<RevenueByHourResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/revenue/by-hour/{business_id}',
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
     * Get Payment Methods Revenue
     * Get revenue distribution by payment methods
     *
     * - **Payment Types**: Credit Card, Cash, Mobile Pay, etc.
     * - **Distribution**: Revenue and percentage breakdown
     * - **Chart Data**: Formatted for pie charts
     * @returns PaymentMethodsResponse Successful Response
     * @throws ApiError
     */
    public static getPaymentMethodsRevenueApiV1AnalyticsRevenuePaymentMethodsBusinessIdGet({
        businessId,
        period = '7d',
    }: {
        businessId: string,
        period?: string,
    }): CancelablePromise<PaymentMethodsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/revenue/payment-methods/{business_id}',
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
     * Get Revenue By Category
     * Get revenue distribution by menu categories
     *
     * - **Category Breakdown**: Revenue and percentage by category
     * - **Performance**: Category performance comparison
     * - **Chart Data**: Formatted for bar charts
     * @returns RevenueByCategoryResponse Successful Response
     * @throws ApiError
     */
    public static getRevenueByCategoryApiV1AnalyticsRevenueByCategoryBusinessIdGet({
        businessId,
        period = '7d',
    }: {
        businessId: string,
        period?: string,
    }): CancelablePromise<RevenueByCategoryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/revenue/by-category/{business_id}',
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
     * Get Top Revenue Items
     * Get top revenue-generating menu items
     *
     * - **Top Items**: Highest revenue menu items
     * - **Metrics**: Revenue and order counts
     * - **Ranking**: Sorted by revenue generated
     * @returns TopRevenueItemsResponse Successful Response
     * @throws ApiError
     */
    public static getTopRevenueItemsApiV1AnalyticsRevenueTopItemsBusinessIdGet({
        businessId,
        period = '7d',
        limit = 5,
    }: {
        businessId: string,
        period?: string,
        limit?: number,
    }): CancelablePromise<TopRevenueItemsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/revenue/top-items/{business_id}',
            path: {
                'business_id': businessId,
            },
            query: {
                'period': period,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Revenue Projection
     * Get revenue projection based on historical data
     *
     * - **Historical Data**: Past revenue trends
     * - **Projections**: Future revenue estimates
     * - **Chart Data**: Formatted for line charts
     * @returns RevenueProjectionResponse Successful Response
     * @throws ApiError
     */
    public static getRevenueProjectionApiV1AnalyticsRevenueProjectionBusinessIdGet({
        businessId,
        months = 6,
    }: {
        businessId: string,
        months?: number,
    }): CancelablePromise<RevenueProjectionResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/revenue/projection/{business_id}',
            path: {
                'business_id': businessId,
            },
            query: {
                'months': months,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Revenue Analytics Dashboard
     * Get comprehensive revenue analytics dashboard data
     *
     * - **Combined Data**: Overview, trends, distributions, projections
     * - **Real-time**: Latest data with caching considerations
     * - **Customizable**: Configurable time periods and data inclusion
     * @returns RevenueAnalyticsResponse Successful Response
     * @throws ApiError
     */
    public static getRevenueAnalyticsDashboardApiV1AnalyticsRevenueDashboardBusinessIdGet({
        businessId,
        period = '7d',
        includeTrends = true,
    }: {
        businessId: string,
        period?: string,
        includeTrends?: boolean,
    }): CancelablePromise<RevenueAnalyticsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/revenue/dashboard/{business_id}',
            path: {
                'business_id': businessId,
            },
            query: {
                'period': period,
                'include_trends': includeTrends,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Refresh Revenue Analytics
     * Refresh revenue analytics data
     *
     * - **Cache Invalidation**: Clear cached analytics data
     * - **Real-time Update**: Force recalculation of all metrics
     * - **WebSocket Notification**: Notify frontend of data refresh
     * @returns any Successful Response
     * @throws ApiError
     */
    public static refreshRevenueAnalyticsApiV1AnalyticsRevenueRefreshBusinessIdPost({
        businessId,
        forceRefresh = false,
    }: {
        businessId: string,
        forceRefresh?: boolean,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/analytics/revenue/refresh/{business_id}',
            path: {
                'business_id': businessId,
            },
            query: {
                'force_refresh': forceRefresh,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
