/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BulkMenuItemUpdate } from '../models/BulkMenuItemUpdate';
import type { ItemModifier } from '../models/ItemModifier';
import type { ItemModifierCreate } from '../models/ItemModifierCreate';
import type { ItemModifierUpdate } from '../models/ItemModifierUpdate';
import type { MenuCategory } from '../models/MenuCategory';
import type { MenuCategoryCreate } from '../models/MenuCategoryCreate';
import type { MenuCategoryUpdate } from '../models/MenuCategoryUpdate';
import type { MenuImport } from '../models/MenuImport';
import type { MenuItem } from '../models/MenuItem';
import type { MenuItemCreate } from '../models/MenuItemCreate';
import type { MenuItemSearch } from '../models/MenuItemSearch';
import type { MenuItemUpdate } from '../models/MenuItemUpdate';
import type { MenuItemWithDetails } from '../models/MenuItemWithDetails';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MenuManagementService {
    /**
     * Create Menu Category
     * Create a new menu category
     *
     * - **Hierarchical support**: Can have parent categories
     * - **Display order**: Control category ordering
     * - **Icons**: Optional icon URLs for visual representation
     * @returns MenuCategory Successful Response
     * @throws ApiError
     */
    public static createMenuCategoryApiV1MenuCategoriesPost({
        requestBody,
    }: {
        requestBody: MenuCategoryCreate,
    }): CancelablePromise<MenuCategory> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/menu/categories',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Menu Categories
     * List all menu categories for a business
     *
     * - **Hierarchical**: Returns categories with parent-child relationships
     * - **Filtering**: Filter by parent or active status
     * @returns MenuCategory Successful Response
     * @throws ApiError
     */
    public static listMenuCategoriesApiV1MenuCategoriesGet({
        businessId,
        parentId,
        isActive,
    }: {
        /**
         * Business ID
         */
        businessId: string,
        /**
         * Filter by parent category
         */
        parentId?: (string | null),
        /**
         * Filter by active status
         */
        isActive?: (boolean | null),
    }): CancelablePromise<Array<MenuCategory>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/menu/categories',
            query: {
                'business_id': businessId,
                'parent_id': parentId,
                'is_active': isActive,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Menu Category
     * Get menu category by ID
     * @returns MenuCategory Successful Response
     * @throws ApiError
     */
    public static getMenuCategoryApiV1MenuCategoriesCategoryIdGet({
        categoryId,
    }: {
        categoryId: string,
    }): CancelablePromise<MenuCategory> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/menu/categories/{category_id}',
            path: {
                'category_id': categoryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Menu Category
     * Update menu category
     * @returns MenuCategory Successful Response
     * @throws ApiError
     */
    public static updateMenuCategoryApiV1MenuCategoriesCategoryIdPut({
        categoryId,
        requestBody,
    }: {
        categoryId: string,
        requestBody: MenuCategoryUpdate,
    }): CancelablePromise<MenuCategory> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/menu/categories/{category_id}',
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
     * Delete Menu Category
     * Delete menu category
     *
     * - **Cascade handling**: Items in category will have category_id set to NULL
     * - **Soft delete option**: Can be implemented for data retention
     * @returns void
     * @throws ApiError
     */
    public static deleteMenuCategoryApiV1MenuCategoriesCategoryIdDelete({
        categoryId,
    }: {
        categoryId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/menu/categories/{category_id}',
            path: {
                'category_id': categoryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Menu Item
     * Create a new menu item
     *
     * - **Full customization**: Price, cost, variants, modifiers
     * - **Availability**: Time-based and location-based availability
     * - **Rich metadata**: Images, allergens, nutrition info
     * @returns MenuItem Successful Response
     * @throws ApiError
     */
    public static createMenuItemApiV1MenuItemsPost({
        requestBody,
    }: {
        requestBody: MenuItemCreate,
    }): CancelablePromise<MenuItem> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/menu/items',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Menu Items
     * List menu items with filtering and pagination
     *
     * - **Search**: Full-text search on name and description
     * - **Filtering**: By category, availability, tags
     * - **Pagination**: Efficient for large menus
     * @returns MenuItem Successful Response
     * @throws ApiError
     */
    public static listMenuItemsApiV1MenuItemsGet({
        businessId,
        categoryId,
        isAvailable,
        search,
        limit = 50,
        offset,
    }: {
        /**
         * Business ID
         */
        businessId: string,
        /**
         * Filter by category
         */
        categoryId?: (string | null),
        /**
         * Filter by availability
         */
        isAvailable?: (boolean | null),
        /**
         * Search by name or description
         */
        search?: (string | null),
        limit?: number,
        offset?: number,
    }): CancelablePromise<Array<MenuItem>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/menu/items',
            query: {
                'business_id': businessId,
                'category_id': categoryId,
                'is_available': isAvailable,
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
     * Search Menu Items
     * Advanced menu item search
     *
     * - **Multi-criteria**: Search by multiple fields
     * - **Price range**: Filter by min/max price
     * - **Tags**: Filter by tags
     * @returns MenuItem Successful Response
     * @throws ApiError
     */
    public static searchMenuItemsApiV1MenuItemsSearchPost({
        requestBody,
    }: {
        requestBody: MenuItemSearch,
    }): CancelablePromise<Array<MenuItem>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/menu/items/search',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Menu Item
     * Get menu item with full details
     *
     * - **Complete data**: Includes category and modifier details
     * - **Profit margin**: Automatically calculated
     * @returns MenuItemWithDetails Successful Response
     * @throws ApiError
     */
    public static getMenuItemApiV1MenuItemsItemIdGet({
        itemId,
        includeModifiers = true,
    }: {
        itemId: string,
        includeModifiers?: boolean,
    }): CancelablePromise<MenuItemWithDetails> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/menu/items/{item_id}',
            path: {
                'item_id': itemId,
            },
            query: {
                'include_modifiers': includeModifiers,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Menu Item
     * Update menu item
     *
     * - **Partial updates**: Only update provided fields
     * - **Validation**: Price, cost, and inventory checks
     * @returns MenuItem Successful Response
     * @throws ApiError
     */
    public static updateMenuItemApiV1MenuItemsItemIdPut({
        itemId,
        requestBody,
    }: {
        itemId: string,
        requestBody: MenuItemUpdate,
    }): CancelablePromise<MenuItem> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/menu/items/{item_id}',
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
     * Delete Menu Item
     * Delete menu item
     *
     * - **Soft delete**: Set is_available to false (default)
     * - **Hard delete**: Permanently remove from database
     * @returns void
     * @throws ApiError
     */
    public static deleteMenuItemApiV1MenuItemsItemIdDelete({
        itemId,
        softDelete = true,
    }: {
        itemId: string,
        softDelete?: boolean,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/menu/items/{item_id}',
            path: {
                'item_id': itemId,
            },
            query: {
                'soft_delete': softDelete,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Bulk Update Menu Items
     * Bulk update multiple menu items
     *
     * - **Efficiency**: Update many items at once
     * - **Use cases**: Price changes, availability updates, category reassignment
     * @returns any Successful Response
     * @throws ApiError
     */
    public static bulkUpdateMenuItemsApiV1MenuItemsBulkUpdatePost({
        requestBody,
    }: {
        requestBody: BulkMenuItemUpdate,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/menu/items/bulk-update',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Duplicate Menu Item
     * Duplicate an existing menu item
     *
     * - **Quick creation**: Copy all properties
     * - **Customization**: Optionally provide new name
     * @returns MenuItem Successful Response
     * @throws ApiError
     */
    public static duplicateMenuItemApiV1MenuItemsItemIdDuplicatePost({
        itemId,
        newName,
    }: {
        itemId: string,
        newName?: (string | null),
    }): CancelablePromise<MenuItem> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/menu/items/{item_id}/duplicate',
            path: {
                'item_id': itemId,
            },
            query: {
                'new_name': newName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Item Modifier
     * Create item modifier (toppings, sizes, customizations)
     *
     * - **Types**: Single or multiple selection
     * - **Pricing**: Each option can have price adjustment
     * - **Validation**: Min/max selection rules
     * @returns ItemModifier Successful Response
     * @throws ApiError
     */
    public static createItemModifierApiV1MenuModifiersPost({
        requestBody,
    }: {
        requestBody: ItemModifierCreate,
    }): CancelablePromise<ItemModifier> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/menu/modifiers',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Item Modifiers
     * List all item modifiers for a business
     * @returns ItemModifier Successful Response
     * @throws ApiError
     */
    public static listItemModifiersApiV1MenuModifiersGet({
        businessId,
        modifierType,
    }: {
        /**
         * Business ID
         */
        businessId: string,
        /**
         * Filter by type
         */
        modifierType?: (string | null),
    }): CancelablePromise<Array<ItemModifier>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/menu/modifiers',
            query: {
                'business_id': businessId,
                'modifier_type': modifierType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Item Modifier
     * Get item modifier by ID
     * @returns ItemModifier Successful Response
     * @throws ApiError
     */
    public static getItemModifierApiV1MenuModifiersModifierIdGet({
        modifierId,
    }: {
        modifierId: string,
    }): CancelablePromise<ItemModifier> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/menu/modifiers/{modifier_id}',
            path: {
                'modifier_id': modifierId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Item Modifier
     * Update item modifier
     * @returns ItemModifier Successful Response
     * @throws ApiError
     */
    public static updateItemModifierApiV1MenuModifiersModifierIdPut({
        modifierId,
        requestBody,
    }: {
        modifierId: string,
        requestBody: ItemModifierUpdate,
    }): CancelablePromise<ItemModifier> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/menu/modifiers/{modifier_id}',
            path: {
                'modifier_id': modifierId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Item Modifier
     * Delete item modifier
     * @returns void
     * @throws ApiError
     */
    public static deleteItemModifierApiV1MenuModifiersModifierIdDelete({
        modifierId,
    }: {
        modifierId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/menu/modifiers/{modifier_id}',
            path: {
                'modifier_id': modifierId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Assign Modifier To Item
     * Assign modifier to menu item
     *
     * - **Flexible**: Same modifier can be used for multiple items
     * - **Ordering**: Control display order of modifiers
     * @returns any Successful Response
     * @throws ApiError
     */
    public static assignModifierToItemApiV1MenuItemsItemIdModifiersModifierIdPost({
        itemId,
        modifierId,
        displayOrder,
    }: {
        itemId: string,
        modifierId: string,
        displayOrder?: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/menu/items/{item_id}/modifiers/{modifier_id}',
            path: {
                'item_id': itemId,
                'modifier_id': modifierId,
            },
            query: {
                'display_order': displayOrder,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Remove Modifier From Item
     * Remove modifier from menu item
     * @returns void
     * @throws ApiError
     */
    public static removeModifierFromItemApiV1MenuItemsItemIdModifiersModifierIdDelete({
        itemId,
        modifierId,
    }: {
        itemId: string,
        modifierId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/menu/items/{item_id}/modifiers/{modifier_id}',
            path: {
                'item_id': itemId,
                'modifier_id': modifierId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Import Menu
     * Import menu from external sources
     *
     * - **Sources**: PDF, CSV, JSON, Toast, DoorDash
     * - **Auto-categorization**: AI-powered category creation
     * - **Conflict handling**: Overwrite or skip existing items
     * @returns any Successful Response
     * @throws ApiError
     */
    public static importMenuApiV1MenuImportPost({
        requestBody,
    }: {
        requestBody: MenuImport,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/menu/import',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Export Menu
     * Export menu in various formats
     *
     * - **Formats**: JSON, CSV, PDF
     * - **Filtering**: Include/exclude inactive items
     * - **Use cases**: Backup, integration, printing
     * @returns any Successful Response
     * @throws ApiError
     */
    public static exportMenuApiV1MenuExportBusinessIdGet({
        businessId,
        format = 'json',
        includeInactive = false,
    }: {
        businessId: string,
        format?: string,
        includeInactive?: boolean,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/menu/export/{business_id}',
            path: {
                'business_id': businessId,
            },
            query: {
                'format': format,
                'include_inactive': includeInactive,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Top Menu Items
     * Get top-performing menu items
     *
     * - **Metrics**: Sales volume, revenue, profit margin
     * - **Time periods**: 1 day, 7 days, 30 days, 90 days
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getTopMenuItemsApiV1MenuAnalyticsBusinessIdTopItemsGet({
        businessId,
        period = '7d',
        limit = 10,
    }: {
        businessId: string,
        period?: string,
        limit?: number,
    }): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/menu/analytics/{business_id}/top-items',
            path: {
                'business_id': businessId,
            },
            query: {
                'period': period,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Category Performance
     * Analyze category performance
     *
     * - **Metrics**: Sales by category, profit margins
     * - **Insights**: Best and worst performing categories
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getCategoryPerformanceApiV1MenuAnalyticsBusinessIdCategoryPerformanceGet({
        businessId,
        period = '7d',
    }: {
        businessId: string,
        period?: string,
    }): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/menu/analytics/{business_id}/category-performance',
            path: {
                'business_id': businessId,
            },
            query: {
                'period': period,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Analyze Profit Margins
     * Analyze profit margins across menu
     *
     * - **Overall margins**: Business-wide profit analysis
     * - **Item-level**: Identify high and low margin items
     * - **Recommendations**: Suggest pricing adjustments
     * @returns any Successful Response
     * @throws ApiError
     */
    public static analyzeProfitMarginsApiV1MenuAnalyticsBusinessIdProfitMarginsGet({
        businessId,
    }: {
        businessId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/menu/analytics/{business_id}/profit-margins',
            path: {
                'business_id': businessId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
