/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MenuItem } from '../models/MenuItem';
import type { MenuItemCreate } from '../models/MenuItemCreate';
import type { QRCodeRequest } from '../models/QRCodeRequest';
import type { QRCodeResponse } from '../models/QRCodeResponse';
import type { QRScanRequest } from '../models/QRScanRequest';
import type { QRScanResponse } from '../models/QRScanResponse';
import type { TableQRRequest } from '../models/TableQRRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FoodQrManagementService {
    /**
     * Generate Qr Code
     * Generate QR code for food-related items
     *
     * - **Menu items**: Direct link to item details
     * - **Tables**: Table ordering interface
     * - **Orders**: Order tracking and status
     * - **Categories**: Category browsing
     * - **Business**: Business info and menu
     * @returns QRCodeResponse Successful Response
     * @throws ApiError
     */
    public static generateQrCodeApiV1FoodQrGeneratePost({
        requestBody,
    }: {
        requestBody: QRCodeRequest,
    }): CancelablePromise<QRCodeResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/food/qr/generate',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Qr Image
     * Get QR code image
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getQrImageApiV1FoodQrImageQrIdGet({
        qrId,
    }: {
        qrId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/qr/image/{qr_id}',
            path: {
                'qr_id': qrId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Bulk Generate Qr Codes
     * Bulk generate QR codes for multiple items
     *
     * - **Efficiency**: Generate multiple QR codes at once
     * - **Batch processing**: Optimized for large quantities
     * - **Consistent formatting**: Same settings for all codes
     * @returns QRCodeResponse Successful Response
     * @throws ApiError
     */
    public static bulkGenerateQrCodesApiV1FoodQrBulkGeneratePost({
        businessId,
        qrType,
        targetIds,
        size = 200,
        format = 'png',
    }: {
        businessId: string,
        qrType: string,
        targetIds: Array<string>,
        size?: number,
        format?: string,
    }): CancelablePromise<Array<QRCodeResponse>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/food/qr/bulk-generate',
            query: {
                'business_id': businessId,
                'qr_type': qrType,
                'target_ids': targetIds,
                'size': size,
                'format': format,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Scan Qr Code
     * Scan and validate QR code
     *
     * - **Validation**: Verify QR code authenticity
     * - **Data extraction**: Parse QR code content
     * - **Action routing**: Determine next steps
     * - **Analytics**: Track scan events
     * @returns QRScanResponse Successful Response
     * @throws ApiError
     */
    public static scanQrCodeApiV1FoodQrScanPost({
        requestBody,
    }: {
        requestBody: QRScanRequest,
    }): CancelablePromise<QRScanResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/food/qr/scan',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Qr Analytics
     * Get QR code analytics
     *
     * - **Scan metrics**: Total scans, unique scans, scan frequency
     * - **Popular items**: Most scanned QR codes
     * - **Time patterns**: Peak scanning times
     * - **Conversion**: Scans to actions
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getQrAnalyticsApiV1FoodQrAnalyticsBusinessIdGet({
        businessId,
        period = '7d',
        qrType,
    }: {
        businessId: string,
        period?: string,
        qrType?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/qr/analytics/{business_id}',
            path: {
                'business_id': businessId,
            },
            query: {
                'period': period,
                'qr_type': qrType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Popular Qr Codes
     * Get most popular QR codes by scan count
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getPopularQrCodesApiV1FoodQrPopularBusinessIdGet({
        businessId,
        limit = 10,
        period = '7d',
    }: {
        businessId: string,
        limit?: number,
        period?: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/qr/popular/{business_id}',
            path: {
                'business_id': businessId,
            },
            query: {
                'limit': limit,
                'period': period,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Food Item With Qr
     * Create food item with automatic QR code generation
     *
     * - **Auto QR**: Automatically generate QR code for new items
     * - **Integration**: Seamless integration with menu system
     * - **Tracking**: Enable QR-based tracking from creation
     * @returns MenuItem Successful Response
     * @throws ApiError
     */
    public static createFoodItemWithQrApiV1FoodItemsPost({
        requestBody,
        generateQr = true,
    }: {
        requestBody: MenuItemCreate,
        generateQr?: boolean,
    }): CancelablePromise<MenuItem> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/food/items',
            query: {
                'generate_qr': generateQr,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Item Qr Code
     * Get QR code for specific food item
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getItemQrCodeApiV1FoodItemsItemIdQrGet({
        itemId,
    }: {
        itemId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/items/{item_id}/qr',
            path: {
                'item_id': itemId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Table Qr Code
     * Create QR code for table ordering
     *
     * - **Table identification**: Unique QR per table
     * - **Ordering interface**: Direct link to menu
     * - **Location tracking**: Track table location
     * @returns QRCodeResponse Successful Response
     * @throws ApiError
     */
    public static createTableQrCodeApiV1FoodTablesQrPost({
        requestBody,
    }: {
        requestBody: TableQRRequest,
    }): CancelablePromise<QRCodeResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/food/tables/qr',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Table Qr Codes
     * List all table QR codes for business
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listTableQrCodesApiV1FoodTablesBusinessIdQrCodesGet({
        businessId,
    }: {
        businessId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/tables/{business_id}/qr-codes',
            path: {
                'business_id': businessId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Qr Code With Image
     * Get QR code with regenerated image
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getQrCodeWithImageApiV1FoodQrQrIdGet({
        qrId,
    }: {
        qrId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/qr/{qr_id}',
            path: {
                'qr_id': qrId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Qr Code
     * Delete QR code
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteQrCodeApiV1FoodQrQrIdDelete({
        qrId,
    }: {
        qrId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/food/qr/{qr_id}',
            path: {
                'qr_id': qrId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Qr Codes
     * List QR codes for business with regenerated images
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listQrCodesApiV1FoodQrListBusinessIdGet({
        businessId,
        qrType,
        limit = 50,
        offset,
    }: {
        businessId: string,
        qrType?: (string | null),
        limit?: number,
        offset?: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/qr/list/{business_id}',
            path: {
                'business_id': businessId,
            },
            query: {
                'qr_type': qrType,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Regenerate Qr Code
     * Regenerate QR code with new data
     * @returns any Successful Response
     * @throws ApiError
     */
    public static regenerateQrCodeApiV1FoodQrQrIdRegeneratePut({
        qrId,
    }: {
        qrId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/food/qr/{qr_id}/regenerate',
            path: {
                'qr_id': qrId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Integrate With Pos
     * Integrate QR codes with POS system
     *
     * - **POS sync**: Sync QR codes with POS system
     * - **Menu sync**: Keep menu items in sync
     * - **Order tracking**: Track orders through QR codes
     * @returns any Successful Response
     * @throws ApiError
     */
    public static integrateWithPosApiV1FoodQrIntegratePosPost({
        businessId,
        posSystem,
        requestBody,
    }: {
        businessId: string,
        posSystem: string,
        requestBody: Record<string, any>,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/food/qr/integrate/pos',
            query: {
                'business_id': businessId,
                'pos_system': posSystem,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Export Qr Codes
     * Export QR codes for printing
     *
     * - **PDF format**: Ready-to-print QR codes
     * - **ZIP format**: Individual QR code images
     * - **CSV format**: QR code data for external systems
     * @returns any Successful Response
     * @throws ApiError
     */
    public static exportQrCodesApiV1FoodQrExportBusinessIdGet({
        businessId,
        format = 'pdf',
        qrType,
    }: {
        businessId: string,
        format?: string,
        qrType?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/qr/export/{business_id}',
            path: {
                'business_id': businessId,
            },
            query: {
                'format': format,
                'qr_type': qrType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
