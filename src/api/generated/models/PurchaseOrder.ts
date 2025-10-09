/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PurchaseOrderItem_Output } from './PurchaseOrderItem_Output';
import type { PurchaseOrderStatus } from './PurchaseOrderStatus';
/**
 * Purchase order response model
 */
export type PurchaseOrder = {
    supplier_id: string;
    order_date: string;
    expected_delivery_date?: (string | null);
    items: Array<PurchaseOrderItem_Output>;
    notes?: (string | null);
    id: string;
    business_id: string;
    order_number: string;
    status: PurchaseOrderStatus;
    total_amount: string;
    actual_delivery_date?: (string | null);
    created_by?: (string | null);
    created_at: string;
    updated_at: string;
};

