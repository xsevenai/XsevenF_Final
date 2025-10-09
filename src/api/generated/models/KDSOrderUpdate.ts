/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { KDSStatus } from './KDSStatus';
/**
 * Update KDS order
 */
export type KDSOrderUpdate = {
    status?: (KDSStatus | null);
    assigned_to?: (string | null);
    prep_start_time?: (string | null);
    prep_end_time?: (string | null);
};

