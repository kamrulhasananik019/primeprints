'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Product = {
  id: string;
  slug: string;
  name: string;
  title: string | null;
  category: string;
  status: string | null;
  created_at: string;
};

type SessionResponse = {
  ok: boolean;
  authenticated: boolean;
  admin?: { email: string };
};

type ProductPayload = {
  id?: string;
  slug: string;
  name: string;
  title: string;
  category: string;
  status: string;
};

const emptyForm: ProductPayload = {
  slug: '',
  name: '',
  title: '',
  category: '',
  status: '',
};

export default function AdminPage() {
  const router = useRouter();

  const [adminEmail, setAdminEmail] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductPayload>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitLabel = useMemo(() => (editingId ? 'Update Product' : 'Create Product'), [editingId]);

  async function loadSessionAndProducts() {
    setLoading(true);
    setError(null);

    try {
      const [sessionResponse, productsResponse] = await Promise.all([
        fetch('/api/admin/session', { cache: 'no-store' }),
        fetch('/api/admin/products', { cache: 'no-store' }),
      ]);

      const sessionPayload = (await sessionResponse.json()) as SessionResponse;

      if (!sessionResponse.ok || !sessionPayload.authenticated) {
        router.replace('/admin/login');
        return;
      }

      setAdminEmail(sessionPayload.admin?.email ?? '');
      const productsPayload = (await productsResponse.json()) as { ok?: boolean; products?: Product[]; error?: string };

      if (!productsResponse.ok || !productsPayload.ok) {
        throw new Error(productsPayload.error ?? 'Unable to load products.');
      }

      setProducts(productsPayload.products ?? []);
    } catch (cause) {
      const messageText = cause instanceof Error ? cause.message : 'Failed to load admin data.';
      setError(messageText);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSessionAndProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const endpoint = '/api/admin/products';
      const method = editingId ? 'PATCH' : 'POST';
      const payload = editingId ? { ...form, id: editingId } : form;

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? 'Unable to save product.');
      }

      setMessage(editingId ? 'Product updated.' : 'Product created.');
      resetForm();
      await loadSessionAndProducts();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Submit failed.');
    } finally {
      setSubmitting(false);
    }
  }

  async function removeProduct(id: string) {
    const confirmed = window.confirm('Delete this product? This cannot be undone.');
    if (!confirmed) {
      return;
    }

    setError(null);
    setMessage(null);

    const response = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    const payload = (await response.json()) as { ok?: boolean; error?: string };

    if (!response.ok || !payload.ok) {
      setError(payload.error ?? 'Delete failed.');
      return;
    }

    setMessage('Product deleted.');
    if (editingId === id) {
      resetForm();
    }
    await loadSessionAndProducts();
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  }

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="mb-6 h-9 w-56 animate-pulse rounded bg-(--pp-700)/20" />
        <div className="grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)]">
          <section className="rounded-2xl border border-(--pp-700)/20 bg-white p-6 shadow-sm">
            <div className="mb-4 h-7 w-40 animate-pulse rounded bg-(--pp-700)/20" />
            <div className="space-y-3">
              <div className="h-10 animate-pulse rounded bg-(--pp-700)/15" />
              <div className="h-10 animate-pulse rounded bg-(--pp-700)/15" />
              <div className="h-10 animate-pulse rounded bg-(--pp-700)/15" />
              <div className="h-10 animate-pulse rounded bg-(--pp-700)/15" />
            </div>
          </section>
          <section className="rounded-2xl border border-(--pp-700)/20 bg-white p-6 shadow-sm">
            <div className="mb-4 h-7 w-48 animate-pulse rounded bg-(--pp-700)/20" />
            <div className="space-y-2">
              <div className="h-11 animate-pulse rounded bg-(--pp-700)/15" />
              <div className="h-11 animate-pulse rounded bg-(--pp-700)/10" />
              <div className="h-11 animate-pulse rounded bg-(--pp-700)/10" />
              <div className="h-11 animate-pulse rounded bg-(--pp-700)/10" />
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-(--font-playfair-display) text-4xl text-(--pp-900)">Admin Panel</h1>
          <p className="mt-2 text-sm text-(--pp-700)">Logged in as {adminEmail}</p>
        </div>

        <button
          onClick={logout}
          className="rounded-lg border border-(--pp-700)/40 px-4 py-2 text-sm font-semibold text-(--pp-900) hover:bg-white"
        >
          Logout
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)]">
        <section className="rounded-2xl border border-(--pp-700)/20 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-(--pp-900)">{submitLabel}</h2>

          <form className="mt-5 space-y-4" onSubmit={onSubmit}>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-(--pp-900)">Slug</span>
              <input
                value={form.slug}
                onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
                required
                className="w-full rounded-lg border border-(--pp-700)/30 px-3 py-2 outline-none focus:border-(--pp-900)"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-(--pp-900)">Name</span>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                required
                className="w-full rounded-lg border border-(--pp-700)/30 px-3 py-2 outline-none focus:border-(--pp-900)"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-(--pp-900)">Title (optional)</span>
              <input
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                className="w-full rounded-lg border border-(--pp-700)/30 px-3 py-2 outline-none focus:border-(--pp-900)"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-(--pp-900)">Category slug</span>
              <input
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                required
                className="w-full rounded-lg border border-(--pp-700)/30 px-3 py-2 outline-none focus:border-(--pp-900)"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-(--pp-900)">Status (optional)</span>
              <input
                value={form.status}
                onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
                className="w-full rounded-lg border border-(--pp-700)/30 px-3 py-2 outline-none focus:border-(--pp-900)"
              />
            </label>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-(--pp-900) px-4 py-2 text-sm font-semibold text-white hover:bg-(--pp-800) disabled:opacity-60"
              >
                {submitting ? 'Saving...' : submitLabel}
              </button>

              {editingId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-(--pp-700)/40 px-4 py-2 text-sm font-semibold text-(--pp-900)"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-(--pp-700)/20 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-(--pp-900)">Products</h2>
            <span className="text-sm text-(--pp-700)">{products.length} total</span>
          </div>

          {message ? <p className="mb-3 text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-(--pp-700)/20 text-(--pp-900)">
                  <th className="px-2 py-3">Name</th>
                  <th className="px-2 py-3">Slug</th>
                  <th className="px-2 py-3">Category</th>
                  <th className="px-2 py-3">Status</th>
                  <th className="px-2 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-(--pp-700)/10">
                    <td className="px-2 py-3 text-(--pp-900)">{product.name}</td>
                    <td className="px-2 py-3 text-(--pp-700)">{product.slug}</td>
                    <td className="px-2 py-3 text-(--pp-700)">{product.category}</td>
                    <td className="px-2 py-3 text-(--pp-700)">{product.status ?? '-'}</td>
                    <td className="px-2 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(product.id);
                            setForm({
                              id: product.id,
                              slug: product.slug,
                              name: product.name,
                              title: product.title ?? '',
                              category: product.category,
                              status: product.status ?? '',
                            });
                          }}
                          className="rounded border border-(--pp-700)/30 px-2 py-1 text-xs font-semibold text-(--pp-900)"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => void removeProduct(product.id)}
                          className="rounded border border-red-300 px-2 py-1 text-xs font-semibold text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}