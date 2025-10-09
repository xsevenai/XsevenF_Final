/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Working hours for a day
 */
export type WorkingHours = {
    day_of_week: number;
    is_open: boolean;
    open_time?: (string | null);
    close_time?: (string | null);
    breaks?: Array<Record<string, string>>;
};

