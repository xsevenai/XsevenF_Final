/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReviewCreate = {
    menu_item_id: string;
    customer_id?: (string | null);
    order_id?: (string | null);
    /**
     * Rating from 1 to 5
     */
    rating: number;
    review_text?: (string | null);
    is_verified?: boolean;
};

