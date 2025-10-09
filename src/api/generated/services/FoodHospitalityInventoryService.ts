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
     * @param requestBody
     * @returns InventoryItem Successful Response
     * @throws ApiError
     */
    public static createInventoryItemApiV1FoodInventoryItemsPost(
        requestBody: InventoryItemCreate,
    ): CancelablePromise<InventoryItem> {
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
     * @param businessId Business ID
     * @param locationId
     * @param category
     * @param lowStockOnly
     * @param limit
     * @param offset
     * @returns InventoryItemWithMetrics Successful Response
     * @throws ApiError
     */
    public static listInventoryItemsApiV1FoodInventoryItemsGet(
        businessId: string,
        locationId?: (string | null),
        category?: (string | null),
        lowStockOnly: boolean = false,
        limit: number = 50,
        offset?: number,
    ): CancelablePromise<Array<InventoryItemWithMetrics>> {
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
     * @param requestBody
     * @returns InventoryItemWithMetrics Successful Response
     * @throws ApiError
     */
    public static searchInventoryItemsApiV1FoodInventoryItemsSearchPost(
        requestBody: InventorySearch,
    ): CancelablePromise<Array<InventoryItemWithMetrics>> {
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
     * @param itemId
     * @returns InventoryItemWithMetrics Successful Response
     * @throws ApiError
     */
    public static getInventoryItemApiV1FoodInventoryItemsItemIdGet(
        itemId: string,
    ): CancelablePromise<InventoryItemWithMetrics> {
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
     * @param itemId
     * @param requestBody
     * @returns InventoryItem Successful Response
     * @throws ApiError
     */
    public static updateInventoryItemApiV1FoodInventoryItemsItemIdPut(
        itemId: string,
        requestBody: InventoryItemUpdate,
    ): CancelablePromise<InventoryItem> {
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
     * @param itemId
     * @returns void
     * @throws ApiError
     */
    public static deleteInventoryItemApiV1FoodInventoryItemsItemIdDelete(
        itemId: string,
    ): CancelablePromise<void> {
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
     * @param requestBody
     * @param performedBy
     * @returns InventoryTransaction Successful Response
     * @throws ApiError
     */
    public static adjustStockApiV1FoodInventoryAdjustmentsPost(
        requestBody: StockAdjustment,
        performedBy?: (string | null),
    ): CancelablePromise<InventoryTransaction> {
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
     * @param businessId
     * @param inventoryItemId
     * @param transactionType
     * @param startDate
     * @param endDate
     * @param limit
     * @param offset
     * @returns InventoryTransaction Successful Response
     * @throws ApiError
     */
    public static listInventoryTransactionsApiV1FoodInventoryTransactionsGet(
        businessId: string,
        inventoryItemId?: (string | null),
        transactionType?: (string | null),
        startDate?: (string | null),
        endDate?: (string | null),
        limit: number = 50,
        offset?: number,
    ): CancelablePromise<Array<InventoryTransaction>> {
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
     * @param businessId
     * @param locationId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static performStockCountApiV1FoodInventoryCountPost(
        businessId: string,
        locationId?: (string | null),
        requestBody?: Array<Record<string, any>>,
    ): CancelablePromise<Record<string, any>> {
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
     * @param requestBody
     * @returns StockAlert Successful Response
     * @throws ApiError
     */
    public static createStockAlertApiV1FoodInventoryAlertsPost(
        requestBody: StockAlertCreate,
    ): CancelablePromise<StockAlert> {
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
     * @param businessId
     * @param isActive
     * @param alertType
     * @returns StockAlert Successful Response
     * @throws ApiError
     */
    public static listStockAlertsApiV1FoodInventoryAlertsGet(
        businessId: string,
        isActive?: (boolean | null),
        alertType?: (string | null),
    ): CancelablePromise<Array<StockAlert>> {
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
     * @param businessId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getActiveAlertsApiV1FoodInventoryAlertsActiveGet(
        businessId: string,
    ): CancelablePromise<Array<Record<string, any>>> {
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
     * @param alertId
     * @param isActive
     * @returns StockAlert Successful Response
     * @throws ApiError
     */
    public static updateStockAlertApiV1FoodInventoryAlertsAlertIdPut(
        alertId: string,
        isActive: boolean,
    ): CancelablePromise<StockAlert> {
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
     * @param alertId
     * @returns void
     * @throws ApiError
     */
    public static deleteStockAlertApiV1FoodInventoryAlertsAlertIdDelete(
        alertId: string,
    ): CancelablePromise<void> {
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
     * @param requestBody
     * @returns Supplier Successful Response
     * @throws ApiError
     */
    public static createSupplierApiV1FoodInventorySuppliersPost(
        requestBody: SupplierCreate,
    ): CancelablePromise<Supplier> {
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
     * @param businessId
     * @param isActive
     * @returns Supplier Successful Response
     * @throws ApiError
     */
    public static listSuppliersApiV1FoodInventorySuppliersGet(
        businessId: string,
        isActive?: (boolean | null),
    ): CancelablePromise<Array<Supplier>> {
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
     * @param supplierId
     * @returns Supplier Successful Response
     * @throws ApiError
     */
    public static getSupplierApiV1FoodInventorySuppliersSupplierIdGet(
        supplierId: string,
    ): CancelablePromise<Supplier> {
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
     * @param supplierId
     * @param requestBody
     * @returns Supplier Successful Response
     * @throws ApiError
     */
    public static updateSupplierApiV1FoodInventorySuppliersSupplierIdPut(
        supplierId: string,
        requestBody: SupplierUpdate,
    ): CancelablePromise<Supplier> {
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
     * @param supplierId
     * @returns void
     * @throws ApiError
     */
    public static deleteSupplierApiV1FoodInventorySuppliersSupplierIdDelete(
        supplierId: string,
    ): CancelablePromise<void> {
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
     * @param requestBody
     * @param createdBy
     * @returns PurchaseOrder Successful Response
     * @throws ApiError
     */
    public static createPurchaseOrderApiV1FoodInventoryPurchaseOrdersPost(
        requestBody: PurchaseOrderCreate,
        createdBy?: (string | null),
    ): CancelablePromise<PurchaseOrder> {
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
     * @param businessId
     * @param supplierId
     * @param status
     * @param startDate
     * @param endDate
     * @returns PurchaseOrder Successful Response
     * @throws ApiError
     */
    public static listPurchaseOrdersApiV1FoodInventoryPurchaseOrdersGet(
        businessId: string,
        supplierId?: (string | null),
        status?: (string | null),
        startDate?: (string | null),
        endDate?: (string | null),
    ): CancelablePromise<Array<PurchaseOrder>> {
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
     * @param poId
     * @returns PurchaseOrder Successful Response
     * @throws ApiError
     */
    public static getPurchaseOrderApiV1FoodInventoryPurchaseOrdersPoIdGet(
        poId: string,
    ): CancelablePromise<PurchaseOrder> {
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
     * @param poId
     * @param requestBody
     * @returns PurchaseOrder Successful Response
     * @throws ApiError
     */
    public static updatePurchaseOrderApiV1FoodInventoryPurchaseOrdersPoIdPut(
        poId: string,
        requestBody: PurchaseOrderUpdate,
    ): CancelablePromise<PurchaseOrder> {
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
     * @param poId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static receivePurchaseOrderApiV1FoodInventoryPurchaseOrdersPoIdReceivePost(
        poId: string,
        requestBody: Array<Record<string, any>>,
    ): CancelablePromise<Record<string, any>> {
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
     * @param businessId
     * @param locationId
     * @returns InventoryReport Successful Response
     * @throws ApiError
     */
    public static getInventorySummaryApiV1FoodInventoryReportsSummaryGet(
        businessId: string,
        locationId?: (string | null),
    ): CancelablePromise<InventoryReport> {
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
     * @param businessId
     * @param locationId
     * @param asOfDate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getInventoryValuationApiV1FoodInventoryReportsValuationGet(
        businessId: string,
        locationId?: (string | null),
        asOfDate?: (string | null),
    ): CancelablePromise<Record<string, any>> {
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
     * @param businessId
     * @param periodDays
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getInventoryTurnoverApiV1FoodInventoryReportsTurnoverGet(
        businessId: string,
        periodDays: number = 30,
    ): CancelablePromise<Record<string, any>> {
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
     * @param businessId
     * @param startDate
     * @param endDate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getWasteReportApiV1FoodInventoryReportsWasteGet(
        businessId: string,
        startDate: string,
        endDate: string,
    ): CancelablePromise<Record<string, any>> {
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
     * @param businessId
     * @param dryRun
     * @returns any Successful Response
     * @throws ApiError
     */
    public static triggerAutoReorderApiV1FoodInventoryAutoReorderPost(
        businessId: string,
        dryRun: boolean = false,
    ): CancelablePromise<Record<string, any>> {
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
     * @param businessId
     * @param posSystem
     * @returns any Successful Response
     * @throws ApiError
     */
    public static syncFromPosApiV1FoodInventorySyncFromPosPost(
        businessId: string,
        posSystem: string,
    ): CancelablePromise<Record<string, any>> {
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
