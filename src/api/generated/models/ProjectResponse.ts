/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProjectResponse = {
    client_id: string;
    name: string;
    description?: (string | null);
    project_number?: (string | null);
    status?: string;
    priority?: string;
    start_date?: (string | null);
    end_date?: (string | null);
    estimated_hours?: (number | null);
    hourly_rate?: (number | null);
    budget?: (number | null);
    assigned_staff?: (Array<string> | null);
    tags?: (Array<string> | null);
    metadata?: (Record<string, any> | null);
    id: string;
    business_id: string;
    actual_hours?: number;
    total_cost?: number;
    created_at: string;
    updated_at: string;
};

