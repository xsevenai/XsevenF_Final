/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ModifierOption_Input } from './ModifierOption_Input';
/**
 * Create item modifier
 */
export type ItemModifierCreate = {
    name: string;
    type: string;
    required?: boolean;
    min_selections?: number;
    max_selections?: (number | null);
    options: Array<ModifierOption_Input>;
    business_id: string;
};

