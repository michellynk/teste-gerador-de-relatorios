'use client';

import { useBillingReport } from '@/hooks/useBillingReport';
import { ReportSummaryCards } from '@/components/reports/ReportSummaryCards';
import { CustomerPagination } from '@/components/customers/CustomerPagination';
import { AppLayout } from '@/components/layout/AppLayout';
import { formatDate } from '@/utils/date';

export default function ReportsPage() {
  const {
    reportData,
    summary,
    pagination,
    filters,
    loading,
    exporting,
    error,
    actions,
  } = useBillingReport();

  const formatCurrency = (val: number | string | undefined) =>
    Number(val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <AppLayout>
      <div className="space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Relatório de Faturamento</h1>
            <p className="text-sm text-slate-500 mt-1">
              Visão consolidada com apuração de juros compostos e exportação
            </p>
          </div>

          <button
            onClick={actions.handleExportCsv}
            disabled={exporting || loading}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
          >
            {exporting ? 'Gerando CSV...' : '📥 Exportar CSV'}
          </button>
        </header>

        {error && (
          <div role="alert" className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <ReportSummaryCards summary={summary} />

        {/* Filtros de Alta Performance */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                Vencimento Inicial
              </label>
              <input
                type="date"
                value={filters.start_date || ''}
                onChange={(e) => actions.handleFilterChange('start_date', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                Vencimento Final
              </label>
              <input
                type="date"
                value={filters.end_date || ''}
                onChange={(e) => actions.handleFilterChange('end_date', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => actions.handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os status</option>
                <option value="pending">Pendente</option>
                <option value="paid">Pago</option>
                <option value="overdue">Vencido</option>
                <option value="canceled">Cancelado</option>
              </select>
            </div>
          </div>

          {/* Tabela de Relatório */}
          {loading ? (
            <div className="py-16 text-center text-slate-500">Compilando dados do relatório...</div>
          ) : reportData.length === 0 ? (
            <div className="py-12 text-center text-slate-500">Nenhum registro para os filtros informados.</div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
                  <tr>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Descrição</th>
                    <th className="px-4 py-3">Valor Original</th>
                    <th className="px-4 py-3">Valor c/ Juros</th>
                    <th className="px-4 py-3">Vencimento</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {reportData.map((billing) => {
                    const calc = billing.calculation;
                    const hasInterest = calc && calc.is_overdue && calc.interest_amount > 0;

                    return (
                      <tr key={billing.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {billing.customer?.name}
                        </td>
                        <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                          {billing.description}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {formatCurrency(billing.original_amount)}
                        </td>
                        <td className="px-4 py-3">
                          {hasInterest ? (
                            <span className="font-bold text-red-600">
                              {formatCurrency(calc.final_amount)}
                            </span>
                          ) : (
                            <span className="text-slate-800">
                              {formatCurrency(billing.original_amount)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">{formatDate(billing.due_date)}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs uppercase font-semibold text-slate-600">
                            {billing.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <CustomerPagination
            currentPage={pagination.currentPage}
            lastPage={pagination.lastPage}
            total={pagination.total}
            from={pagination.from}
            to={pagination.to}
            onPageChange={actions.handlePageChange}
          />
        </div>
      </div>
    </AppLayout>
  );
}