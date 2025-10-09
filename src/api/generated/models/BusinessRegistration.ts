/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Business registration model
 */
export type BusinessRegistration = {
    email: string;
    password: string;
    full_name: string;
    phone_number?: (string | null);
    business_name: string;
    /**
     * restaurant, salon, retail, etc.
     */
    business_type: string;
    business_email?: (string | null);
    business_phone?: (string | null);
    business_address?: (string | null);
    timezone?: string;
    currency?: string;
};

