'use client';

import { useCustomers } from '@/hooks/useCustomers';
import { CustomerFilters } from '@/components/customers/CustomerFilters';
import { CustomerTable } from '@/components/customers/CustomerTable';
import { CustomerPagination } from '@/components/customers/CustomerPagination';
import { CustomerModal } from '@/components/customers/CustomerModal';
import { CustomerDetailModal } from '@/components/customers/CustomerDetailModal';
import { AppLayout } from '@/components/layout/AppLayout';

export default function CustomersPage() {
  const { customers, pagination, filters, loading, error, modals, actions } = useCustomers();

  return (
    <AppLayout>
      <div className="space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestão de Clientes</h1>
            <p className="text-sm text-slate-500 mt-1">
              Cadastre, edite, consulte e gerencie a base cadastral
            </p>
          </div>

          <button
            onClick={actions.openCreateModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors self-start sm:self-auto"
          >
            + Novo Cliente
          </button>
        </header>

        {error && (
          <div role="alert" className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <CustomerFilters
            search={filters.search || ''}
            status={filters.status || ''}
            onSearchChange={actions.handleSearchChange}
            onStatusChange={actions.handleStatusChange}
          />

          <CustomerTable
            customers={customers}
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

        <CustomerModal
          isOpen={modals.isFormOpen}
          customer={modals.selectedCustomer}
          onClose={actions.closeModals}
          onSave={actions.handleSave}
        />

        <CustomerDetailModal
          isOpen={modals.isDetailOpen}
          customer={modals.selectedCustomer}
          onClose={actions.closeModals}
          onEdit={actions.openEditModal}
        />
      </div>
    </AppLayout>
  );
}