/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Create staff member
 */
export type StaffMemberCreate = {
    employee_id?: (string | null);
    first_name: string;
    last_name: string;
    email?: (string | null);
    phone?: (string | null);
    position?: (string | null);
    department?: (string | null);
    hourly_rate?: (number | string | null);
    hire_date?: (string | null);
    status?: string;
    permissions?: Array<string>;
    metadata?: Record<string, any>;
    business_id: string;
    user_id?: (string | null);
};

