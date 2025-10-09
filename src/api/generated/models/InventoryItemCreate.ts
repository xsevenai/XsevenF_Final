/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Create inventory item
 */
export type InventoryItemCreate = {
    name: string;
    description?: (string | null);
    sku?: (string | null);
    unit: string;
    current_stock?: (number | string);
    min_stock?: (number | string);
    max_stock?: (number | string | null);
    unit_cost?: (number | string | null);
    supplier_id?: (string | null);
    location_id?: (string | null);
    category?: (string | null);
    is_tracked?: boolean;
    business_id: string;
};

