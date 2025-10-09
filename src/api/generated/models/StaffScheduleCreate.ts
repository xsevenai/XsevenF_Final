/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ShiftStatus } from './ShiftStatus';
/**
 * Create staff schedule
 */
export type StaffScheduleCreate = {
    staff_id: string;
    location_id?: (string | null);
    shift_date: string;
    shift_start: string;
    shift_end: string;
    break_duration?: (number | null);
    position?: (string | null);
    notes?: (string | null);
    status?: ShiftStatus;
    business_id: string;
};

