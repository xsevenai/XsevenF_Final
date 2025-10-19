/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RevenueByHour } from './RevenueByHour';
/**
 * Revenue by hour response
 */
export type RevenueByHourResponse = {
    business_id: string;
    period: string;
    hour_data: Array<RevenueByHour>;
    peak_hour: string;
    peak_hour_revenue: number;
    generated_at: string;
};

