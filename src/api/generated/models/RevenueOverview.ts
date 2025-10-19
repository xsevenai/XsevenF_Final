/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Revenue analytics overview with key metrics and trends
 */
export type RevenueOverview = {
    business_id: string;
    period: string;
    total_revenue: number;
    daily_revenue: number;
    weekly_revenue: number;
    monthly_revenue: number;
    revenue_growth: number;
    daily_growth: number;
    weekly_growth: number;
    monthly_growth: number;
    average_order_value: number;
    revenue_per_customer: number;
    total_orders: number;
    total_customers: number;
    last_updated: string;
    trends_included?: boolean;
};

