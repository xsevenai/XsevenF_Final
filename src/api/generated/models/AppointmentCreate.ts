/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AppointmentCreate = {
    service_id?: (string | null);
    client_id: string;
    staff_id?: (string | null);
    scheduled_time: string;
    end_time: string;
    duration_minutes: number;
    status?: string;
    notes?: (string | null);
    reminder_sent?: boolean;
    metadata?: (Record<string, any> | null);
    business_id: string;
};

