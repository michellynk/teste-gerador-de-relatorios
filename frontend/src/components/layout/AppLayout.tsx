'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { authService, UserSession } from '@/services/auth';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }
    setUser(authService.getStoredUser());
  }, [router]);

  async function handleLogout() {
    await authService.logout();
    router.push('/login');
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-500 font-medium">Verificando autenticação...</p>
      </div>
    );
  }

  const navLinks = [
    { label: 'Painel', href: '/dashboard' },
    { label: 'Clientes', href: '/customers' },
    { label: 'Cobranças', href: '/billings' },
    { label: 'Relatórios', href: '/reports' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-lg font-bold text-slate-800 tracking-tight">
              TDGR - Teste Gerador de Relatórios
            </span>
            <nav className="hidden md:flex gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800 leading-none">{user.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}