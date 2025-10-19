/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RevenueProjection } from './RevenueProjection';
/**
 * Revenue projection response
 */
export type RevenueProjectionResponse = {
    business_id: string;
    months: number;
    projection_data: Array<RevenueProjection>;
    avg_growth_rate: number;
    generated_at: string;
};

