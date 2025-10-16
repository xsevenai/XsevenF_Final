/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryPerformance } from './CategoryPerformance';
/**
 * Response model for category performance analytics
 */
export type CategoryPerformanceResponse = {
    business_id: string;
    period: string;
    total_categories: number;
    categories: Array<CategoryPerformance>;
    include_details?: boolean;
    generated_at: string;
};

