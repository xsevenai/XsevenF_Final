/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MenuItemPerformance } from './MenuItemPerformance';
/**
 * Response model for top menu items analytics
 */
export type TopMenuItemsResponse = {
    business_id: string;
    period: string;
    sort_by: string;
    total_items: number;
    items: Array<MenuItemPerformance>;
    generated_at: string;
};

