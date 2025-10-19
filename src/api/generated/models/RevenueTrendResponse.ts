/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RevenueTrendData } from './RevenueTrendData';
/**
 * Revenue trend response
 */
export type RevenueTrendResponse = {
    business_id: string;
    period: string;
    trend_data: Array<RevenueTrendData>;
    generated_at: string;
};

