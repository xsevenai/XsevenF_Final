/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InvoiceLineItem } from './InvoiceLineItem';
export type InvoiceCreate = {
    client_id: string;
    project_id?: (string | null);
    invoice_number: string;
    status?: string;
    issue_date: string;
    due_date: string;
    subtotal: number;
    tax_amount?: number;
    discount_amount?: number;
    total_amount: number;
    currency?: string;
    line_items: Array<InvoiceLineItem>;
    notes?: (string | null);
    terms?: (string | null);
    payment_method?: (string | null);
    metadata?: (Record<string, any> | null);
    business_id: string;
};

