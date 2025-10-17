/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request model for QR code generation
 */
export type QRCodeRequest = {
    type: string;
    target_id: string;
    business_id: string;
    size?: number;
    format?: string;
    include_logo?: boolean;
    custom_data?: (Record<string, any> | null);
};

