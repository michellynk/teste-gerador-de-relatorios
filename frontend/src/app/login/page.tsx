import { LoginForm } from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Login - Teste Gerador de Relatórios',
  description: 'Autenticação no sistema gerador de relatórios',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <LoginForm />
    </main>
  );
}