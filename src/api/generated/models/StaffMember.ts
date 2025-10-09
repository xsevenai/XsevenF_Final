/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Staff member response model
 */
export type StaffMember = {
    employee_id?: (string | null);
    first_name: string;
    last_name: string;
    email?: (string | null);
    phone?: (string | null);
    position?: (string | null);
    department?: (string | null);
    hourly_rate?: (string | null);
    hire_date?: (string | null);
    status?: string;
    permissions?: Array<string>;
    metadata?: Record<string, any>;
    id: string;
    business_id: string;
    user_id?: (string | null);
    created_at: string;
    updated_at: string;
};

