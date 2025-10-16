/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryPerformanceResponse } from '../models/CategoryPerformanceResponse';
import type { MenuAnalyticsOverview } from '../models/MenuAnalyticsOverview';
import type { MenuAnalyticsResponse } from '../models/MenuAnalyticsResponse';
import type { ProfitMarginResponse } from '../models/ProfitMarginResponse';
import type { TopMenuItemsResponse } from '../models/TopMenuItemsResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MenuAnalyticsService {
    /**
     * Get Menu Analytics Overview
     * Get comprehensive menu analytics overview
     *
     * - **Key Metrics**: Total items, popular items, average rating, categories
     * - **Growth Trends**: Period-over-period growth calculations
     * - **Performance Score**: Overall menu performance rating
     * @returns MenuAnalyticsOverview Successful Response
     * @throws ApiError
     */
    public static getMenuAnalyticsOverviewApiV1AnalyticsMenuOverviewBusinessIdGet({
        businessId,
        period = '7d',
        includeTrends = true,
    }: {
        businessId: string,
        period?: string,
        includeTrends?: boolean,
    }): CancelablePromise<MenuAnalyticsOverview> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/menu/overview/{business_id}',
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
     * Get Top Menu Items
     * Get top-performing menu items by various metrics
     *
     * - **Metrics**: Sales volume, revenue, profit margin
     * - **Time periods**: 1 day, 7 days, 30 days, 90 days
     * - **Sorting**: By sales count, revenue, or profit margin
     * @returns TopMenuItemsResponse Successful Response
     * @throws ApiError
     */
    public static getTopMenuItemsApiV1AnalyticsMenuTopItemsBusinessIdGet({
        businessId,
        period = '7d',
        limit = 10,
        sortBy = 'revenue',
    }: {
        businessId: string,
        period?: string,
        limit?: number,
        sortBy?: string,
    }): CancelablePromise<TopMenuItemsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/menu/top-items/{business_id}',
            path: {
                'business_id': businessId,
            },
            query: {
                'period': period,
                'limit': limit,
                'sort_by': sortBy,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Category Performance
     * Analyze category performance metrics
     *
     * - **Metrics**: Revenue by category, profit margins, item counts
     * - **Insights**: Best and worst performing categories
     * - **Growth**: Period-over-period category growth
     * @returns CategoryPerformanceResponse Successful Response
     * @throws ApiError
     */
    public static getCategoryPerformanceApiV1AnalyticsMenuCategoryPerformanceBusinessIdGet({
        businessId,
        period = '7d',
        includeDetails = true,
    }: {
        businessId: string,
        period?: string,
        includeDetails?: boolean,
    }): CancelablePromise<CategoryPerformanceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/menu/category-performance/{business_id}',
            path: {
                'business_id': businessId,
            },
            query: {
                'period': period,
                'include_details': includeDetails,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Analyze Profit Margins
     * @returns ProfitMarginResponse Successful Response
     * @throws ApiError
     */
    public static analyzeProfitMarginsApiV1AnalyticsMenuProfitMarginsBusinessIdGet({
        businessId,
        includeRecommendations = true,
        marginThresholdHigh = 70,
        marginThresholdLow = 30,
    }: {
        businessId: string,
        includeRecommendations?: boolean,
        marginThresholdHigh?: number,
        marginThresholdLow?: number,
    }): CancelablePromise<ProfitMarginResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/menu/profit-margins/{business_id}',
            path: {
                'business_id': businessId,
            },
            query: {
                'include_recommendations': includeRecommendations,
                'margin_threshold_high': marginThresholdHigh,
                'margin_threshold_low': marginThresholdLow,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Menu Analytics Dashboard
     * Get comprehensive menu analytics dashboard data
     *
     * - **Combined Data**: Overview, top items, category performance, profit margins
     * - **Real-time**: Latest data with caching considerations
     * - **Customizable**: Configurable time periods and data inclusion
     * @returns MenuAnalyticsResponse Successful Response
     * @throws ApiError
     */
    public static getMenuAnalyticsDashboardApiV1AnalyticsMenuDashboardBusinessIdGet({
        businessId,
        period = '7d',
        includeTrends = true,
    }: {
        businessId: string,
        period?: string,
        includeTrends?: boolean,
    }): CancelablePromise<MenuAnalyticsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/menu/dashboard/{business_id}',
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
     * Refresh Menu Analytics
     * Refresh menu analytics data
     *
     * - **Cache Invalidation**: Clear cached analytics data
     * - **Real-time Update**: Force recalculation of all metrics
     * - **WebSocket Notification**: Notify frontend of data refresh
     * @returns any Successful Response
     * @throws ApiError
     */
    public static refreshMenuAnalyticsApiV1AnalyticsMenuRefreshBusinessIdPost({
        businessId,
        forceRefresh = false,
    }: {
        businessId: string,
        forceRefresh?: boolean,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/analytics/menu/refresh/{business_id}',
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
