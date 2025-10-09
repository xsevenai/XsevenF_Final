/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PurchaseOrderStatus } from './PurchaseOrderStatus';
/**
 * Update purchase order
 */
export type PurchaseOrderUpdate = {
    status?: (PurchaseOrderStatus | null);
    expected_delivery_date?: (string | null);
    actual_delivery_date?: (string | null);
    notes?: (string | null);
};

