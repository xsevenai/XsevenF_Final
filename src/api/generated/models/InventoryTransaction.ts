/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TransactionType } from './TransactionType';
/**
 * Inventory transaction response model
 */
export type InventoryTransaction = {
    inventory_item_id: string;
    transaction_type: TransactionType;
    quantity: string;
    unit_cost?: (string | null);
    reference_type?: (string | null);
    reference_id?: (string | null);
    notes?: (string | null);
    id: string;
    business_id: string;
    performed_by?: (string | null);
    created_at: string;
};

