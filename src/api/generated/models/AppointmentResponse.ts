/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AppointmentResponse = {
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
    id: string;
    business_id: string;
    created_at: string;
    updated_at: string;
};

