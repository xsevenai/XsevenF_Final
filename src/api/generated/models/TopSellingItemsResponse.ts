/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TopSellingItem } from './TopSellingItem';
/**
 * Response model for top selling items
 */
export type TopSellingItemsResponse = {
    business_id: string;
    period: string;
    top_items: Array<TopSellingItem>;
    generated_at: string;
};

