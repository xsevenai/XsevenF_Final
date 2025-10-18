/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

// Orders Analytics Response Types
export interface OrdersOverview {
    business_id: string;
    period: string;
    total_orders: number;
    completed_orders: number;
    pending_orders: number;
    cancelled_orders: number;
    total_revenue: number;
    average_order_value: number;
    orders_growth: number;
    revenue_growth: number;
    completion_rate: number;
    cancellation_rate: number;
    last_updated: string;
}

export interface OrderTrendData {
    day: string;
    orders: number;
    revenue: number;
}

export interface OrdersTrendResponse {
    business_id: string;
    period: string;
    trend_data: OrderTrendData[];
    generated_at: string;
}

export interface OrderHourData {
    hour: string;
    orders: number;
}

export interface OrdersByHourResponse {
    business_id: string;
    period: string;
    hour_data: OrderHourData[];
    peak_hour: string;
    generated_at: string;
}

export interface OrderStatusData {
    status: string;
    count: number;
    percentage: number;
}

export interface OrderStatusDistributionResponse {
    business_id: string;
    period: string;
    status_data: OrderStatusData[];
    generated_at: string;
}

export interface OrderTypeData {
    type: string;
    count: number;
    percentage: number;
}

export interface OrderTypesResponse {
    business_id: string;
    period: string;
    type_data: OrderTypeData[];
    generated_at: string;
}

export interface TopSellingItem {
    name: string;
    quantity: number;
    revenue: number;
}

export interface TopSellingItemsResponse {
    business_id: string;
    period: string;
    top_items: TopSellingItem[];
    generated_at: string;
}

export interface OrdersAnalyticsResponse {
    business_id: string;
    period: string;
    overview: OrdersOverview;
    trend_data: OrdersTrendResponse;
    status_distribution: OrderStatusDistributionResponse;
    hour_data: OrdersByHourResponse;
    order_types: OrderTypesResponse;
    top_items: TopSellingItemsResponse;
    generated_at: string;
    cache_expires_at: string;
}

export class OrdersAnalyticsService {
    /**
     * Get Orders Overview
     * Get comprehensive orders analytics overview
     * 
     * - **Key Metrics**: Total orders, completed, pending, cancelled counts
     * - **Revenue Metrics**: Total revenue, average order value
     * - **Growth Trends**: Period-over-period growth calculations
     * - **Performance Rates**: Completion and cancellation rates
     * @returns OrdersOverview Successful Response
     * @throws ApiError
     */
    public static getOrdersOverviewApiV1OrdersOverviewBusinessIdGet({
        businessId,
        period = '7d',
    }: {
        businessId: string,
        period?: string,
    }): CancelablePromise<OrdersOverview> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/menu/orders/overview/{business_id}',
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
     * Get Orders Trend
     * Get daily orders trend data for charts
     * 
     * - **Daily Volume**: Orders and revenue by day
     * - **Chart Data**: Formatted for line/bar charts
     * - **Time Period**: Configurable date ranges
     * @returns OrdersTrendResponse Successful Response
     * @throws ApiError
     */
    public static getOrdersTrendApiV1OrdersTrendBusinessIdGet({
        businessId,
        period = '7d',
    }: {
        businessId: string,
        period?: string,
    }): CancelablePromise<OrdersTrendResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/menu/orders/trend/{business_id}',
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
     * Get Orders by Hour
     * Get orders by hour for peak time analysis
     * 
     * - **Hourly Distribution**: Orders by hour of day
     * - **Peak Hours**: Identify busiest times
     * - **Chart Data**: Formatted for bar charts
     * @returns OrdersByHourResponse Successful Response
     * @throws ApiError
     */
    public static getOrdersByHourApiV1OrdersByHourBusinessIdGet({
        businessId,
        period = '7d',
    }: {
        businessId: string,
        period?: string,
    }): CancelablePromise<OrdersByHourResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/menu/orders/by-hour/{business_id}',
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
     * Get Order Status Distribution
     * Get order status distribution for pie charts
     * 
     * - **Status Breakdown**: Completed, Pending, Cancelled
     * - **Percentages**: Calculated distribution
     * - **Chart Data**: Formatted for pie charts
     * @returns OrderStatusDistributionResponse Successful Response
     * @throws ApiError
     */
    public static getOrderStatusDistributionApiV1OrdersStatusDistributionBusinessIdGet({
        businessId,
        period = '7d',
    }: {
        businessId: string,
        period?: string,
    }): CancelablePromise<OrderStatusDistributionResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/menu/orders/status-distribution/{business_id}',
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
     * Get Order Types Distribution
     * Get order types distribution (dine-in, takeout, delivery)
     * 
     * - **Order Types**: Dine-in, Takeout, Delivery
     * - **Distribution**: Count and percentage breakdown
     * - **Chart Data**: Formatted for pie charts
     * @returns OrderTypesResponse Successful Response
     * @throws ApiError
     */
    public static getOrderTypesDistributionApiV1OrdersTypesBusinessIdGet({
        businessId,
        period = '7d',
    }: {
        businessId: string,
        period?: string,
    }): CancelablePromise<OrderTypesResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/menu/orders/types/{business_id}',
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
     * Get Top Selling Items
     * Get top selling menu items by quantity and revenue
     * 
     * - **Top Items**: Best performing menu items
     * - **Metrics**: Quantity sold and revenue generated
     * - **Ranking**: Sorted by quantity sold
     * @returns TopSellingItemsResponse Successful Response
     * @throws ApiError
     */
    public static getTopSellingItemsApiV1OrdersTopItemsBusinessIdGet({
        businessId,
        period = '7d',
        limit = 5,
    }: {
        businessId: string,
        period?: string,
        limit?: number,
    }): CancelablePromise<TopSellingItemsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/menu/orders/top-items/{business_id}',
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
     * Get Orders Analytics Dashboard
     * Get comprehensive orders analytics dashboard data
     * 
     * - **Combined Data**: Overview, trends, distributions, top items
     * - **Real-time**: Latest data with caching considerations
     * - **Customizable**: Configurable time periods
     * @returns OrdersAnalyticsResponse Successful Response
     * @throws ApiError
     */
    public static getOrdersAnalyticsDashboardApiV1OrdersDashboardBusinessIdGet({
        businessId,
        period = '7d',
    }: {
        businessId: string,
        period?: string,
    }): CancelablePromise<OrdersAnalyticsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/menu/orders/dashboard/{business_id}',
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
     * Refresh Orders Analytics
     * Refresh orders analytics data
     * 
     * - **Cache Invalidation**: Clear cached analytics data
     * - **Real-time Update**: Force recalculation of all metrics
     * - **WebSocket Notification**: Notify frontend of data refresh
     * @returns any Successful Response
     * @throws ApiError
     */
    public static refreshOrdersAnalyticsApiV1OrdersRefreshBusinessIdPost({
        businessId,
        forceRefresh = false,
    }: {
        businessId: string,
        forceRefresh?: boolean,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/analytics/menu/orders/refresh/{business_id}',
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
