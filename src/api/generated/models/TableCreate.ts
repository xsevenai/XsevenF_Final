/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TablePosition } from './TablePosition';
import type { TableStatus } from './TableStatus';
/**
 * Create table
 */
export type TableCreate = {
    table_number: number;
    capacity: number;
    location_id?: (string | null);
    floor_plan_id?: (string | null);
    position?: (TablePosition | null);
    shape?: (string | null);
    status?: TableStatus;
    metadata?: Record<string, any>;
    business_id: string;
};

