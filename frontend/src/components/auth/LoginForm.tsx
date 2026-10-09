'use client';

import { useLogin } from '@/hooks/useLogin';

export function LoginForm() {
  const { fields, status, actions } = useLogin();

  return (
    <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-8 border border-slate-200">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Sistema de Faturamento</h1>
        <p className="text-sm text-slate-500 mt-1">Gerador e Analisador de Relatórios</p>
      </header>

      {status.errorMessage && (
        <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {status.errorMessage}
        </div>
      )}

      <form onSubmit={actions.handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={fields.email}
            onChange={(e) => fields.setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
            placeholder="Digite seu e-mail"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
            Senha
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={fields.password}
            onChange={(e) => fields.setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
            placeholder="Digite sua senha"
          />
        </div>

        <button
          type="submit"
          disabled={status.loading}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-150 disabled:opacity-50"
        >
          {status.loading ? 'Autenticando...' : 'Entrar no Sistema'}
        </button>
      </form>
    </div>
  );
}