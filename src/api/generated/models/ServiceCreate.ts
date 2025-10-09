/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ServiceCreate = {
    name: string;
    description?: (string | null);
    duration_minutes: number;
    price: number;
    category?: (string | null);
    is_active?: boolean;
    staff_ids?: (Array<string> | null);
    image_url?: (string | null);
    metadata?: (Record<string, any> | null);
    business_id: string;
};

