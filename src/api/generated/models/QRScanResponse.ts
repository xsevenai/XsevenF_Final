/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Response model for QR code scanning
 */
export type QRScanResponse = {
    valid: boolean;
    type?: (string | null);
    target_id?: (string | null);
    business_id?: (string | null);
    data?: (Record<string, any> | null);
    action_url?: (string | null);
    message?: (string | null);
};

