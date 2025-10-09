/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Location } from './Location';
import type { TablePosition } from './TablePosition';
import type { TableStatus } from './TableStatus';
/**
 * Table with full details
 */
export type TableWithDetails = {
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
    location?: (Location | null);
    current_order?: (Record<string, any> | null);
    occupied_duration?: (number | null);
    estimated_turnover?: (string | null);
};

