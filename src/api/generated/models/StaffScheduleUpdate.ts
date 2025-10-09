/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ShiftStatus } from './ShiftStatus';
/**
 * Update staff schedule
 */
export type StaffScheduleUpdate = {
    shift_date?: (string | null);
    shift_start?: (string | null);
    shift_end?: (string | null);
    break_duration?: (number | null);
    position?: (string | null);
    notes?: (string | null);
    status?: (ShiftStatus | null);
};

