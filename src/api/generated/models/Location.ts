/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Location response model
 */
export type Location = {
    name: string;
    address?: (string | null);
    phone?: (string | null);
    email?: (string | null);
    timezone?: string;
    settings?: Record<string, any>;
    is_active?: boolean;
    id: string;
    business_id: string;
    created_at: string;
    updated_at: string;
};

