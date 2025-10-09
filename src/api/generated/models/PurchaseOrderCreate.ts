/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PurchaseOrderItem_Input } from './PurchaseOrderItem_Input';
/**
 * Create purchase order
 */
export type PurchaseOrderCreate = {
    supplier_id: string;
    order_date: string;
    expected_delivery_date?: (string | null);
    items: Array<PurchaseOrderItem_Input>;
    notes?: (string | null);
    business_id: string;
};

