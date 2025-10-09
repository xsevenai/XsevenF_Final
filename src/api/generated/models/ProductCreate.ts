/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProductCreate = {
    name: string;
    description?: (string | null);
    sku?: (string | null);
    barcode?: (string | null);
    category?: (string | null);
    brand?: (string | null);
    price: number;
    cost?: (number | null);
    compare_at_price?: (number | null);
    tax_rate?: number;
    weight?: (number | null);
    weight_unit?: (string | null);
    dimensions?: (Record<string, any> | null);
    image_urls?: (Array<string> | null);
    is_available?: boolean;
    track_inventory?: boolean;
    inventory_quantity?: number;
    low_stock_threshold?: number;
    tags?: (Array<string> | null);
    variants?: null;
    metadata?: (Record<string, any> | null);
    business_id: string;
};

