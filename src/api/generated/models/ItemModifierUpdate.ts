/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ModifierOption_Input } from './ModifierOption_Input';
/**
 * Update item modifier
 */
export type ItemModifierUpdate = {
    name?: (string | null);
    type?: (string | null);
    required?: (boolean | null);
    min_selections?: (number | null);
    max_selections?: (number | null);
    options?: (Array<ModifierOption_Input> | null);
};

