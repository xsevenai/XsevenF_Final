/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReviewCreate } from '../models/ReviewCreate';
import type { ReviewResponse } from '../models/ReviewResponse';
import type { ReviewStats } from '../models/ReviewStats';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MenuReviewsService {
    /**
     * Create Review
     * Create a new menu item review
     * @returns ReviewResponse Successful Response
     * @throws ApiError
     */
    public static createReviewApiV1ReviewsBusinessIdPost({
        businessId,
        requestBody,
    }: {
        businessId: string,
        requestBody: ReviewCreate,
    }): CancelablePromise<ReviewResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/reviews/{business_id}',
            path: {
                'business_id': businessId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Review Stats
     * Get review statistics for business or specific menu item
     * @returns ReviewStats Successful Response
     * @throws ApiError
     */
    public static getReviewStatsApiV1ReviewsBusinessIdStatsGet({
        businessId,
        menuItemId,
    }: {
        businessId: string,
        menuItemId?: (string | null),
    }): CancelablePromise<ReviewStats> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/reviews/{business_id}/stats',
            path: {
                'business_id': businessId,
            },
            query: {
                'menu_item_id': menuItemId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Item Reviews
     * Get reviews for a specific menu item
     * @returns ReviewResponse Successful Response
     * @throws ApiError
     */
    public static getItemReviewsApiV1ReviewsBusinessIdItemMenuItemIdGet({
        businessId,
        menuItemId,
        limit = 20,
        offset,
    }: {
        businessId: string,
        menuItemId: string,
        limit?: number,
        offset?: number,
    }): CancelablePromise<Array<ReviewResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/reviews/{business_id}/item/{menu_item_id}',
            path: {
                'business_id': businessId,
                'menu_item_id': menuItemId,
            },
            query: {
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Review
     * Delete a review (admin only)
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteReviewApiV1ReviewsBusinessIdReviewIdDelete({
        businessId,
        reviewId,
    }: {
        businessId: string,
        reviewId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/reviews/{business_id}/{review_id}',
            path: {
                'business_id': businessId,
                'review_id': reviewId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
