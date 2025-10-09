/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WorkingHours } from './WorkingHours';
/**
 * Update business settings
 */
export type BusinessSettingsUpdate = {
    notifications?: (Record<string, any> | null);
    preferences?: (Record<string, any> | null);
    business_hours?: (Array<WorkingHours> | null);
    integrations?: (Record<string, any> | null);
};

