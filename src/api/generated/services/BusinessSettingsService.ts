/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BusinessSettings } from '../models/BusinessSettings';
import type { BusinessSettingsUpdate } from '../models/BusinessSettingsUpdate';
import type { WorkingHours } from '../models/WorkingHours';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BusinessSettingsService {
    /**
     * Get Business Settings
     * Get business settings (Requires Authentication)
     *
     * - **Notifications**: Email, SMS, push preferences
     * - **Preferences**: Locale, currency, timezone
     * - **Business hours**: Operating hours per day
     * - **Integrations**: Third-party service configs
     * @returns BusinessSettings Successful Response
     * @throws ApiError
     */
    public static getBusinessSettingsApiV1BusinessSettingsBusinessIdGet({
        businessId,
    }: {
        businessId: string,
    }): CancelablePromise<BusinessSettings> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/business-settings/{business_id}',
            path: {
                'business_id': businessId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Business Settings
     * Update business settings (Requires Authentication - Owner/Admin)
     *
     * - **Partial updates**: Only update provided fields
     * - **Validation**: Ensure valid configurations
     * @returns BusinessSettings Successful Response
     * @throws ApiError
     */
    public static updateBusinessSettingsApiV1BusinessSettingsBusinessIdPut({
        businessId,
        requestBody,
    }: {
        businessId: string,
        requestBody: BusinessSettingsUpdate,
    }): CancelablePromise<BusinessSettings> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/business-settings/{business_id}',
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
     * Get Working Hours
     * Get business working hours (Requires Authentication)
     *
     * - **Schedule**: Hours for each day of week
     * - **Breaks**: Break periods during the day
     * - **Holidays**: Special hours or closures
     * @returns WorkingHours Successful Response
     * @throws ApiError
     */
    public static getWorkingHoursApiV1BusinessSettingsBusinessIdWorkingHoursGet({
        businessId,
    }: {
        businessId: string,
    }): CancelablePromise<Array<WorkingHours>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/business-settings/{business_id}/working-hours',
            path: {
                'business_id': businessId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Working Hours
     * Update business working hours (Requires Authentication - Owner/Admin)
     *
     * - **Validation**: Ensure valid time ranges
     * - **Conflicts**: Check for overlapping hours
     * @returns WorkingHours Successful Response
     * @throws ApiError
     */
    public static updateWorkingHoursApiV1BusinessSettingsBusinessIdWorkingHoursPut({
        businessId,
        requestBody,
    }: {
        businessId: string,
        requestBody: Array<WorkingHours>,
    }): CancelablePromise<Array<WorkingHours>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/business-settings/{business_id}/working-hours',
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
     * Get Integrations
     * Get third-party integrations (Requires Authentication)
     *
     * - **POS systems**: Toast, Square, Clover
     * - **Delivery**: DoorDash, UberEats, GrubHub
     * - **Payments**: Stripe, PayPal
     * - **Communication**: Twilio, SendGrid
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getIntegrationsApiV1BusinessSettingsBusinessIdIntegrationsGet({
        businessId,
    }: {
        businessId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/business-settings/{business_id}/integrations',
            path: {
                'business_id': businessId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Integration
     * Update integration configuration (Requires Authentication - Owner/Admin)
     *
     * - **Enable/disable**: Toggle integration
     * - **Credentials**: API keys, tokens
     * - **Settings**: Integration-specific configs
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateIntegrationApiV1BusinessSettingsBusinessIdIntegrationsIntegrationNamePut({
        businessId,
        integrationName,
        requestBody,
    }: {
        businessId: string,
        integrationName: string,
        requestBody: Record<string, any>,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/business-settings/{business_id}/integrations/{integration_name}',
            path: {
                'business_id': businessId,
                'integration_name': integrationName,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Integration
     * Remove integration configuration (Requires Authentication - Owner/Admin)
     * @returns void
     * @throws ApiError
     */
    public static deleteIntegrationApiV1BusinessSettingsBusinessIdIntegrationsIntegrationNameDelete({
        businessId,
        integrationName,
    }: {
        businessId: string,
        integrationName: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/business-settings/{business_id}/integrations/{integration_name}',
            path: {
                'business_id': businessId,
                'integration_name': integrationName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
