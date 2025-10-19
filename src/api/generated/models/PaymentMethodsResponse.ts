/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaymentMethodData } from './PaymentMethodData';
/**
 * Payment methods revenue response
 */
export type PaymentMethodsResponse = {
    business_id: string;
    period: string;
    payment_data: Array<PaymentMethodData>;
    total_revenue: number;
    generated_at: string;
};

