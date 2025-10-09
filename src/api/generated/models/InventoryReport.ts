/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Inventory report
 */
export type InventoryReport = {
    business_id: string;
    report_date: string;
    total_items: number;
    total_value: string;
    low_stock_items: number;
    out_of_stock_items: number;
    items_by_category: Record<string, number>;
    top_value_items: Array<Record<string, any>>;
};

