/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Real-time operations dashboard
 */
export type OperationsDashboard = {
    business_id: string;
    timestamp: string;
    tables: Record<string, any>;
    kitchen: Record<string, any>;
    staff: Record<string, any>;
    orders: Record<string, any>;
    revenue_today: string;
    avg_table_turnover?: (number | null);
    avg_prep_time?: (number | null);
};

