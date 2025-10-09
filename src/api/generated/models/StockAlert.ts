/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AlertType } from './AlertType';
/**
 * Stock alert response model
 */
export type StockAlert = {
    inventory_item_id: string;
    alert_type: AlertType;
    threshold?: (string | null);
    is_active?: boolean;
    id: string;
    business_id: string;
    last_triggered_at?: (string | null);
    created_at: string;
    updated_at: string;
};

