/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Search inventory items
 */
export type InventorySearch = {
    query?: (string | null);
    category?: (string | null);
    supplier_id?: (string | null);
    location_id?: (string | null);
    low_stock_only?: boolean;
    out_of_stock_only?: boolean;
    limit?: number;
    offset?: number;
};

