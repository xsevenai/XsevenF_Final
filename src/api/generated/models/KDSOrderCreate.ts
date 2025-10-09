/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { KDSOrderItem } from './KDSOrderItem';
/**
 * Create KDS order
 */
export type KDSOrderCreate = {
    order_id: string;
    station: string;
    items: Array<KDSOrderItem>;
    priority?: number;
    target_time?: (string | null);
    business_id: string;
};

