/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TablePosition } from './TablePosition';
import type { TableStatus } from './TableStatus';
/**
 * Table response model
 */
export type Table = {
    table_number: string;
    capacity: number;
    location_id?: (string | null);
    floor_plan_id?: (string | null);
    position?: (TablePosition | null);
    shape?: (string | null);
    status?: TableStatus;
    metadata?: Record<string, any>;
    id: string;
    business_id: string;
    current_order_id?: (string | null);
    created_at: string;
    updated_at: string;
};

