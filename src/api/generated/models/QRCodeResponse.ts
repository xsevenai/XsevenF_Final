/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Response model for QR code generation
 */
export type QRCodeResponse = {
    qr_id: string;
    type: string;
    target_id: string;
    business_id: string;
    qr_data: string;
    qr_url?: (string | null);
    created_at: string;
    expires_at?: (string | null);
};

