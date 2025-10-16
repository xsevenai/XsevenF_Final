/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Response model for profit margin analysis
 */
export type ProfitMarginResponse = {
    business_id: string;
    total_items: number;
    items_with_cost: number;
    items_without_cost: number;
    overall_analysis: Record<string, any>;
    high_margin_items: Array<Record<string, any>>;
    low_margin_items: Array<Record<string, any>>;
    medium_margin_items: Array<Record<string, any>>;
    margin_distribution: Array<Record<string, any>>;
    recommendations: Array<Record<string, any>>;
    analysis_date: string;
};

