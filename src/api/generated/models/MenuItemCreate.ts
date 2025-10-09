/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AvailabilitySchedule } from './AvailabilitySchedule';
import type { MenuItemVariant_Input } from './MenuItemVariant_Input';
/**
 * Create menu item
 */
export type MenuItemCreate = {
    name: string;
    description?: (string | null);
    category_id?: (string | null);
    price: (number | string);
    cost?: (number | string | null);
    image_url?: (string | null);
    sku?: (string | null);
    barcode?: (string | null);
    is_available?: boolean;
    prep_time?: (number | null);
    calories?: (number | null);
    allergens?: Array<string>;
    tags?: Array<string>;
    variants?: Array<MenuItemVariant_Input>;
    modifiers?: Array<string>;
    availability_schedule?: (Array<AvailabilitySchedule> | null);
    locations?: Array<string>;
    metadata?: Record<string, any>;
    business_id: string;
};

