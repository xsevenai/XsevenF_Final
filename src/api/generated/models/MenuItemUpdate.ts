/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AvailabilitySchedule } from './AvailabilitySchedule';
import type { MenuItemVariant_Input } from './MenuItemVariant_Input';
/**
 * Update menu item
 */
export type MenuItemUpdate = {
    name?: (string | null);
    description?: (string | null);
    category_id?: (string | null);
    price?: (number | string | null);
    cost?: (number | string | null);
    image_url?: (string | null);
    sku?: (string | null);
    barcode?: (string | null);
    is_available?: (boolean | null);
    prep_time?: (number | null);
    calories?: (number | null);
    allergens?: (Array<string> | null);
    tags?: (Array<string> | null);
    variants?: (Array<MenuItemVariant_Input> | null);
    modifiers?: (Array<string> | null);
    availability_schedule?: (Array<AvailabilitySchedule> | null);
    locations?: (Array<string> | null);
    metadata?: (Record<string, any> | null);
};

