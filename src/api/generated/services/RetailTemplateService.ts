/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProductCreate } from '../models/ProductCreate';
import type { ProductResponse } from '../models/ProductResponse';
import type { ProductUpdate } from '../models/ProductUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RetailTemplateService {
    /**
     * Create Product
     * Create a new product
     * @returns ProductResponse Successful Response
     * @throws ApiError
     */
    public static createProductApiV1RetailProductsPost({
        requestBody,
    }: {
        requestBody: ProductCreate,
    }): CancelablePromise<ProductResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/retail/products',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Products
     * List all products for a business
     * @returns ProductResponse Successful Response
     * @throws ApiError
     */
    public static listProductsApiV1RetailProductsGet({
        businessId,
        category,
        brand,
        isAvailable,
        lowStock,
        search,
        limit = 100,
        offset,
    }: {
        /**
         * Business ID
         */
        businessId: string,
        /**
         * Filter by category
         */
        category?: (string | null),
        /**
         * Filter by brand
         */
        brand?: (string | null),
        /**
         * Filter by availability
         */
        isAvailable?: (boolean | null),
        /**
         * Show only low stock items
         */
        lowStock?: (boolean | null),
        /**
         * Search by name or SKU
         */
        search?: (string | null),
        limit?: number,
        offset?: number,
    }): CancelablePromise<Array<ProductResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/retail/products',
            query: {
                'business_id': businessId,
                'category': category,
                'brand': brand,
                'is_available': isAvailable,
                'low_stock': lowStock,
                'search': search,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Product
     * Get a specific product by ID
     * @returns ProductResponse Successful Response
     * @throws ApiError
     */
    public static getProductApiV1RetailProductsProductIdGet({
        productId,
    }: {
        productId: string,
    }): CancelablePromise<ProductResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/retail/products/{product_id}',
            path: {
                'product_id': productId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Product
     * Update a product
     * @returns ProductResponse Successful Response
     * @throws ApiError
     */
    public static updateProductApiV1RetailProductsProductIdPut({
        productId,
        requestBody,
    }: {
        productId: string,
        requestBody: ProductUpdate,
    }): CancelablePromise<ProductResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/retail/products/{product_id}',
            path: {
                'product_id': productId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Product
     * Delete a product
     * @returns void
     * @throws ApiError
     */
    public static deleteProductApiV1RetailProductsProductIdDelete({
        productId,
    }: {
        productId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/retail/products/{product_id}',
            path: {
                'product_id': productId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Adjust Product Inventory
     * Adjust product inventory quantity
     * @returns any Successful Response
     * @throws ApiError
     */
    public static adjustProductInventoryApiV1RetailProductsProductIdAdjustInventoryPost({
        productId,
        adjustment,
    }: {
        productId: string,
        /**
         * Quantity to add (positive) or remove (negative)
         */
        adjustment: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/retail/products/{product_id}/adjust-inventory',
            path: {
                'product_id': productId,
            },
            query: {
                'adjustment': adjustment,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Product Category
     * Create product category (like menu categories for food)
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createProductCategoryApiV1RetailCategoriesPost({
        requestBody,
    }: {
        requestBody: Record<string, any>,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/retail/categories',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Product Categories
     * List all product categories
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listProductCategoriesApiV1RetailCategoriesGet({
        businessId,
        parentId,
        isActive,
        limit = 100,
        offset,
    }: {
        /**
         * Business ID
         */
        businessId: string,
        parentId?: (string | null),
        isActive?: (boolean | null),
        limit?: number,
        offset?: number,
    }): CancelablePromise<Array<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/retail/categories',
            query: {
                'business_id': businessId,
                'parent_id': parentId,
                'is_active': isActive,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Product Category
     * Get product category by ID
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getProductCategoryApiV1RetailCategoriesCategoryIdGet({
        categoryId,
    }: {
        categoryId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/retail/categories/{category_id}',
            path: {
                'category_id': categoryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Product Category
     * Update product category
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateProductCategoryApiV1RetailCategoriesCategoryIdPut({
        categoryId,
        requestBody,
    }: {
        categoryId: string,
        requestBody: Record<string, any>,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/retail/categories/{category_id}',
            path: {
                'category_id': categoryId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Product Category
     * Delete product category
     * @returns void
     * @throws ApiError
     */
    public static deleteProductCategoryApiV1RetailCategoriesCategoryIdDelete({
        categoryId,
    }: {
        categoryId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/retail/categories/{category_id}',
            path: {
                'category_id': categoryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Supplier
     * Create supplier
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createSupplierApiV1RetailSuppliersPost({
        requestBody,
    }: {
        requestBody: Record<string, any>,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/retail/suppliers',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Suppliers
     * List all suppliers
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listSuppliersApiV1RetailSuppliersGet({
        businessId,
        isActive,
        limit = 100,
        offset,
    }: {
        /**
         * Business ID
         */
        businessId: string,
        isActive?: (boolean | null),
        limit?: number,
        offset?: number,
    }): CancelablePromise<Array<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/retail/suppliers',
            query: {
                'business_id': businessId,
                'is_active': isActive,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Supplier
     * Get supplier by ID
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getSupplierApiV1RetailSuppliersSupplierIdGet({
        supplierId,
    }: {
        supplierId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/retail/suppliers/{supplier_id}',
            path: {
                'supplier_id': supplierId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Supplier
     * Update supplier
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateSupplierApiV1RetailSuppliersSupplierIdPut({
        supplierId,
        requestBody,
    }: {
        supplierId: string,
        requestBody: Record<string, any>,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/retail/suppliers/{supplier_id}',
            path: {
                'supplier_id': supplierId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Supplier
     * Delete supplier
     * @returns void
     * @throws ApiError
     */
    public static deleteSupplierApiV1RetailSuppliersSupplierIdDelete({
        supplierId,
    }: {
        supplierId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/retail/suppliers/{supplier_id}',
            path: {
                'supplier_id': supplierId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Purchase Order
     * Create purchase order
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createPurchaseOrderApiV1RetailPurchaseOrdersPost({
        requestBody,
    }: {
        requestBody: Record<string, any>,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/retail/purchase-orders',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Purchase Orders
     * List all purchase orders
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listPurchaseOrdersApiV1RetailPurchaseOrdersGet({
        businessId,
        supplierId,
        status,
        limit = 100,
        offset,
    }: {
        /**
         * Business ID
         */
        businessId: string,
        supplierId?: (string | null),
        status?: (string | null),
        limit?: number,
        offset?: number,
    }): CancelablePromise<Array<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/retail/purchase-orders',
            query: {
                'business_id': businessId,
                'supplier_id': supplierId,
                'status': status,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Purchase Order
     * Get purchase order by ID
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getPurchaseOrderApiV1RetailPurchaseOrdersPoIdGet({
        poId,
    }: {
        poId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/retail/purchase-orders/{po_id}',
            path: {
                'po_id': poId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Purchase Order
     * Update purchase order
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updatePurchaseOrderApiV1RetailPurchaseOrdersPoIdPut({
        poId,
        requestBody,
    }: {
        poId: string,
        requestBody: Record<string, any>,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/retail/purchase-orders/{po_id}',
            path: {
                'po_id': poId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Receive Purchase Order
     * Receive purchase order and update inventory
     * @returns any Successful Response
     * @throws ApiError
     */
    public static receivePurchaseOrderApiV1RetailPurchaseOrdersPoIdReceivePost({
        poId,
        requestBody,
    }: {
        poId: string,
        requestBody: Record<string, any>,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/retail/purchase-orders/{po_id}/receive',
            path: {
                'po_id': poId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Stock Alert
     * Create stock alert for low inventory
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createStockAlertApiV1RetailStockAlertsPost({
        requestBody,
    }: {
        requestBody: Record<string, any>,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/retail/stock-alerts',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Stock Alerts
     * List all stock alerts
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listStockAlertsApiV1RetailStockAlertsGet({
        businessId,
        isActive,
        limit = 100,
        offset,
    }: {
        /**
         * Business ID
         */
        businessId: string,
        isActive?: (boolean | null),
        limit?: number,
        offset?: number,
    }): CancelablePromise<Array<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/retail/stock-alerts',
            query: {
                'business_id': businessId,
                'is_active': isActive,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Active Stock Alerts
     * Get currently triggered stock alerts
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getActiveStockAlertsApiV1RetailStockAlertsActiveGet({
        businessId,
    }: {
        businessId: string,
    }): CancelablePromise<Array<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/retail/stock-alerts/active',
            query: {
                'business_id': businessId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Promotion
     * Create promotion/discount
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createPromotionApiV1RetailPromotionsPost({
        requestBody,
    }: {
        requestBody: Record<string, any>,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/retail/promotions',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Promotions
     * List all promotions
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listPromotionsApiV1RetailPromotionsGet({
        businessId,
        isActive,
        limit = 100,
        offset,
    }: {
        /**
         * Business ID
         */
        businessId: string,
        isActive?: (boolean | null),
        limit?: number,
        offset?: number,
    }): CancelablePromise<Array<any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/retail/promotions',
            query: {
                'business_id': businessId,
                'is_active': isActive,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Product Performance
     * Analyze product sales performance
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getProductPerformanceApiV1RetailAnalyticsProductPerformanceGet({
        businessId,
        startDate,
        endDate,
    }: {
        businessId: string,
        startDate?: (string | null),
        endDate?: (string | null),
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/retail/analytics/product-performance',
            query: {
                'business_id': businessId,
                'start_date': startDate,
                'end_date': endDate,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Inventory Turnover
     * Calculate inventory turnover rate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getInventoryTurnoverApiV1RetailAnalyticsInventoryTurnoverGet({
        businessId,
        periodDays = 30,
    }: {
        businessId: string,
        periodDays?: number,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/retail/analytics/inventory-turnover',
            query: {
                'business_id': businessId,
                'period_days': periodDays,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Category Performance
     * Analyze sales by product category
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getCategoryPerformanceApiV1RetailAnalyticsCategoryPerformanceGet({
        businessId,
        startDate,
        endDate,
    }: {
        businessId: string,
        startDate?: (string | null),
        endDate?: (string | null),
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/retail/analytics/category-performance',
            query: {
                'business_id': businessId,
                'start_date': startDate,
                'end_date': endDate,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Profit Margins
     * Analyze profit margins across products
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getProfitMarginsApiV1RetailAnalyticsProfitMarginsGet({
        businessId,
    }: {
        businessId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/retail/analytics/profit-margins',
            query: {
                'business_id': businessId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Adjust Loyalty Points
     * Adjust customer loyalty points (Retail-specific feature)
     * @returns any Successful Response
     * @throws ApiError
     */
    public static adjustLoyaltyPointsApiV1RetailLoyaltyPointsCustomerIdPost({
        customerId,
        points,
    }: {
        customerId: string,
        /**
         * Points to add (positive) or remove (negative)
         */
        points: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/retail/loyalty-points/{customer_id}',
            path: {
                'customer_id': customerId,
            },
            query: {
                'points': points,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
