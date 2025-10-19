/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrdersByHourResponse } from './OrdersByHourResponse';
import type { OrdersOverview } from './OrdersOverview';
import type { OrderStatusDistributionResponse } from './OrderStatusDistributionResponse';
import type { OrdersTrendResponse } from './OrdersTrendResponse';
import type { OrderTypesResponse } from './OrderTypesResponse';
import type { TopSellingItemsResponse } from './TopSellingItemsResponse';
/**
 * Comprehensive orders analytics dashboard response
 */
export type OrdersAnalyticsResponse = {
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
};

