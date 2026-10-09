'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';

export function useLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      await authService.login({ email, password });
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha na autenticação.';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }

  return {
    fields: {
      email,
      setEmail,
      password,
      setPassword,
    },
    status: {
      loading,
      errorMessage,
    },
    actions: {
      handleSubmit,
    },
  };
}