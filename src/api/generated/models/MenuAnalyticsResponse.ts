/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryPerformanceResponse } from './CategoryPerformanceResponse';
import type { MenuAnalyticsOverview } from './MenuAnalyticsOverview';
import type { ProfitMarginResponse } from './ProfitMarginResponse';
import type { TopMenuItemsResponse } from './TopMenuItemsResponse';
/**
 * Comprehensive menu analytics dashboard response
 */
export type MenuAnalyticsResponse = {
    business_id: string;
    period: string;
    overview: MenuAnalyticsOverview;
    top_items: TopMenuItemsResponse;
    category_performance: CategoryPerformanceResponse;
    profit_margins: ProfitMarginResponse;
    generated_at: string;
    cache_expires_at: string;
};

