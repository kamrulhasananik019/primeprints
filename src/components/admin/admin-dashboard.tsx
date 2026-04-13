'use client';

import { useEffect, useMemo, useState } from 'react';
import RichEditorField from '@/components/admin/rich-editor-field';
import Swal from 'sweetalert2';

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
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [busyCategoryId, setBusyCategoryId] = useState<string | null>(null);
  const [busyProductId, setBusyProductId] = useState<string | null>(null);

  const [categoryForm, setCategoryForm] = useState({ name: '', imageUrl: '', parentId: '', description: '' });
  const [productForm, setProductForm] = useState({
    name: '',
    imageUrls: '',
    badges: '',
    categoryNames: '',
    description: '',
    shortDescription: '',
  });

  const refresh = async () => {
    setLoading(true);
    setError('');
    const [catsRes, prodRes] = await Promise.all([fetch('/api/admin/categories', { cache: 'no-store' }), fetch('/api/admin/products', { cache: 'no-store' })]);
    const cats = (await catsRes.json()) as { ok: boolean; rows?: Category[]; error?: string };
    const prods = (await prodRes.json()) as { ok: boolean; rows?: Product[]; error?: string };
    if (cats.ok) setCategories(cats.rows || []);
    if (prods.ok) setProducts(prods.rows || []);
    if (!cats.ok || !prods.ok) setError(cats.error || prods.error || 'Failed to load data.');
    setLoading(false);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const categoryOptions = useMemo(() => categories.map((item) => ({ id: item.id, name: item.name })), [categories]);

  const createCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    const endpoint = editingCategoryId ? `/api/admin/categories/${editingCategoryId}` : '/api/admin/categories';
    const method = editingCategoryId ? 'PATCH' : 'POST';
    const response = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: categoryForm.name,
        imageUrl: categoryForm.imageUrl,
        parentId: categoryForm.parentId || null,
        description: categoryForm.description,
      }),
    });
    const data = (await response.json()) as { ok: boolean; error?: string };
    if (!data.ok) {
      setError(data.error || 'Failed to create category');
      await Swal.fire({ icon: 'error', title: 'Error', text: data.error || 'Failed to save category' });
      setSaving(false);
      return;
    }
    setCategoryForm({ name: '', imageUrl: '', parentId: '', description: '' });
    setEditingCategoryId(null);
    await refresh();
    setSaving(false);
    setSuccess(editingCategoryId ? 'Category updated' : 'Category created');
    await Swal.fire({ icon: 'success', title: 'Saved', text: editingCategoryId ? 'Category updated successfully' : 'Category created successfully' });
  };

  const createProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    const endpoint = editingProductId ? `/api/admin/products/${editingProductId}` : '/api/admin/products';
    const method = editingProductId ? 'PATCH' : 'POST';
    const response = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: productForm.name,
        imageUrls: productForm.imageUrls.split('\n').map((item) => item.trim()).filter(Boolean),
        badges: productForm.badges.split(',').map((item) => item.trim()).filter(Boolean),
        categoryIds: productForm.categoryNames.split(',').map((item) => item.trim()).filter(Boolean),
        description: productForm.description,
        shortDescription: productForm.shortDescription,
      }),
    });
    const data = (await response.json()) as { ok: boolean; error?: string };
    if (!data.ok) {
      setError(data.error || 'Failed to create product');
      await Swal.fire({ icon: 'error', title: 'Error', text: data.error || 'Failed to save product' });
      setSaving(false);
      return;
    }
    setProductForm({ name: '', imageUrls: '', badges: '', categoryNames: '', description: '', shortDescription: '' });
    setEditingProductId(null);
    await refresh();
    setSaving(false);
    setSuccess(editingProductId ? 'Product updated' : 'Product created');
    await Swal.fire({ icon: 'success', title: 'Saved', text: editingProductId ? 'Product updated successfully' : 'Product created successfully' });
  };

  const removeCategory = async (id: string) => {
    const confirm = await Swal.fire({
      icon: 'warning',
      title: 'Delete category?',
      text: 'This action cannot be undone.',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#dc2626',
    });
    if (!confirm.isConfirmed) return;

    setBusyCategoryId(id);
    setError('');
    setSuccess('');
    const response = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    const data = (await response.json()) as { ok: boolean; error?: string };
    if (!data.ok) {
      setError(data.error || 'Failed to delete category');
      await Swal.fire({ icon: 'error', title: 'Error', text: data.error || 'Failed to delete category' });
      setBusyCategoryId(null);
      return;
    }
    await refresh();
    setSuccess('Category deleted');
    await Swal.fire({ icon: 'success', title: 'Deleted', text: 'Category deleted successfully' });
    setBusyCategoryId(null);
  };

  const removeProduct = async (id: string) => {
    const confirm = await Swal.fire({
      icon: 'warning',
      title: 'Delete product?',
      text: 'This action cannot be undone.',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#dc2626',
    });
    if (!confirm.isConfirmed) return;

    setBusyProductId(id);
    setError('');
    setSuccess('');
    const response = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    const data = (await response.json()) as { ok: boolean; error?: string };
    if (!data.ok) {
      setError(data.error || 'Failed to delete product');
      await Swal.fire({ icon: 'error', title: 'Error', text: data.error || 'Failed to delete product' });
      setBusyProductId(null);
      return;
    }
    await refresh();
    setSuccess('Product deleted');
    await Swal.fire({ icon: 'success', title: 'Deleted', text: 'Product deleted successfully' });
    setBusyProductId(null);
  };

  const startEditCategory = (item: Category) => {
    setEditingCategoryId(item.id);
    setCategoryForm({
      name: item.name,
      imageUrl: item.image_url,
      parentId: item.parent_id || '',
      description: item.description,
    });
  };

  const startEditProduct = (item: Product) => {
    const categoryIds = (() => {
      try {
        const parsed = JSON.parse(item.category_id) as string[];
        const categoryNameById = new Map(categories.map((cat) => [cat.id, cat.name]));
        return (Array.isArray(parsed) ? parsed : [])
          .map((id) => categoryNameById.get(id) || id)
          .join(', ');
      } catch {
        return item.category_id;
      }
    })();
    const imageUrls = (() => {
      try {
        const parsed = JSON.parse(item.image_url) as string[];
        return Array.isArray(parsed) ? parsed.join('\n') : '';
      } catch {
        return '';
      }
    })();
    const badges = (() => {
      try {
        const parsed = JSON.parse(item.badges) as string[];
        return Array.isArray(parsed) ? parsed.join(', ') : '';
      } catch {
        return '';
      }
    })();

    setEditingProductId(item.id);
    setProductForm({
      name: item.name,
      imageUrls,
      badges,
      categoryNames: categoryIds,
      description: item.description,
      shortDescription: item.short_description,
    });
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {(loading || saving) && (
        <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/30">
          <div className="rounded-xl bg-white px-6 py-4 text-sm font-semibold text-stone-700">
            {saving ? 'Saving data...' : 'Loading data...'}
          </div>
        </div>
      )}
      <div className="mb-8 rounded-2xl border border-stone-200 bg-gradient-to-r from-slate-900 to-cyan-900 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black">Prime Prints Admin</h1>
            <p className="mt-1 text-sm text-cyan-100">Logged in as {adminEmail}</p>
          </div>
          <button onClick={logout} className="rounded-lg border border-white/30 px-4 py-2 text-sm">
            Logout
          </button>
        </div>
      </div>

      {error ? <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {success ? <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p> : null}

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setActiveTab('categories')}
          className={`rounded-lg px-4 py-2 text-sm ${activeTab === 'categories' ? 'bg-stone-900 text-white' : 'border border-stone-300 bg-white text-stone-700'}`}
        >
          Categories
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`rounded-lg px-4 py-2 text-sm ${activeTab === 'products' ? 'bg-stone-900 text-white' : 'border border-stone-300 bg-white text-stone-700'}`}
        >
          Products
        </button>
        <button onClick={() => void refresh()} className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm text-stone-700">
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {activeTab === 'categories' ? (
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <form onSubmit={createCategory} className="space-y-3 rounded-2xl border border-stone-200 bg-white p-5">
            <h2 className="text-xl font-bold">{editingCategoryId ? 'Update Category' : 'Create Category'}</h2>
            <input required value={categoryForm.name} onChange={(e) => setCategoryForm((s) => ({ ...s, name: e.target.value }))} placeholder="Name" className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" />
            <input required value={categoryForm.imageUrl} onChange={(e) => setCategoryForm((s) => ({ ...s, imageUrl: e.target.value }))} placeholder="Image URL" className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" />
            <select value={categoryForm.parentId} onChange={(e) => setCategoryForm((s) => ({ ...s, parentId: e.target.value }))} className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm">
              <option value="">No parent</option>
              {categoryOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <RichEditorField
              label="Description"
              value={categoryForm.description}
              onChange={(value) => setCategoryForm((s) => ({ ...s, description: value }))}
              minRows={8}
            />
            <div className="flex gap-2">
              <button className="rounded-lg bg-stone-900 px-3 py-2 text-sm font-semibold text-white">
                {editingCategoryId ? 'Update Category' : 'Save Category'}
              </button>
              {editingCategoryId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategoryId(null);
                    setCategoryForm({ name: '', imageUrl: '', parentId: '', description: '' });
                  }}
                  className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
          <div className="space-y-3 rounded-2xl border border-stone-200 bg-white p-5">
            <h2 className="text-xl font-bold">Categories ({categories.length})</h2>
            {categories.map((item) => (
              <div key={item.id} className="rounded-lg border border-stone-200 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-stone-500">{item.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {busyCategoryId === item.id ? <span className="text-xs text-stone-500">Working...</span> : null}
                    <button
                      disabled={busyCategoryId === item.id}
                      onClick={() => void removeCategory(item.id)}
                      className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Delete
                    </button>
                    <button
                      disabled={busyCategoryId === item.id}
                      onClick={() => startEditCategory(item)}
                      className="rounded-md border border-cyan-300 px-2 py-1 text-xs text-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <form onSubmit={createProduct} className="space-y-3 rounded-2xl border border-stone-200 bg-white p-5">
            <h2 className="text-xl font-bold">{editingProductId ? 'Update Product' : 'Create Product'}</h2>
            <input required value={productForm.name} onChange={(e) => setProductForm((s) => ({ ...s, name: e.target.value }))} placeholder="Name" className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" />
            <input value={productForm.badges} onChange={(e) => setProductForm((s) => ({ ...s, badges: e.target.value }))} placeholder="Badges (comma separated)" className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" />
            <input value={productForm.categoryNames} onChange={(e) => setProductForm((s) => ({ ...s, categoryNames: e.target.value }))} placeholder="Category names (comma separated)" className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" />
            <p className="text-xs text-stone-500">Available: {categories.map((item) => item.name).join(', ')}</p>
            <textarea rows={4} value={productForm.imageUrls} onChange={(e) => setProductForm((s) => ({ ...s, imageUrls: e.target.value }))} placeholder="Image URLs (one per line)" className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm" />
            <RichEditorField
              label="Short Description"
              value={productForm.shortDescription}
              onChange={(value) => setProductForm((s) => ({ ...s, shortDescription: value }))}
              minRows={6}
            />
            <RichEditorField
              label="Description"
              value={productForm.description}
              onChange={(value) => setProductForm((s) => ({ ...s, description: value }))}
              minRows={8}
            />
            <div className="flex gap-2">
              <button className="rounded-lg bg-stone-900 px-3 py-2 text-sm font-semibold text-white">
                {editingProductId ? 'Update Product' : 'Save Product'}
              </button>
              {editingProductId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingProductId(null);
                    setProductForm({ name: '', imageUrls: '', badges: '', categoryNames: '', description: '', shortDescription: '' });
                  }}
                  className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
          <div className="space-y-3 rounded-2xl border border-stone-200 bg-white p-5">
            <h2 className="text-xl font-bold">Products ({products.length})</h2>
            {products.map((item) => (
              <div key={item.id} className="rounded-lg border border-stone-200 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-stone-500">{item.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {busyProductId === item.id ? <span className="text-xs text-stone-500">Working...</span> : null}
                    <button
                      disabled={busyProductId === item.id}
                      onClick={() => void removeProduct(item.id)}
                      className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Delete
                    </button>
                    <button
                      disabled={busyProductId === item.id}
                      onClick={() => startEditProduct(item)}
                      className="rounded-md border border-cyan-300 px-2 py-1 text-xs text-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
