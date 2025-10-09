/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Inventory item with calculated metrics
 */
export type InventoryItemWithMetrics = {
    name: string;
    description?: (string | null);
    sku?: (string | null);
    unit: string;
    current_stock?: string;
    min_stock?: string;
    max_stock?: (string | null);
    unit_cost?: (string | null);
    supplier_id?: (string | null);
    location_id?: (string | null);
    category?: (string | null);
    is_tracked?: boolean;
    id: string;
    business_id: string;
    last_counted_at?: (string | null);
    created_at: string;
    updated_at: string;
    stock_percentage?: (string | null);
    stock_value?: (string | null);
    needs_reorder?: boolean;
    days_of_stock?: (number | null);
};

