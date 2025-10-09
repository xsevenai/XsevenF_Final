/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WorkingHours } from './WorkingHours';
/**
 * Business settings model
 */
export type BusinessSettings = {
    business_id: string;
    notifications?: Record<string, any>;
    preferences?: Record<string, any>;
    business_hours?: Array<WorkingHours>;
    integrations?: Record<string, any>;
};

