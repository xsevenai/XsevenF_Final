/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Orders analytics overview with key metrics
 */
export type OrdersOverview = {
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
};

