/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RevenueByChannel } from './RevenueByChannel';
/**
 * Revenue by channel response
 */
export type RevenueByChannelResponse = {
    business_id: string;
    period: string;
    channel_data: Array<RevenueByChannel>;
    total_revenue: number;
    generated_at: string;
};

