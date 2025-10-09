/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { KDSOrderItem } from './KDSOrderItem';
import type { KDSStatus } from './KDSStatus';
/**
 * KDS order with performance metrics
 */
export type KDSOrderWithMetrics = {
    order_id: string;
    station: string;
    items: Array<KDSOrderItem>;
    priority?: number;
    target_time?: (string | null);
    id: string;
    business_id: string;
    status: KDSStatus;
    prep_start_time?: (string | null);
    prep_end_time?: (string | null);
    assigned_to?: (string | null);
    created_at: string;
    updated_at: string;
    prep_duration?: (number | null);
    is_late?: boolean;
    time_remaining?: (number | null);
};

