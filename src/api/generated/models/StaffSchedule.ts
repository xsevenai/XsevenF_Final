/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ShiftStatus } from './ShiftStatus';
/**
 * Staff schedule response model
 */
export type StaffSchedule = {
    staff_id: string;
    location_id?: (string | null);
    shift_date: string;
    shift_start: string;
    shift_end: string;
    break_duration?: (number | null);
    position?: (string | null);
    notes?: (string | null);
    status?: ShiftStatus;
    id: string;
    business_id: string;
    created_at: string;
    updated_at: string;
};

