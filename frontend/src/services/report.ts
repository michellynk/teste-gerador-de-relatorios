import { apiFetch } from '@/services/api';
import { BillingReportResponse, ReportFilters } from '@/types/report';

export const reportService = {
  async getBillingReport(filters: ReportFilters = {}): Promise<BillingReportResponse> {
    const params = new URLSearchParams();
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    if (filters.status) params.append('status', filters.status);
    if (filters.customer_id) params.append('customer_id', String(filters.customer_id));
    if (filters.page) params.append('page', String(filters.page));
    if (filters.per_page) params.append('per_page', String(filters.per_page));

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiFetch(`/reports/billings${query}`, { method: 'GET' });
  },

  async downloadCsv(filters: ReportFilters = {}): Promise<void> {
    const params = new URLSearchParams();
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    if (filters.status) params.append('status', filters.status);
    if (filters.customer_id) params.append('customer_id', String(filters.customer_id));

    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

    const response = await fetch(`${apiUrl}/reports/billings/export-csv?${params.toString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Falha ao exportar arquivo CSV.');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_faturamento_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },
};