/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ModifierOption_Output } from './ModifierOption_Output';
/**
 * Item modifier response model
 */
export type ItemModifier = {
    name: string;
    type: string;
    required?: boolean;
    min_selections?: number;
    max_selections?: (number | null);
    options: Array<ModifierOption_Output>;
    id: string;
    business_id: string;
    created_at: string;
    updated_at: string;
};

