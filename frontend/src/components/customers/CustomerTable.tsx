import { Customer } from '@/types/customer';

interface CustomerTableProps {
  customers: Customer[];
  loading: boolean;
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (id: number) => void;
}

export function CustomerTable({
  customers,
  loading,
  onView,
  onEdit,
  onDelete,
}: CustomerTableProps) {
  if (loading) {
    return <div className="py-12 text-center text-slate-500">Carregando dados dos clientes...</div>;
  }

  if (customers.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500 bg-white border border-slate-200 rounded-lg">
        Nenhum cliente encontrado com os filtros selecionados.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white border border-slate-200 rounded-lg shadow-sm">
      <table className="w-full text-left text-sm text-slate-700">
        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
          <tr>
            <th className="px-6 py-3">Cliente</th>
            <th className="px-6 py-3">Documento</th>
            <th className="px-6 py-3">E-mail</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-medium text-slate-900">{customer.name}</td>
              <td className="px-6 py-4">{customer.document}</td>
              <td className="px-6 py-4 text-slate-600">{customer.email}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    customer.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {customer.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <button
                  onClick={() => onView(customer)}
                  className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
                >
                  Visualizar
                </button>
                <button
                  onClick={() => onEdit(customer)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(customer.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}