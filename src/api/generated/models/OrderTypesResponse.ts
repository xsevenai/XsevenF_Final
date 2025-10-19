/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderTypeData } from './OrderTypeData';
/**
 * Response model for order types distribution
 */
export type OrderTypesResponse = {
    business_id: string;
    period: string;
    type_data: Array<OrderTypeData>;
    generated_at: string;
};

