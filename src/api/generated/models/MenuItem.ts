/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AvailabilitySchedule } from './AvailabilitySchedule';
import type { MenuItemVariant_Output } from './MenuItemVariant_Output';
/**
 * Menu item response model
 */
export type MenuItem = {
    name: string;
    description?: (string | null);
    category_id?: (string | null);
    price: string;
    cost?: (string | null);
    image_url?: (string | null);
    sku?: (string | null);
    barcode?: (string | null);
    is_available?: boolean;
    prep_time?: (number | null);
    calories?: (number | null);
    allergens?: Array<string>;
    tags?: Array<string>;
    variants?: Array<MenuItemVariant_Output>;
    modifiers?: Array<string>;
    availability_schedule?: (Array<AvailabilitySchedule> | null);
    locations?: Array<string>;
    metadata?: Record<string, any>;
    id: string;
    business_id: string;
    created_at: string;
    updated_at: string;
};

