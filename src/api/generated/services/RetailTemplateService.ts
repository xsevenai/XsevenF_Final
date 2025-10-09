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
     * @param requestBody
     * @returns ProductResponse Successful Response
     * @throws ApiError
     */
    public static createProductApiV1RetailProductsPost(
        requestBody: ProductCreate,
    ): CancelablePromise<ProductResponse> {
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
     * @param businessId Business ID
     * @param category Filter by category
     * @param brand Filter by brand
     * @param isAvailable Filter by availability
     * @param lowStock Show only low stock items
     * @param search Search by name or SKU
     * @param limit
     * @param offset
     * @returns ProductResponse Successful Response
     * @throws ApiError
     */
    public static listProductsApiV1RetailProductsGet(
        businessId: string,
        category?: (string | null),
        brand?: (string | null),
        isAvailable?: (boolean | null),
        lowStock?: (boolean | null),
        search?: (string | null),
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<Array<ProductResponse>> {
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
     * @param productId
     * @returns ProductResponse Successful Response
     * @throws ApiError
     */
    public static getProductApiV1RetailProductsProductIdGet(
        productId: string,
    ): CancelablePromise<ProductResponse> {
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
     * @param productId
     * @param requestBody
     * @returns ProductResponse Successful Response
     * @throws ApiError
     */
    public static updateProductApiV1RetailProductsProductIdPut(
        productId: string,
        requestBody: ProductUpdate,
    ): CancelablePromise<ProductResponse> {
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
     * @param productId
     * @returns void
     * @throws ApiError
     */
    public static deleteProductApiV1RetailProductsProductIdDelete(
        productId: string,
    ): CancelablePromise<void> {
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
     * @param productId
     * @param adjustment Quantity to add (positive) or remove (negative)
     * @returns any Successful Response
     * @throws ApiError
     */
    public static adjustProductInventoryApiV1RetailProductsProductIdAdjustInventoryPost(
        productId: string,
        adjustment: number,
    ): CancelablePromise<any> {
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
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createProductCategoryApiV1RetailCategoriesPost(
        requestBody: Record<string, any>,
    ): CancelablePromise<Record<string, any>> {
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
     * @param businessId Business ID
     * @param parentId
     * @param isActive
     * @param limit
     * @param offset
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listProductCategoriesApiV1RetailCategoriesGet(
        businessId: string,
        parentId?: (string | null),
        isActive?: (boolean | null),
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<Array<any>> {
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
     * @param categoryId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getProductCategoryApiV1RetailCategoriesCategoryIdGet(
        categoryId: string,
    ): CancelablePromise<Record<string, any>> {
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
     * @param categoryId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateProductCategoryApiV1RetailCategoriesCategoryIdPut(
        categoryId: string,
        requestBody: Record<string, any>,
    ): CancelablePromise<Record<string, any>> {
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
     * @param categoryId
     * @returns void
     * @throws ApiError
     */
    public static deleteProductCategoryApiV1RetailCategoriesCategoryIdDelete(
        categoryId: string,
    ): CancelablePromise<void> {
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
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createSupplierApiV1RetailSuppliersPost(
        requestBody: Record<string, any>,
    ): CancelablePromise<Record<string, any>> {
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
     * @param businessId Business ID
     * @param isActive
     * @param limit
     * @param offset
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listSuppliersApiV1RetailSuppliersGet(
        businessId: string,
        isActive?: (boolean | null),
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<Array<any>> {
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
     * @param supplierId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getSupplierApiV1RetailSuppliersSupplierIdGet(
        supplierId: string,
    ): CancelablePromise<Record<string, any>> {
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
     * @param supplierId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateSupplierApiV1RetailSuppliersSupplierIdPut(
        supplierId: string,
        requestBody: Record<string, any>,
    ): CancelablePromise<Record<string, any>> {
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
     * @param supplierId
     * @returns void
     * @throws ApiError
     */
    public static deleteSupplierApiV1RetailSuppliersSupplierIdDelete(
        supplierId: string,
    ): CancelablePromise<void> {
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
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createPurchaseOrderApiV1RetailPurchaseOrdersPost(
        requestBody: Record<string, any>,
    ): CancelablePromise<Record<string, any>> {
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
     * @param businessId Business ID
     * @param supplierId
     * @param status
     * @param limit
     * @param offset
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listPurchaseOrdersApiV1RetailPurchaseOrdersGet(
        businessId: string,
        supplierId?: (string | null),
        status?: (string | null),
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<Array<any>> {
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
     * @param poId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getPurchaseOrderApiV1RetailPurchaseOrdersPoIdGet(
        poId: string,
    ): CancelablePromise<Record<string, any>> {
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
     * @param poId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updatePurchaseOrderApiV1RetailPurchaseOrdersPoIdPut(
        poId: string,
        requestBody: Record<string, any>,
    ): CancelablePromise<Record<string, any>> {
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
     * @param poId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static receivePurchaseOrderApiV1RetailPurchaseOrdersPoIdReceivePost(
        poId: string,
        requestBody: Record<string, any>,
    ): CancelablePromise<Record<string, any>> {
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
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createStockAlertApiV1RetailStockAlertsPost(
        requestBody: Record<string, any>,
    ): CancelablePromise<Record<string, any>> {
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
     * @param businessId Business ID
     * @param isActive
     * @param limit
     * @param offset
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listStockAlertsApiV1RetailStockAlertsGet(
        businessId: string,
        isActive?: (boolean | null),
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<Array<any>> {
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
     * @param businessId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getActiveStockAlertsApiV1RetailStockAlertsActiveGet(
        businessId: string,
    ): CancelablePromise<Array<any>> {
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
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createPromotionApiV1RetailPromotionsPost(
        requestBody: Record<string, any>,
    ): CancelablePromise<Record<string, any>> {
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
     * @param businessId Business ID
     * @param isActive
     * @param limit
     * @param offset
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listPromotionsApiV1RetailPromotionsGet(
        businessId: string,
        isActive?: (boolean | null),
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<Array<any>> {
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
     * @param businessId
     * @param startDate
     * @param endDate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getProductPerformanceApiV1RetailAnalyticsProductPerformanceGet(
        businessId: string,
        startDate?: (string | null),
        endDate?: (string | null),
    ): CancelablePromise<Record<string, any>> {
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
     * @param businessId
     * @param periodDays
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getInventoryTurnoverApiV1RetailAnalyticsInventoryTurnoverGet(
        businessId: string,
        periodDays: number = 30,
    ): CancelablePromise<Record<string, any>> {
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
     * @param businessId
     * @param startDate
     * @param endDate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getCategoryPerformanceApiV1RetailAnalyticsCategoryPerformanceGet(
        businessId: string,
        startDate?: (string | null),
        endDate?: (string | null),
    ): CancelablePromise<Record<string, any>> {
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
     * @param businessId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getProfitMarginsApiV1RetailAnalyticsProfitMarginsGet(
        businessId: string,
    ): CancelablePromise<Record<string, any>> {
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
     * @param customerId
     * @param points Points to add (positive) or remove (negative)
     * @returns any Successful Response
     * @throws ApiError
     */
    public static adjustLoyaltyPointsApiV1RetailLoyaltyPointsCustomerIdPost(
        customerId: string,
        points: number,
    ): CancelablePromise<any> {
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
