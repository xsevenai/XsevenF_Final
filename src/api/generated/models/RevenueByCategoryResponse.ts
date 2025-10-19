/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RevenueByCategory } from './RevenueByCategory';
/**
 * Revenue by category response
 */
export type RevenueByCategoryResponse = {
    business_id: string;
    period: string;
    category_data: Array<RevenueByCategory>;
    total_revenue: number;
    generated_at: string;
};

