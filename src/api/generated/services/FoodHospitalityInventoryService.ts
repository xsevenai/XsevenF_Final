/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InventoryItem } from '../models/InventoryItem';
import type { InventoryItemCreate } from '../models/InventoryItemCreate';
import type { InventoryItemUpdate } from '../models/InventoryItemUpdate';
import type { InventoryItemWithMetrics } from '../models/InventoryItemWithMetrics';
import type { InventoryReport } from '../models/InventoryReport';
import type { InventorySearch } from '../models/InventorySearch';
import type { InventoryTransaction } from '../models/InventoryTransaction';
import type { PurchaseOrder } from '../models/PurchaseOrder';
import type { PurchaseOrderCreate } from '../models/PurchaseOrderCreate';
import type { PurchaseOrderUpdate } from '../models/PurchaseOrderUpdate';
import type { StockAdjustment } from '../models/StockAdjustment';
import type { StockAlert } from '../models/StockAlert';
import type { StockAlertCreate } from '../models/StockAlertCreate';
import type { Supplier } from '../models/Supplier';
import type { SupplierCreate } from '../models/SupplierCreate';
import type { SupplierUpdate } from '../models/SupplierUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FoodHospitalityInventoryService {
    /**
     * Create Inventory Item
     * Create new inventory item
     *
     * - **Stock tracking**: Real-time stock levels
     * - **Reorder points**: Automatic low-stock alerts
     * - **Multi-location**: Track inventory per location
     * @returns InventoryItem Successful Response
     * @throws ApiError
     */
    public static createInventoryItemApiV1FoodInventoryItemsPost({
        requestBody,
    }: {
        requestBody: InventoryItemCreate,
    }): CancelablePromise<InventoryItem> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/food/inventory/items',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Inventory Items
     * List inventory items with metrics
     *
     * - **Metrics**: Stock percentage, value, reorder status
     * - **Filtering**: By location, category, stock level
     * @returns InventoryItemWithMetrics Successful Response
     * @throws ApiError
     */
    public static listInventoryItemsApiV1FoodInventoryItemsGet({
        businessId,
        locationId,
        category,
        lowStockOnly = false,
        limit = 50,
        offset,
    }: {
        /**
         * Business ID
         */
        businessId: string,
        locationId?: (string | null),
        category?: (string | null),
        lowStockOnly?: boolean,
        limit?: number,
        offset?: number,
    }): CancelablePromise<Array<InventoryItemWithMetrics>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/inventory/items',
            query: {
                'business_id': businessId,
                'location_id': locationId,
                'category': category,
                'low_stock_only': lowStockOnly,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Search Inventory Items
     * Advanced inventory search with multiple filters
     * @returns InventoryItemWithMetrics Successful Response
     * @throws ApiError
     */
    public static searchInventoryItemsApiV1FoodInventoryItemsSearchPost({
        requestBody,
    }: {
        requestBody: InventorySearch,
    }): CancelablePromise<Array<InventoryItemWithMetrics>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/food/inventory/items/search',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Inventory Item
     * Get inventory item with full metrics
     * @returns InventoryItemWithMetrics Successful Response
     * @throws ApiError
     */
    public static getInventoryItemApiV1FoodInventoryItemsItemIdGet({
        itemId,
    }: {
        itemId: string,
    }): CancelablePromise<InventoryItemWithMetrics> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/inventory/items/{item_id}',
            path: {
                'item_id': itemId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Inventory Item
     * Update inventory item
     * @returns InventoryItem Successful Response
     * @throws ApiError
     */
    public static updateInventoryItemApiV1FoodInventoryItemsItemIdPut({
        itemId,
        requestBody,
    }: {
        itemId: string,
        requestBody: InventoryItemUpdate,
    }): CancelablePromise<InventoryItem> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/food/inventory/items/{item_id}',
            path: {
                'item_id': itemId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Inventory Item
     * Delete inventory item
     * @returns void
     * @throws ApiError
     */
    public static deleteInventoryItemApiV1FoodInventoryItemsItemIdDelete({
        itemId,
    }: {
        itemId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/food/inventory/items/{item_id}',
            path: {
                'item_id': itemId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Adjust Stock
     * Manually adjust stock levels
     *
     * - **Audit trail**: All adjustments logged
     * - **Reasons**: Track why stock was adjusted
     * - **Real-time**: Immediate stock level update
     * @returns InventoryTransaction Successful Response
     * @throws ApiError
     */
    public static adjustStockApiV1FoodInventoryAdjustmentsPost({
        requestBody,
        performedBy,
    }: {
        requestBody: StockAdjustment,
        performedBy?: (string | null),
    }): CancelablePromise<InventoryTransaction> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/food/inventory/adjustments',
            query: {
                'performed_by': performedBy,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Inventory Transactions
     * List inventory transactions (audit trail)
     *
     * - **Complete history**: All stock movements
     * - **Filtering**: By item, type, date range
     * - **Compliance**: Full audit trail for accounting
     * @returns InventoryTransaction Successful Response
     * @throws ApiError
     */
    public static listInventoryTransactionsApiV1FoodInventoryTransactionsGet({
        businessId,
        inventoryItemId,
        transactionType,
        startDate,
        endDate,
        limit = 50,
        offset,
    }: {
        businessId: string,
        inventoryItemId?: (string | null),
        transactionType?: (string | null),
        startDate?: (string | null),
        endDate?: (string | null),
        limit?: number,
        offset?: number,
    }): CancelablePromise<Array<InventoryTransaction>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/inventory/transactions',
            query: {
                'business_id': businessId,
                'inventory_item_id': inventoryItemId,
                'transaction_type': transactionType,
                'start_date': startDate,
                'end_date': endDate,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Perform Stock Count
     * Perform physical stock count
     *
     * - **Reconciliation**: Compare counted vs. system stock
     * - **Discrepancies**: Identify and log differences
     * - **Adjustments**: Auto-create adjustment transactions
     * @returns any Successful Response
     * @throws ApiError
     */
    public static performStockCountApiV1FoodInventoryCountPost({
        businessId,
        locationId,
        requestBody,
    }: {
        businessId: string,
        locationId?: (string | null),
        requestBody?: Array<Record<string, any>>,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/food/inventory/count',
            query: {
                'business_id': businessId,
                'location_id': locationId,
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
     * Create stock alert rule
     *
     * - **Alert types**: Low stock, out of stock, expiring
     * - **Thresholds**: Customizable per item
     * - **Notifications**: Email/SMS when triggered
     * @returns StockAlert Successful Response
     * @throws ApiError
     */
    public static createStockAlertApiV1FoodInventoryAlertsPost({
        requestBody,
    }: {
        requestBody: StockAlertCreate,
    }): CancelablePromise<StockAlert> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/food/inventory/alerts',
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
     * @returns StockAlert Successful Response
     * @throws ApiError
     */
    public static listStockAlertsApiV1FoodInventoryAlertsGet({
        businessId,
        isActive,
        alertType,
    }: {
        businessId: string,
        isActive?: (boolean | null),
        alertType?: (string | null),
    }): CancelablePromise<Array<StockAlert>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/inventory/alerts',
            query: {
                'business_id': businessId,
                'is_active': isActive,
                'alert_type': alertType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Active Alerts
     * Get currently triggered alerts
     *
     * - **Real-time**: Items currently below threshold
     * - **Priority**: Sorted by severity
     * - **Actionable**: Direct links to reorder
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getActiveAlertsApiV1FoodInventoryAlertsActiveGet({
        businessId,
    }: {
        businessId: string,
    }): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/inventory/alerts/active',
            query: {
                'business_id': businessId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Stock Alert
     * Enable/disable stock alert
     * @returns StockAlert Successful Response
     * @throws ApiError
     */
    public static updateStockAlertApiV1FoodInventoryAlertsAlertIdPut({
        alertId,
        isActive,
    }: {
        alertId: string,
        isActive: boolean,
    }): CancelablePromise<StockAlert> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/food/inventory/alerts/{alert_id}',
            path: {
                'alert_id': alertId,
            },
            query: {
                'is_active': isActive,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Stock Alert
     * Delete stock alert
     * @returns void
     * @throws ApiError
     */
    public static deleteStockAlertApiV1FoodInventoryAlertsAlertIdDelete({
        alertId,
    }: {
        alertId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/food/inventory/alerts/{alert_id}',
            path: {
                'alert_id': alertId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Supplier
     * Create new supplier
     * @returns Supplier Successful Response
     * @throws ApiError
     */
    public static createSupplierApiV1FoodInventorySuppliersPost({
        requestBody,
    }: {
        requestBody: SupplierCreate,
    }): CancelablePromise<Supplier> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/food/inventory/suppliers',
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
     * @returns Supplier Successful Response
     * @throws ApiError
     */
    public static listSuppliersApiV1FoodInventorySuppliersGet({
        businessId,
        isActive,
    }: {
        businessId: string,
        isActive?: (boolean | null),
    }): CancelablePromise<Array<Supplier>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/inventory/suppliers',
            query: {
                'business_id': businessId,
                'is_active': isActive,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Supplier
     * Get supplier details
     * @returns Supplier Successful Response
     * @throws ApiError
     */
    public static getSupplierApiV1FoodInventorySuppliersSupplierIdGet({
        supplierId,
    }: {
        supplierId: string,
    }): CancelablePromise<Supplier> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/inventory/suppliers/{supplier_id}',
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
     * @returns Supplier Successful Response
     * @throws ApiError
     */
    public static updateSupplierApiV1FoodInventorySuppliersSupplierIdPut({
        supplierId,
        requestBody,
    }: {
        supplierId: string,
        requestBody: SupplierUpdate,
    }): CancelablePromise<Supplier> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/food/inventory/suppliers/{supplier_id}',
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
    public static deleteSupplierApiV1FoodInventorySuppliersSupplierIdDelete({
        supplierId,
    }: {
        supplierId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/food/inventory/suppliers/{supplier_id}',
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
     *
     * - **Supplier integration**: Send to supplier via email/API
     * - **Tracking**: Monitor delivery status
     * - **Auto-receive**: Update inventory on delivery
     * @returns PurchaseOrder Successful Response
     * @throws ApiError
     */
    public static createPurchaseOrderApiV1FoodInventoryPurchaseOrdersPost({
        requestBody,
        createdBy = '',
    }: {
        requestBody: PurchaseOrderCreate,
        createdBy?: string,
    }): CancelablePromise<PurchaseOrder> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/food/inventory/purchase-orders',
            query: {
                'created_by': createdBy,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Purchase Orders
     * List purchase orders with filtering
     * @returns PurchaseOrder Successful Response
     * @throws ApiError
     */
    public static listPurchaseOrdersApiV1FoodInventoryPurchaseOrdersGet({
        businessId,
        supplierId,
        status,
        startDate,
        endDate,
    }: {
        businessId: string,
        supplierId?: (string | null),
        status?: (string | null),
        startDate?: (string | null),
        endDate?: (string | null),
    }): CancelablePromise<Array<PurchaseOrder>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/inventory/purchase-orders',
            query: {
                'business_id': businessId,
                'supplier_id': supplierId,
                'status': status,
                'start_date': startDate,
                'end_date': endDate,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Purchase Order
     * Get purchase order details
     * @returns PurchaseOrder Successful Response
     * @throws ApiError
     */
    public static getPurchaseOrderApiV1FoodInventoryPurchaseOrdersPoIdGet({
        poId,
    }: {
        poId: string,
    }): CancelablePromise<PurchaseOrder> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/inventory/purchase-orders/{po_id}',
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
     * Update purchase order status
     * @returns PurchaseOrder Successful Response
     * @throws ApiError
     */
    public static updatePurchaseOrderApiV1FoodInventoryPurchaseOrdersPoIdPut({
        poId,
        requestBody,
    }: {
        poId: string,
        requestBody: PurchaseOrderUpdate,
    }): CancelablePromise<PurchaseOrder> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/food/inventory/purchase-orders/{po_id}',
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
     * Receive purchase order
     *
     * - **Auto-update**: Increase inventory levels
     * - **Partial receives**: Support partial deliveries
     * - **Cost tracking**: Update unit costs
     * @returns any Successful Response
     * @throws ApiError
     */
    public static receivePurchaseOrderApiV1FoodInventoryPurchaseOrdersPoIdReceivePost({
        poId,
        requestBody,
    }: {
        poId: string,
        requestBody: Array<Record<string, any>>,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/food/inventory/purchase-orders/{po_id}/receive',
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
     * Get Inventory Summary
     * Get inventory summary report
     *
     * - **Overview**: Total items, value, alerts
     * - **Categories**: Breakdown by category
     * - **Top items**: Highest value items
     * @returns InventoryReport Successful Response
     * @throws ApiError
     */
    public static getInventorySummaryApiV1FoodInventoryReportsSummaryGet({
        businessId,
        locationId,
    }: {
        businessId: string,
        locationId?: (string | null),
    }): CancelablePromise<InventoryReport> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/inventory/reports/summary',
            query: {
                'business_id': businessId,
                'location_id': locationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Inventory Valuation
     * Get inventory valuation report
     *
     * - **Total value**: Current inventory worth
     * - **By category**: Value breakdown
     * - **Historical**: Point-in-time valuation
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getInventoryValuationApiV1FoodInventoryReportsValuationGet({
        businessId,
        locationId,
        asOfDate,
    }: {
        businessId: string,
        locationId?: (string | null),
        asOfDate?: (string | null),
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/inventory/reports/valuation',
            query: {
                'business_id': businessId,
                'location_id': locationId,
                'as_of_date': asOfDate,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Inventory Turnover
     * Analyze inventory turnover
     *
     * - **Turnover rate**: How quickly inventory moves
     * - **Slow movers**: Items with low turnover
     * - **Fast movers**: High turnover items
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getInventoryTurnoverApiV1FoodInventoryReportsTurnoverGet({
        businessId,
        periodDays = 30,
    }: {
        businessId: string,
        periodDays?: number,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/inventory/reports/turnover',
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
     * Get Waste Report
     * Analyze inventory waste
     *
     * - **Waste tracking**: Items marked as waste
     * - **Cost impact**: Total waste cost
     * - **Trends**: Waste patterns over time
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getWasteReportApiV1FoodInventoryReportsWasteGet({
        businessId,
        startDate,
        endDate,
    }: {
        businessId: string,
        startDate: string,
        endDate: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/food/inventory/reports/waste',
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
     * Trigger Auto Reorder
     * Trigger automatic reordering
     *
     * - **Smart reordering**: Based on usage patterns
     * - **Supplier selection**: Choose best supplier
     * - **PO generation**: Auto-create purchase orders
     * @returns any Successful Response
     * @throws ApiError
     */
    public static triggerAutoReorderApiV1FoodInventoryAutoReorderPost({
        businessId,
        dryRun = false,
    }: {
        businessId: string,
        dryRun?: boolean,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/food/inventory/auto-reorder',
            query: {
                'business_id': businessId,
                'dry_run': dryRun,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Sync From Pos
     * Sync inventory from POS system
     *
     * - **Integrations**: Square, Toast, Clover
     * - **Real-time**: Keep inventory in sync
     * - **Reconciliation**: Handle discrepancies
     * @returns any Successful Response
     * @throws ApiError
     */
    public static syncFromPosApiV1FoodInventorySyncFromPosPost({
        businessId,
        posSystem,
    }: {
        businessId: string,
        posSystem: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/food/inventory/sync-from-pos',
            query: {
                'business_id': businessId,
                'pos_system': posSystem,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
