/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AnalyticsService {
    /**
     * Get Realtime Analytics
     * Real-time business analytics dashboard
     *
     * - **Live metrics**: Current orders, revenue, customers
     * - **Staff status**: Who's working, breaks, overtime
     * - **Table status**: Available, occupied, reserved
     * - **Kitchen status**: Active orders, prep times
     * - **Inventory alerts**: Low stock items
     * @param businessId
     * @param locationId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getRealtimeAnalyticsApiV1AnalyticsRealtimeBusinessIdGet(
        businessId: string,
        locationId?: (string | null),
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/realtime/{business_id}',
            path: {
                'business_id': businessId,
            },
            query: {
                'location_id': locationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Sales Summary
     * Sales summary with time-series data
     *
     * - **Grouping**: By hour, day, week, or month
     * - **Metrics**: Revenue, orders, customers, AOV
     * - **Trends**: Growth rates and patterns
     * @param businessId
     * @param startDate
     * @param endDate
     * @param locationId
     * @param groupBy
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getSalesSummaryApiV1AnalyticsSalesSummaryGet(
        businessId: string,
        startDate: string,
        endDate: string,
        locationId?: (string | null),
        groupBy: string = 'day',
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/sales/summary',
            query: {
                'business_id': businessId,
                'start_date': startDate,
                'end_date': endDate,
                'location_id': locationId,
                'group_by': groupBy,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Sales By Category
     * Sales breakdown by menu category
     *
     * - **Revenue**: Total revenue per category
     * - **Orders**: Number of orders per category
     * - **Percentage**: Category contribution to total
     * @param businessId
     * @param startDate
     * @param endDate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getSalesByCategoryApiV1AnalyticsSalesByCategoryGet(
        businessId: string,
        startDate: string,
        endDate: string,
    ): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/sales/by-category',
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
     * Get Sales By Payment Method
     * Sales breakdown by payment method
     *
     * - **Methods**: Card, cash, digital wallet
     * - **Amounts**: Total per method
     * - **Trends**: Payment method preferences
     * @param businessId
     * @param startDate
     * @param endDate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getSalesByPaymentMethodApiV1AnalyticsSalesByPaymentMethodGet(
        businessId: string,
        startDate: string,
        endDate: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/sales/by-payment-method',
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
     * Get Top Menu Items
     * Top-performing menu items
     *
     * - **Metrics**: Revenue, quantity sold, profit
     * - **Rankings**: Best sellers identification
     * - **Insights**: Performance trends
     * @param businessId
     * @param startDate
     * @param endDate
     * @param metric
     * @param limit
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getTopMenuItemsApiV1AnalyticsMenuTopItemsGet(
        businessId: string,
        startDate: string,
        endDate: string,
        metric: string = 'revenue',
        limit: number = 10,
    ): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/menu/top-items',
            query: {
                'business_id': businessId,
                'start_date': startDate,
                'end_date': endDate,
                'metric': metric,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Item Performance
     * Individual item performance analysis
     *
     * - **Sales trend**: Daily/weekly performance
     * - **Profit margin**: Cost vs. revenue
     * - **Popularity**: Order frequency
     * @param itemId
     * @param startDate
     * @param endDate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getItemPerformanceApiV1AnalyticsMenuItemPerformanceItemIdGet(
        itemId: string,
        startDate: string,
        endDate: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/menu/item-performance/{item_id}',
            path: {
                'item_id': itemId,
            },
            query: {
                'start_date': startDate,
                'end_date': endDate,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Analyze Menu Profitability
     * Menu profitability analysis
     *
     * - **Overall margin**: Business-wide profit margin
     * - **By item**: Profit margin per item
     * - **By category**: Category profitability
     * - **Recommendations**: Pricing optimization suggestions
     * @param businessId
     * @param startDate
     * @param endDate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static analyzeMenuProfitabilityApiV1AnalyticsMenuProfitAnalysisGet(
        businessId: string,
        startDate: string,
        endDate: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/menu/profit-analysis',
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
     * Get Cohort Analysis
     * Customer cohort analysis
     *
     * - **Retention**: Cohort retention rates
     * - **Revenue**: Revenue per cohort
     * - **Behavior**: Cohort ordering patterns
     * @param businessId
     * @param cohortType
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getCohortAnalysisApiV1AnalyticsCustomersCohortAnalysisGet(
        businessId: string,
        cohortType: string = 'monthly',
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/customers/cohort-analysis',
            query: {
                'business_id': businessId,
                'cohort_type': cohortType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Analyze Table Turnover
     * Table turnover analysis
     *
     * - **Average turnover**: Time per table
     * - **By time of day**: Peak vs. off-peak
     * - **By table**: Individual table performance
     * - **Optimization**: Turnover improvement suggestions
     * @param businessId
     * @param startDate
     * @param endDate
     * @param locationId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static analyzeTableTurnoverApiV1AnalyticsOperationsTableTurnoverGet(
        businessId: string,
        startDate: string,
        endDate: string,
        locationId?: (string | null),
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/operations/table-turnover',
            query: {
                'business_id': businessId,
                'start_date': startDate,
                'end_date': endDate,
                'location_id': locationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Analyze Kitchen Performance
     * Kitchen performance analysis
     *
     * - **Prep times**: Average and by item
     * - **Efficiency**: Orders per hour
     * - **Delays**: Late order analysis
     * - **Bottlenecks**: Station performance
     * @param businessId
     * @param startDate
     * @param endDate
     * @param station
     * @returns any Successful Response
     * @throws ApiError
     */
    public static analyzeKitchenPerformanceApiV1AnalyticsOperationsKitchenPerformanceGet(
        businessId: string,
        startDate: string,
        endDate: string,
        station?: (string | null),
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/operations/kitchen-performance',
            query: {
                'business_id': businessId,
                'start_date': startDate,
                'end_date': endDate,
                'station': station,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Analyze Staff Performance
     * Staff performance analysis
     *
     * - **Sales per staff**: Revenue attribution
     * - **Efficiency**: Orders handled per hour
     * - **Hours worked**: Total and overtime
     * - **Attendance**: Punctuality and reliability
     * @param businessId
     * @param startDate
     * @param endDate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static analyzeStaffPerformanceApiV1AnalyticsOperationsStaffPerformanceGet(
        businessId: string,
        startDate: string,
        endDate: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/operations/staff-performance',
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
     * Analyze Labor Costs
     * Labor cost analysis
     *
     * - **Total costs**: Regular and overtime
     * - **Labor percentage**: % of revenue
     * - **By position**: Cost breakdown
     * - **Optimization**: Scheduling recommendations
     * @param businessId
     * @param startDate
     * @param endDate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static analyzeLaborCostsApiV1AnalyticsFinancialLaborCostsGet(
        businessId: string,
        startDate: string,
        endDate: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/financial/labor-costs',
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
     * Analyze Cogs
     * Cost of Goods Sold (COGS) analysis
     *
     * - **Total COGS**: Inventory costs
     * - **COGS percentage**: % of revenue
     * - **By category**: Category-wise breakdown
     * - **Trends**: COGS over time
     * @param businessId
     * @param startDate
     * @param endDate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static analyzeCogsApiV1AnalyticsFinancialCogsGet(
        businessId: string,
        startDate: string,
        endDate: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/financial/cogs',
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
     * Compare Periods
     * Period-over-period comparison
     *
     * - **Growth rates**: Revenue, orders, customers
     * - **Trends**: Improving or declining metrics
     * - **Insights**: Key changes and drivers
     * @param businessId
     * @param currentStart
     * @param currentEnd
     * @param comparisonType
     * @returns any Successful Response
     * @throws ApiError
     */
    public static comparePeriodsApiV1AnalyticsComparePeriodOverPeriodGet(
        businessId: string,
        currentStart: string,
        currentEnd: string,
        comparisonType: string = 'previous',
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/compare/period-over-period',
            query: {
                'business_id': businessId,
                'current_start': currentStart,
                'current_end': currentEnd,
                'comparison_type': comparisonType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Compare Locations
     * Multi-location comparison
     *
     * - **Performance**: Compare location metrics
     * - **Best practices**: Identify top performers
     * - **Opportunities**: Underperforming locations
     * @param businessId
     * @param startDate
     * @param endDate
     * @returns any Successful Response
     * @throws ApiError
     */
    public static compareLocationsApiV1AnalyticsCompareLocationsGet(
        businessId: string,
        startDate: string,
        endDate: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/compare/locations',
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
     * Forecast Revenue
     * Revenue forecasting
     *
     * - **Predictions**: Future revenue estimates
     * - **Confidence intervals**: Prediction ranges
     * - **Trends**: Growth trajectory
     * @param businessId
     * @param forecastDays
     * @returns any Successful Response
     * @throws ApiError
     */
    public static forecastRevenueApiV1AnalyticsForecastRevenueGet(
        businessId: string,
        forecastDays: number = 30,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/forecast/revenue',
            query: {
                'business_id': businessId,
                'forecast_days': forecastDays,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Forecast Inventory Needs
     * Inventory needs forecasting
     *
     * - **Predictions**: Expected usage
     * - **Reorder recommendations**: What to order
     * - **Quantities**: Optimal order amounts
     * @param businessId
     * @param forecastDays
     * @returns any Successful Response
     * @throws ApiError
     */
    public static forecastInventoryNeedsApiV1AnalyticsForecastInventoryNeedsGet(
        businessId: string,
        forecastDays: number = 7,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/forecast/inventory-needs',
            query: {
                'business_id': businessId,
                'forecast_days': forecastDays,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Scheduled Reports
     * List scheduled reports
     *
     * - **Recurring reports**: Daily, weekly, monthly
     * - **Recipients**: Email distribution lists
     * - **Status**: Active, paused, completed
     * @param businessId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listScheduledReportsApiV1AnalyticsReportsScheduledGet(
        businessId: string,
    ): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/analytics/reports/scheduled',
            query: {
                'business_id': businessId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Schedule Report
     * Schedule recurring report
     *
     * - **Frequency**: Daily, weekly, monthly
     * - **Recipients**: Email addresses
     * - **Content**: Customizable sections
     * @param businessId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static scheduleReportApiV1AnalyticsReportsSchedulePost(
        businessId: string,
        requestBody: Record<string, any>,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/analytics/reports/schedule',
            query: {
                'business_id': businessId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
