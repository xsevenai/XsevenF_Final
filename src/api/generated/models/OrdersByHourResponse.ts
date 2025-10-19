/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderHourData } from './OrderHourData';
/**
 * Response model for orders by hour analytics
 */
export type OrdersByHourResponse = {
    business_id: string;
    period: string;
    hour_data: Array<OrderHourData>;
    peak_hour: string;
    generated_at: string;
};

