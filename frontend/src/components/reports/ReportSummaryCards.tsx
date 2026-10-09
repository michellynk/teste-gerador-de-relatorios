import { ReportSummary } from '@/types/report';

interface ReportSummaryCardsProps {
  summary: ReportSummary;
}

export function ReportSummaryCards({ summary }: ReportSummaryCardsProps) {
  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
        <span className="text-xs font-semibold text-slate-400 uppercase">
          Volume Total ({summary.total_count})
        </span>
        <div className="text-lg font-bold text-slate-900 mt-1">
          {formatCurrency(summary.total_amount)}
        </div>
      </div>

      <div className="p-4 bg-white border border-emerald-100 rounded-xl shadow-sm">
        <span className="text-xs font-semibold text-emerald-600 uppercase">
          Recebido (Pago)
        </span>
        <div className="text-lg font-bold text-emerald-700 mt-1">
          {formatCurrency(summary.paid_amount)}
        </div>
      </div>

      <div className="p-4 bg-white border border-amber-100 rounded-xl shadow-sm">
        <span className="text-xs font-semibold text-amber-600 uppercase">
          A Vencer (Pendente)
        </span>
        <div className="text-lg font-bold text-amber-700 mt-1">
          {formatCurrency(summary.pending_amount)}
        </div>
      </div>

      <div className="p-4 bg-white border border-red-100 rounded-xl shadow-sm">
        <span className="text-xs font-semibold text-red-600 uppercase">
          Inadimplência
        </span>
        <div className="text-lg font-bold text-red-700 mt-1">
          {formatCurrency(summary.overdue_amount)}
        </div>
      </div>

      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
        <span className="text-xs font-semibold text-slate-400 uppercase">
          Canceladas
        </span>
        <div className="text-lg font-bold text-slate-600 mt-1">
          {formatCurrency(summary.canceled_amount)}
        </div>
      </div>
    </div>
  );
}