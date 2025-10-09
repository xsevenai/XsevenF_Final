/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Create floor plan
 */
export type FloorPlanCreate = {
    name: string;
    location_id?: (string | null);
    layout: Record<string, any>;
    is_active?: boolean;
    business_id: string;
};

