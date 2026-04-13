'use client';

import { useEffect, useMemo, useState } from 'react';

type Category = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  parent_id: string | null;
};

type Product = {
  id: string;
  name: string;
  image_url: string;
  description: string;
  short_description: string;
  badges: string;
  category_id: string;
};

type Props = {
  adminEmail: string;
};

export default function AdminDashboard({ adminEmail }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'categories' | 'products'>('categories');

  const [categoryForm, setCategoryForm] = useState({ name: '', imageUrl: '', parentId: '', description: '' });
  const [productForm, setProductForm] = useState({
    name: '',
    imageUrls: '',
    badges: '',
    categoryIds: '',
    description: '',
    shortDescription: '',
  });

  const refresh = async () => {
    const [catsRes, prodRes] = await Promise.all([fetch('/api/admin/categories'), fetch('/api/admin/products')]);
    const cats = (await catsRes.json()) as { ok: boolean; rows?: Category[] };
    const prods = (await prodRes.json()) as { ok: boolean; rows?: Product[] };
    if (cats.ok) setCategories(cats.rows || []);
    if (prods.ok) setProducts(prods.rows || []);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const categoryOptions = useMemo(() => categories.map((item) => ({ id: item.id, name: item.name })), [categories]);

  const createCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: categoryForm.name,
        imageUrl: categoryForm.imageUrl,
        parentId: categoryForm.parentId || null,
        description: categoryForm.description,
      }),
    });
    setCategoryForm({ name: '', imageUrl: '', parentId: '', description: '' });
    await refresh();
  };

  const createProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: productForm.name,
        imageUrls: productForm.imageUrls.split('\n').map((item) => item.trim()).filter(Boolean),
        badges: productForm.badges.split(',').map((item) => item.trim()).filter(Boolean),
        categoryIds: productForm.categoryIds.split(',').map((item) => item.trim()).filter(Boolean),
        description: productForm.description,
        shortDescription: productForm.shortDescription,
      }),
    });
    setProductForm({ name: '', imageUrls: '', badges: '', categoryIds: '', description: '', shortDescription: '' });
    await refresh();
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-stone-900">Custom Admin</h1>
          <p className="text-sm text-stone-600">Logged in as {adminEmail}</p>
        </div>
        <button onClick={logout} className="rounded-lg border border-stone-300 px-4 py-2 text-sm">
          Logout
        </button>
      </div>

      <div className="mb-6 flex gap-2">
        <button onClick={() => setActiveTab('categories')} className="rounded-lg bg-stone-900 px-4 py-2 text-sm text-white">
          Categories
        </button>
        <button onClick={() => setActiveTab('products')} className="rounded-lg bg-stone-900 px-4 py-2 text-sm text-white">
          Products
        </button>
      </div>

      {activeTab === 'categories' ? (
        <section className="grid gap-6 md:grid-cols-2">
          <form onSubmit={createCategory} className="space-y-3 rounded-2xl border border-stone-200 bg-white p-5">
            <h2 className="text-xl font-bold">Create Category</h2>
            <input required value={categoryForm.name} onChange={(e) => setCategoryForm((s) => ({ ...s, name: e.target.value }))} placeholder="Name" className="w-full rounded border px-3 py-2" />
            <input required value={categoryForm.imageUrl} onChange={(e) => setCategoryForm((s) => ({ ...s, imageUrl: e.target.value }))} placeholder="Image URL" className="w-full rounded border px-3 py-2" />
            <select value={categoryForm.parentId} onChange={(e) => setCategoryForm((s) => ({ ...s, parentId: e.target.value }))} className="w-full rounded border px-3 py-2">
              <option value="">No parent</option>
              {categoryOptions.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
            <textarea
              required
              rows={8}
              value={categoryForm.description}
              onChange={(e) => setCategoryForm((s) => ({ ...s, description: e.target.value }))}
              placeholder="Description: markdown text OR full Tiptap JSON string"
              className="w-full rounded border px-3 py-2"
            />
            <button className="rounded bg-stone-900 px-3 py-2 text-sm font-semibold text-white">Save Category</button>
          </form>
          <div className="space-y-3 rounded-2xl border border-stone-200 bg-white p-5">
            <h2 className="text-xl font-bold">Categories ({categories.length})</h2>
            {categories.map((item) => (
              <div key={item.id} className="rounded border p-3">
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs text-stone-500">{item.id}</p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="grid gap-6 md:grid-cols-2">
          <form onSubmit={createProduct} className="space-y-3 rounded-2xl border border-stone-200 bg-white p-5">
            <h2 className="text-xl font-bold">Create Product</h2>
            <input required value={productForm.name} onChange={(e) => setProductForm((s) => ({ ...s, name: e.target.value }))} placeholder="Name" className="w-full rounded border px-3 py-2" />
            <input value={productForm.badges} onChange={(e) => setProductForm((s) => ({ ...s, badges: e.target.value }))} placeholder="Badges (comma separated)" className="w-full rounded border px-3 py-2" />
            <input value={productForm.categoryIds} onChange={(e) => setProductForm((s) => ({ ...s, categoryIds: e.target.value }))} placeholder="Category IDs (comma separated)" className="w-full rounded border px-3 py-2" />
            <textarea rows={4} value={productForm.imageUrls} onChange={(e) => setProductForm((s) => ({ ...s, imageUrls: e.target.value }))} placeholder="Image URLs (one per line)" className="w-full rounded border px-3 py-2" />
            <textarea
              required
              rows={6}
              value={productForm.shortDescription}
              onChange={(e) => setProductForm((s) => ({ ...s, shortDescription: e.target.value }))}
              placeholder="Short Description: markdown OR Tiptap JSON"
              className="w-full rounded border px-3 py-2"
            />
            <textarea
              required
              rows={8}
              value={productForm.description}
              onChange={(e) => setProductForm((s) => ({ ...s, description: e.target.value }))}
              placeholder="Description: markdown OR Tiptap JSON"
              className="w-full rounded border px-3 py-2"
            />
            <button className="rounded bg-stone-900 px-3 py-2 text-sm font-semibold text-white">Save Product</button>
          </form>
          <div className="space-y-3 rounded-2xl border border-stone-200 bg-white p-5">
            <h2 className="text-xl font-bold">Products ({products.length})</h2>
            {products.map((item) => (
              <div key={item.id} className="rounded border p-3">
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs text-stone-500">{item.id}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
