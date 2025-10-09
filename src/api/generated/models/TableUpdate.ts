/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TablePosition } from './TablePosition';
import type { TableStatus } from './TableStatus';
/**
 * Update table
 */
export type TableUpdate = {
    table_number?: (string | null);
    capacity?: (number | null);
    location_id?: (string | null);
    floor_plan_id?: (string | null);
    position?: (TablePosition | null);
    shape?: (string | null);
    status?: (TableStatus | null);
    current_order_id?: (string | null);
    metadata?: (Record<string, any> | null);
};

