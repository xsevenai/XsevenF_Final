/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderTrendData } from './OrderTrendData';
/**
 * Response model for orders trend analytics
 */
export type OrdersTrendResponse = {
    business_id: string;
    period: string;
    trend_data: Array<OrderTrendData>;
    generated_at: string;
};

