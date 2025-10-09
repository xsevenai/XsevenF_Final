/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TimeEntryCreate = {
    project_id?: (string | null);
    staff_id: string;
    start_time: string;
    end_time?: (string | null);
    duration_hours?: (number | null);
    description?: (string | null);
    billable?: boolean;
    hourly_rate?: (number | null);
    status?: string;
    metadata?: (Record<string, any> | null);
    business_id: string;
};

