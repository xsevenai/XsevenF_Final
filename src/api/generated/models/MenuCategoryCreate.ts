/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Create menu category
 */
export type MenuCategoryCreate = {
    name: string;
    description?: (string | null);
    parent_id?: (string | null);
    display_order?: number;
    icon_url?: (string | null);
    is_active?: boolean;
    business_id: string;
};

