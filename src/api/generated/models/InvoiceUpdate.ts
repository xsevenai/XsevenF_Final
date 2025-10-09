/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InvoiceLineItem } from './InvoiceLineItem';
export type InvoiceUpdate = {
    client_id?: (string | null);
    project_id?: (string | null);
    invoice_number?: (string | null);
    status?: (string | null);
    issue_date?: (string | null);
    due_date?: (string | null);
    subtotal?: (number | null);
    tax_amount?: (number | null);
    discount_amount?: (number | null);
    total_amount?: (number | null);
    currency?: (string | null);
    line_items?: (Array<InvoiceLineItem> | null);
    notes?: (string | null);
    terms?: (string | null);
    payment_method?: (string | null);
    metadata?: (Record<string, any> | null);
};

