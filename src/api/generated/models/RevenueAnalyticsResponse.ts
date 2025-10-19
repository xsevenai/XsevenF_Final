/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaymentMethodsResponse } from './PaymentMethodsResponse';
import type { RevenueByCategoryResponse } from './RevenueByCategoryResponse';
import type { RevenueByChannelResponse } from './RevenueByChannelResponse';
import type { RevenueByHourResponse } from './RevenueByHourResponse';
import type { RevenueOverview } from './RevenueOverview';
import type { RevenueProjectionResponse } from './RevenueProjectionResponse';
import type { RevenueTrendResponse } from './RevenueTrendResponse';
import type { TopRevenueItemsResponse } from './TopRevenueItemsResponse';
/**
 * Comprehensive revenue analytics dashboard response
 */
export type RevenueAnalyticsResponse = {
    business_id: string;
    period: string;
    overview: RevenueOverview;
    trend_data: RevenueTrendResponse;
    channel_data: RevenueByChannelResponse;
    hour_data: RevenueByHourResponse;
    payment_methods: PaymentMethodsResponse;
    category_data: RevenueByCategoryResponse;
    top_items: TopRevenueItemsResponse;
    projection_data: RevenueProjectionResponse;
    generated_at: string;
    cache_expires_at: string;
};

