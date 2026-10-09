import { Billing } from '@/types/billing';
import { formatDate } from '@/utils/date';

interface BillingTableProps {
  billings: Billing[];
  loading: boolean;
  onView: (billing: Billing) => void;
  onEdit: (billing: Billing) => void;
  onDelete: (id: number) => void;
}

const statusMap: Record<Billing['status'], { label: string; badgeClass: string }> = {
  pending: { label: 'Pendente', badgeClass: 'bg-amber-100 text-amber-800' },
  paid: { label: 'Pago', badgeClass: 'bg-green-100 text-green-800' },
  overdue: { label: 'Vencido', badgeClass: 'bg-red-100 text-red-800' },
  canceled: { label: 'Cancelado', badgeClass: 'bg-slate-100 text-slate-700' },
};

export function BillingTable({
  billings,
  loading,
  onView,
  onEdit,
  onDelete,
}: BillingTableProps) {
  if (loading) {
    return <div className="py-12 text-center text-slate-500">Carregando faturas...</div>;
  }

  if (billings.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500 bg-white border border-slate-200 rounded-lg">
        Nenhuma cobrança encontrada.
      </div>
    );
  }

  const formatCurrency = (val: number | string | undefined) =>
    Number(val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="overflow-x-auto bg-white border border-slate-200 rounded-lg shadow-sm">
      <table className="w-full text-left text-sm text-slate-700">
        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
          <tr>
            <th className="px-6 py-3">Cliente</th>
            <th className="px-6 py-3">Descrição</th>
            <th className="px-6 py-3">Valor Original</th>
            <th className="px-6 py-3">Valor Atualizado</th>
            <th className="px-6 py-3">Vencimento</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {billings.map((billing) => {
            const statusConfig = statusMap[billing.status];
            const calc = billing.calculation;
            const hasInterest = calc && calc.is_overdue && calc.interest_amount > 0;

            return (
              <tr key={billing.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{billing.customer?.name || '—'}</div>
                  <div className="text-xs text-slate-400">{billing.customer?.document}</div>
                </td>
                <td className="px-6 py-4 max-w-xs truncate">{billing.description}</td>
                <td className="px-6 py-4 font-medium text-slate-700">
                  {formatCurrency(billing.original_amount)}
                </td>
                <td className="px-6 py-4">
                  {hasInterest ? (
                    <div>
                      <div className="font-bold text-red-600">
                        {formatCurrency(calc.final_amount)}
                      </div>
                      <div className="text-[11px] text-red-500 font-medium">
                        +{formatCurrency(calc.interest_amount)} ({calc.days_overdue}d atraso)
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-900 font-medium">
                      {formatCurrency(billing.original_amount)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">{formatDate(billing.due_date)}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.badgeClass}`}>
                    {statusConfig.label}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => onView(billing)}
                    className="text-slate-600 hover:text-slate-900 text-sm font-medium"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => onEdit(billing)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(billing.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}