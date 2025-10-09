/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AlertType } from './AlertType';
/**
 * Create stock alert
 */
export type StockAlertCreate = {
    inventory_item_id: string;
    alert_type: AlertType;
    threshold?: (number | string | null);
    is_active?: boolean;
    business_id: string;
};

