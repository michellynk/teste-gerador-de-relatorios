import { Customer } from './customer';

export type BillingStatus = 'pending' | 'paid' | 'overdue' | 'canceled';

export interface Billing {
  id: number;
  customer_id: number;
  customer?: Pick<Customer, 'id' | 'name' | 'document' | 'email'>;
  description: string;
  original_amount: string | number;
  issue_date: string;
  due_date: string;
  payment_date: string | null;
  interest_rate: string | number;
  status: BillingStatus;
  created_at: string;
  updated_at: string;
}

export interface BillingFilters {
  search?: string;
  status?: BillingStatus | '';
  customer_id?: number | '';
  page?: number;
  per_page?: number;
}