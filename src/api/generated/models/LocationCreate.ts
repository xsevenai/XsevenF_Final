/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Create location
 */
export type LocationCreate = {
    name: string;
    address?: (string | null);
    phone?: (string | null);
    email?: (string | null);
    timezone?: string;
    settings?: Record<string, any>;
    is_active?: boolean;
    business_id: string;
};

