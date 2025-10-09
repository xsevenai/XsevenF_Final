/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Time clock response model
 */
export type TimeClock = {
    staff_id: string;
    clock_in: string;
    location_id?: (string | null);
    notes?: (string | null);
    id: string;
    business_id: string;
    clock_out?: (string | null);
    break_start?: (string | null);
    break_end?: (string | null);
    total_hours?: (string | null);
    overtime_hours?: (string | null);
    created_at: string;
    updated_at: string;
};

