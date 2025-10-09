/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Create supplier
 */
export type SupplierCreate = {
    name: string;
    contact_name?: (string | null);
    email?: (string | null);
    phone?: (string | null);
    address?: (string | null);
    website?: (string | null);
    payment_terms?: (string | null);
    notes?: (string | null);
    is_active?: boolean;
    business_id: string;
};

