'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Billing, BillingStatus } from '@/types/billing';
import { BillingPayload } from '@/services/billing';
import { customerService, CustomerOption } from '@/services/customer';
import { CustomerSelect } from '@/components/billings/CustomerSelect';

interface BillingModalProps {
  isOpen: boolean;
  billing: Billing | null;
  onClose: () => void;
  onSave: (payload: BillingPayload) => Promise<void>;
}

export function BillingModal({
  isOpen,
  billing,
  onClose,
  onSave,
}: BillingModalProps) {
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  const [customerId, setCustomerId] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [originalAmount, setOriginalAmount] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [interestRate, setInterestRate] = useState('2.5');
  const [status, setStatus] = useState<BillingStatus>('pending');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Carrega todos os clientes ativos ao abrir o modal
  useEffect(() => {
    if (!isOpen) return;

    setLoadingCustomers(true);
    customerService
      .getActiveOptions()
      .then((data) => {
        setCustomers(data);

        // Se for nova cobrança e ainda não selecionou nada, seleciona o primeiro
        if (!billing && data.length > 0 && customerId === '') {
          setCustomerId(data[0].id);
        }
      })
      .catch(() => {
        setError('Não foi possível carregar a lista de clientes.');
      })
      .finally(() => setLoadingCustomers(false));
  }, [isOpen, billing]);

  // 2. Preenche os campos do formulário para edição ou novo cadastro
  useEffect(() => {
    if (billing) {
      setCustomerId(billing.customer_id);
      setDescription(billing.description);
      setOriginalAmount(String(billing.original_amount));
      setIssueDate(billing.issue_date.split('T')[0]);
      setDueDate(billing.due_date.split('T')[0]);
      setPaymentDate(billing.payment_date ? billing.payment_date.split('T')[0] : '');
      setInterestRate(String(billing.interest_rate));
      setStatus(billing.status);
    } else {
      setDescription('');
      setOriginalAmount('');
      const today = new Date().toISOString().split('T')[0];
      setIssueDate(today);
      setDueDate(today);
      setPaymentDate('');
      setInterestRate('2.5');
      setStatus('pending');
    }
    setError(null);
  }, [billing, isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!customerId) {
      setError('Selecione um cliente ativo para emitir a cobrança.');
      return;
    }

    setSubmitting(true);
    try {
      await onSave({
        customer_id: Number(customerId),
        description,
        original_amount: parseFloat(originalAmount),
        issue_date: issueDate,
        due_date: dueDate,
        payment_date: paymentDate || null,
        interest_rate: parseFloat(interestRate),
        status,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Falha ao salvar cobrança.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden my-8">
        <header className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">
            {billing ? 'Editar Cobrança' : 'Nova Cobrança'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-bold leading-none"
          >
            ×
          </button>
        </header>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Dropdown de Clientes Ativos */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="customer-select" className="block text-sm font-medium text-slate-700">
                Cliente Vinculado (Ativos)
              </label>
              {loadingCustomers && (
                <span className="text-xs text-blue-600 font-medium">Carregando clientes...</span>
              )}
            </div>

          <CustomerSelect
              customers={customers}
              selectedId={customerId}
              onChange={(id) => setCustomerId(id)}
              disabled={loadingCustomers}
            />
            
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Mensalidade de Serviços - Março/2026"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Valor Original (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={originalAmount}
                onChange={(e) => setOriginalAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Taxa de Juros Mensal (%)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="2.5"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data de Emissão</label>
              <input
                type="date"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data de Vencimento</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BillingStatus)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="pending">Pendente</option>
                <option value="paid">Pago</option>
                <option value="overdue">Vencido</option>
                <option value="canceled">Cancelado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data do Pagamento (Opcional)</label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <footer className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || loadingCustomers}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? 'Salvando...' : billing ? 'Atualizar Cobrança' : 'Cadastrar Cobrança'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}