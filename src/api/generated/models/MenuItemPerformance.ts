/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Individual menu item performance metrics
 */
export type MenuItemPerformance = {
    item_id: string;
    name: string;
    category_name: string;
    price: number;
    cost: number;
    sales_count: number;
    total_quantity: number;
    total_revenue: number;
    total_cost: number;
    profit_margin: number;
    margin_percentage: number;
    image_url?: (string | null);
    is_available?: boolean;
    tags?: Array<string>;
};

