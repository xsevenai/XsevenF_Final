/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Search menu items
 */
export type MenuItemSearch = {
    query?: (string | null);
    category_id?: (string | null);
    is_available?: (boolean | null);
    tags?: (Array<string> | null);
    min_price?: (number | string | null);
    max_price?: (number | string | null);
    limit?: number;
    offset?: number;
};

