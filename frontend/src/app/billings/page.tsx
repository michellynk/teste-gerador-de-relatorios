'use client';

import { useBillings } from '@/hooks/useBillings';
import { BillingFilters } from '@/components/billings/BillingFilters';
import { BillingTable } from '@/components/billings/BillingTable';
import { BillingModal } from '@/components/billings/BillingModal';
import { BillingDetailModal } from '@/components/billings/BillingDetailModal';
import { CustomerPagination } from '@/components/customers/CustomerPagination';
import { AppLayout } from '@/components/layout/AppLayout';

export default function BillingsPage() {
  const {
    billings,
    customersList,
    pagination,
    filters,
    loading,
    error,
    modals,
    actions,
  } = useBillings();

  return (
    <AppLayout>
      <div className="space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestão de Cobranças</h1>
            <p className="text-sm text-slate-500 mt-1">
              Controle de faturas, vencimentos e status financeiro
            </p>
          </div>

          <button
            onClick={actions.openCreateModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors self-start sm:self-auto"
          >
            + Nova Cobrança
          </button>
        </header>

        {error && (
          <div role="alert" className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <BillingFilters
            search={filters.search || ''}
            status={filters.status || ''}
            onSearchChange={actions.handleSearchChange}
            onStatusChange={actions.handleStatusChange}
          />

          <BillingTable
            billings={billings}
            loading={loading}
            onView={actions.openDetailModal}
            onEdit={actions.openEditModal}
            onDelete={actions.handleDelete}
          />

          <CustomerPagination
            currentPage={pagination.currentPage}
            lastPage={pagination.lastPage}
            total={pagination.total}
            from={pagination.from}
            to={pagination.to}
            onPageChange={actions.handlePageChange}
          />
        </div>

        <BillingModal
        isOpen={modals.isFormOpen}
        billing={modals.selectedBilling}
        onClose={actions.closeModals}
        onSave={actions.handleSave}
        />

        <BillingDetailModal
          isOpen={modals.isDetailOpen}
          billing={modals.selectedBilling}
          onClose={actions.closeModals}
          onEdit={actions.openEditModal}
        />
      </div>
    </AppLayout>
  );
}