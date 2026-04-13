'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        setError(payload.error ?? 'Login failed.');
        return;
      }

      router.replace(next);
    } catch {
      setError('Unable to login right now.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-md px-6 py-20">
      <div className="rounded-2xl border border-(--pp-700)/20 bg-white p-8 shadow-sm">
        <h1 className="font-(--font-playfair-display) text-3xl text-(--pp-900)">Admin Login</h1>
        <p className="mt-2 text-sm text-(--pp-700)">Sign in to manage products.</p>

        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-(--pp-900)" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading}
              required
              className="w-full rounded-lg border border-(--pp-700)/30 bg-white px-3 py-2 text-sm outline-none focus:border-(--pp-900)"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-(--pp-900)" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
              required
              className="w-full rounded-lg border border-(--pp-700)/30 bg-white px-3 py-2 text-sm outline-none focus:border-(--pp-900)"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-(--pp-900) px-4 py-2 text-sm font-semibold text-white transition hover:bg-(--pp-800) disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </main>
  );
}