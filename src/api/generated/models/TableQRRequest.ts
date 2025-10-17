/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request model for table QR code
 */
export type TableQRRequest = {
    table_number: string;
    business_id: string;
    location_id?: (string | null);
    capacity?: (number | null);
    qr_size?: number;
};

