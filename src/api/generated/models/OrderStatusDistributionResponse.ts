/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderStatusData } from './OrderStatusData';
/**
 * Response model for order status distribution
 */
export type OrderStatusDistributionResponse = {
    business_id: string;
    period: string;
    status_data: Array<OrderStatusData>;
    generated_at: string;
};

