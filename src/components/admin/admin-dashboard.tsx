'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  Boxes,
  FilePenLine,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import Swal from 'sweetalert2';

import RichEditorField from '@/components/admin/rich-editor-field';
import ReviewManager, { type AdminReviewItem } from '@/components/admin/review-manager';

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

type SectionKey = 'overview' | 'categories' | 'products' | 'reviews';

type DashboardResponse = {
  ok: boolean;
  categories?: Category[];
  products?: Product[];
  reviews?: AdminReviewItem[];
  error?: string;
};

const emptyCategoryForm = {
  name: '',
  imageUrl: '',
  parentId: '',
  description: '',
};

const emptyProductForm = {
  name: '',
  imageUrls: '',
  badges: '',
  categoryIds: [] as string[],
  description: '',
  shortDescription: '',
};

function parseJsonArray(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.map((item) => String(item)) : [];
  } catch {
    return [];
  }
}

function getTextFromTiptapJson(raw: string): string {
  try {
    const parsed = JSON.parse(raw) as { content?: unknown[] };
    const text = JSON.stringify(parsed.content ?? [])
      .replace(/[{}\[\]"]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return text.length > 120 ? `${text.slice(0, 117)}...` : text;
  } catch {
    return raw.slice(0, 120);
  }
}

export default function AdminDashboard({ adminEmail }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState<SectionKey>('overview');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [busyCategoryId, setBusyCategoryId] = useState<string | null>(null);
  const [busyProductId, setBusyProductId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerCollapsed, setDrawerCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [productForm, setProductForm] = useState(emptyProductForm);

  const dashboardQuery = useQuery<DashboardResponse>({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const response = await fetch('/api/admin/dashboard', {
        credentials: 'include',
        cache: 'no-store',
      });
      return (await response.json()) as DashboardResponse;
    },
  });

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
  };

  const categories = useMemo(() => dashboardQuery.data?.categories || [], [dashboardQuery.data?.categories]);
  const products = useMemo(() => dashboardQuery.data?.products || [], [dashboardQuery.data?.products]);
  const reviews = useMemo(() => dashboardQuery.data?.reviews || [], [dashboardQuery.data?.reviews]);
  const isLoading = dashboardQuery.isLoading || dashboardQuery.isFetching;
  const queryError = dashboardQuery.data && !dashboardQuery.data.ok ? dashboardQuery.data.error || 'Failed to load data.' : '';

  const categoryNameById = useMemo(() => {
    return new Map(categories.map((item) => [item.id, item.name]));
  }, [categories]);

  const categoryOptions = useMemo(() => {
    return categories.map((item) => ({ id: item.id, name: item.name }));
  }, [categories]);

  const filteredCategories = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return categories;
    return categories.filter((item) => {
      return item.name.toLowerCase().includes(term) || item.id.toLowerCase().includes(term);
    });
  }, [categories, searchTerm]);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return products;
    return products.filter((item) => {
      return item.name.toLowerCase().includes(term) || item.id.toLowerCase().includes(term);
    });
  }, [products, searchTerm]);

  const filteredReviews = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return reviews;
    return reviews.filter((item) => {
      return item.name.toLowerCase().includes(term) || item.email.toLowerCase().includes(term) || item.id.toLowerCase().includes(term);
    });
  }, [reviews, searchTerm]);

  const createCategory = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    const endpoint = editingCategoryId ? `/api/admin/categories/${editingCategoryId}` : '/api/admin/categories';
    const method = editingCategoryId ? 'PATCH' : 'POST';

    const response = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      cache: 'no-store',
      body: JSON.stringify({
        name: categoryForm.name,
        imageUrl: categoryForm.imageUrl,
        parentId: categoryForm.parentId || null,
        description: categoryForm.description,
      }),
    });

    const data = (await response.json()) as { ok: boolean; error?: string };
    if (!data.ok) {
      setError(data.error || 'Failed to save category');
      await Swal.fire({ icon: 'error', title: 'Error', text: data.error || 'Failed to save category' });
      setSaving(false);
      return;
    }

    setEditingCategoryId(null);
    setCategoryForm(emptyCategoryForm);
    await refresh();

    setSaving(false);
    setSuccess(editingCategoryId ? 'Category updated.' : 'Category created.');
    await Swal.fire({ icon: 'success', title: 'Saved', text: editingCategoryId ? 'Category updated successfully.' : 'Category created successfully.' });
  };

  const createProduct = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    const endpoint = editingProductId ? `/api/admin/products/${editingProductId}` : '/api/admin/products';
    const method = editingProductId ? 'PATCH' : 'POST';

    const response = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      cache: 'no-store',
      body: JSON.stringify({
        name: productForm.name,
        imageUrls: productForm.imageUrls
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
        badges: productForm.badges
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        categoryIds: productForm.categoryIds,
        description: productForm.description,
        shortDescription: productForm.shortDescription,
      }),
    });

    const data = (await response.json()) as { ok: boolean; error?: string };
    if (!data.ok) {
      setError(data.error || 'Failed to save product');
      await Swal.fire({ icon: 'error', title: 'Error', text: data.error || 'Failed to save product' });
      setSaving(false);
      return;
    }

    setEditingProductId(null);
    setProductForm(emptyProductForm);
    await refresh();

    setSaving(false);
    setSuccess(editingProductId ? 'Product updated.' : 'Product created.');
    await Swal.fire({ icon: 'success', title: 'Saved', text: editingProductId ? 'Product updated successfully.' : 'Product created successfully.' });
  };

  const removeCategory = async (id: string) => {
    const confirm = await Swal.fire({
      icon: 'warning',
      title: 'Delete category?',
      text: 'This action cannot be undone.',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#b91c1c',
    });

    if (!confirm.isConfirmed) return;

    setBusyCategoryId(id);
    setError('');
    setSuccess('');

    const response = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE', credentials: 'include', cache: 'no-store' });
    const data = (await response.json()) as { ok: boolean; error?: string };

    if (!data.ok) {
      setError(data.error || 'Failed to delete category');
      await Swal.fire({ icon: 'error', title: 'Error', text: data.error || 'Failed to delete category' });
      setBusyCategoryId(null);
      return;
    }

    await refresh();
    setSuccess('Category deleted.');
    await Swal.fire({ icon: 'success', title: 'Deleted', text: 'Category deleted successfully.' });
    setBusyCategoryId(null);
  };

  const removeProduct = async (id: string) => {
    const confirm = await Swal.fire({
      icon: 'warning',
      title: 'Delete product?',
      text: 'This action cannot be undone.',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#b91c1c',
    });

    if (!confirm.isConfirmed) return;

    setBusyProductId(id);
    setError('');
    setSuccess('');

    const response = await fetch(`/api/admin/products/${id}`, { method: 'DELETE', credentials: 'include', cache: 'no-store' });
    const data = (await response.json()) as { ok: boolean; error?: string };

    if (!data.ok) {
      setError(data.error || 'Failed to delete product');
      await Swal.fire({ icon: 'error', title: 'Error', text: data.error || 'Failed to delete product' });
      setBusyProductId(null);
      return;
    }

    await refresh();
    setSuccess('Product deleted.');
    await Swal.fire({ icon: 'success', title: 'Deleted', text: 'Product deleted successfully.' });
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
    setActiveSection('categories');
    setDrawerOpen(false);
  };

  const startEditProduct = (item: Product) => {
    const categoryIds = parseJsonArray(item.category_id);

    const imageUrls = parseJsonArray(item.image_url).join('\n');
    const badges = parseJsonArray(item.badges).join(', ');

    setEditingProductId(item.id);
    setProductForm({
      name: item.name,
      imageUrls,
      badges,
      categoryIds,
      description: item.description,
      shortDescription: item.short_description,
    });
    setActiveSection('products');
    setDrawerOpen(false);
  };

  const resetCategoryEdit = () => {
    setEditingCategoryId(null);
    setCategoryForm(emptyCategoryForm);
  };

  const resetProductEdit = () => {
    setEditingProductId(null);
    setProductForm(emptyProductForm);
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include', cache: 'no-store' });
    router.replace('/admin/login');
  };

  const menuItems = [
    { key: 'overview' as const, label: 'Dashboard', icon: LayoutDashboard },
    { key: 'categories' as const, label: 'Category CRUD', icon: Boxes },
    { key: 'products' as const, label: 'Product CRUD', icon: Package },
    { key: 'reviews' as const, label: 'Review CRUD', icon: MessageSquare },
  ];

  const kpiCards = [
    {
      title: 'Total Categories',
      value: categories.length,
      hint: 'Catalog structure',
      color: 'from-[var(--pp-800)] to-[var(--pp-700)]',
    },
    {
      title: 'Total Products',
      value: products.length,
      hint: 'Items published',
      color: 'from-[#2f5f7f] to-[#4f7d98]',
    },
    {
      title: 'Active Panel',
      value:
        activeSection === 'overview'
          ? 'Dashboard'
          : activeSection === 'categories'
            ? 'Categories'
            : activeSection === 'products'
              ? 'Products'
              : 'Reviews',
      hint: 'Current workspace',
      color: 'from-[#2e5d78] to-[#1f435c]',
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-(--pp-bg) pt-44 text-(--pp-text) md:pt-48 lg:pt-52">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(70,104,130,0.2),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(210,193,182,0.35),transparent_40%)]" />

      {(isLoading || saving) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b3c53]/20 backdrop-blur-[2px]">
          <div className="flex items-center gap-2 rounded-xl border border-[#1b3c53]/20 bg-white px-5 py-3 text-sm font-semibold text-[#1b3c53] shadow-xl">
            <Loader2 className="h-4 w-4 animate-spin" />
            {saving ? 'Saving changes...' : 'Loading admin data...'}
          </div>
        </div>
      )}

      <aside
        className={`fixed bottom-0 left-0 top-44 z-40 flex w-72 flex-col border-r border-[#1b3c53]/10 bg-white/95 p-4 shadow-xl backdrop-blur transition-transform duration-300  lg:translate-x-0 ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        } ${drawerCollapsed ? 'lg:w-24' : ''}`}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className={`overflow-hidden transition-all ${drawerCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
            <p className="text-xs uppercase tracking-[0.2em] text-[#456882]">Prime Prints</p>
            <h1 className="text-xl font-bold text-[#1b3c53]">Admin Panel</h1>
          </div>
          <button
            type="button"
            onClick={() => setDrawerCollapsed((value) => !value)}
            className="hidden rounded-lg border border-[#d2c1b6] p-2 text-[#1b3c53] lg:inline-flex"
            aria-label="Toggle drawer width"
          >
            <Menu className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="rounded-lg border border-[#d2c1b6] p-2 text-[#1b3c53] lg:hidden"
            aria-label="Close drawer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setActiveSection(item.key);
                  setDrawerOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                  active
                    ? 'bg-[#1b3c53] text-white shadow-lg shadow-[#1b3c53]/20'
                    : 'text-[#234c6a] hover:bg-[#f4efeb]'
                } ${drawerCollapsed ? 'lg:justify-center' : ''}`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className={`${drawerCollapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-4">
          <button
            type="button"
            onClick={() => void refresh()}
            className={`flex w-full items-center gap-3 rounded-xl border border-[#d2c1b6] px-3 py-3 text-sm font-medium text-[#234c6a] transition hover:bg-[#f4efeb] ${
              drawerCollapsed ? 'lg:justify-center' : ''
            }`}
          >
            <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className={`${drawerCollapsed ? 'lg:hidden' : ''}`}>Refresh Data</span>
          </button>
        </div>

        <div className="mt-auto rounded-2xl bg-linear-to-br from-[#1b3c53] to-[#456882] p-4 text-white">
          <p className={`text-xs ${drawerCollapsed ? 'lg:hidden' : ''}`}>Signed in as</p>
          <p className={`mt-1 truncate text-sm font-semibold ${drawerCollapsed ? 'lg:hidden' : ''}`}>{adminEmail}</p>
          <button
            type="button"
            onClick={logout}
            className={`mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-white/15 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/25 ${
              drawerCollapsed ? 'lg:px-2' : ''
            }`}
          >
            <LogOut className="h-4 w-4" />
            <span className={`${drawerCollapsed ? 'lg:hidden' : ''}`}>Logout</span>
          </button>
        </div>
      </aside>

      {drawerOpen ? (
        <button
          type="button"
          className="fixed inset-x-0 bottom-0 top-44 z-30 bg-[#1b3c53]/20 md:top-48 lg:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-label="Close menu overlay"
        />
      ) : null}

      <section className={`relative z-10 p-4 transition-all lg:p-8 ${drawerCollapsed ? 'lg:ml-24' : 'lg:ml-72'}`}>
        <header className="mb-6 rounded-3xl border border-[#1b3c53]/10 bg-white/90 px-4 py-4 shadow-sm backdrop-blur sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="rounded-lg border border-[#d2c1b6] p-2 text-[#1b3c53] lg:hidden"
                aria-label="Open drawer"
              >
                <Menu className="h-4 w-4" />
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#456882]">Admin Workspace</p>
                <h2 className="text-2xl font-bold text-[#1b3c53]">Admin Dashboard</h2>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-[#d2c1b6] bg-[#f4efeb] px-3 py-2 text-sm text-[#234c6a]">
              <Search className="h-4 w-4" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name or id"
                className="w-52 bg-transparent outline-none placeholder:text-[#456882]/70"
              />
            </div>
          </div>
        </header>

        {error ? <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        {queryError ? <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{queryError}</p> : null}
        {success ? <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p> : null}

        <div className="grid gap-4 md:grid-cols-3">
          {kpiCards.map((card) => (
            <article
              key={card.title}
              className={`rounded-2xl bg-linear-to-br ${card.color} p-4 text-white shadow-lg shadow-[#1b3c53]/10`}
            >
              <p className="text-sm text-white/80">{card.title}</p>
              <p className="mt-1 text-2xl font-black">{card.value}</p>
              <p className="mt-2 text-xs text-white/80">{card.hint}</p>
            </article>
          ))}
        </div>

        {activeSection === 'overview' ? (
          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            <section className="rounded-3xl border border-[#1b3c53]/10 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#1b3c53]">Recent Categories</h3>
                <button
                  type="button"
                  onClick={() => setActiveSection('categories')}
                  className="rounded-lg border border-[#d2c1b6] px-3 py-1.5 text-xs font-semibold text-[#234c6a]"
                >
                  Manage
                </button>
              </div>
              <div className="space-y-2">
                {filteredCategories.slice(0, 5).map((item) => (
                  <div key={item.id} className="rounded-xl border border-[#d2c1b6]/60 bg-[#f4efeb]/50 px-3 py-2">
                    <p className="font-semibold text-[#1b3c53]">{item.name}</p>
                    <p className="text-xs text-[#456882]">{item.id}</p>
                  </div>
                ))}
                {!filteredCategories.length ? <p className="text-sm text-[#456882]">No categories yet.</p> : null}
              </div>
            </section>

            <section className="rounded-3xl border border-[#1b3c53]/10 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#1b3c53]">Recent Products</h3>
                <button
                  type="button"
                  onClick={() => setActiveSection('products')}
                  className="rounded-lg border border-[#d2c1b6] px-3 py-1.5 text-xs font-semibold text-[#234c6a]"
                >
                  Manage
                </button>
              </div>
              <div className="space-y-2">
                {filteredProducts.slice(0, 5).map((item) => (
                  <div key={item.id} className="rounded-xl border border-[#d2c1b6]/60 bg-[#f4efeb]/50 px-3 py-2">
                    <p className="font-semibold text-[#1b3c53]">{item.name}</p>
                    <p className="text-xs text-[#456882]">{item.id}</p>
                  </div>
                ))}
                {!filteredProducts.length ? <p className="text-sm text-[#456882]">No products yet.</p> : null}
              </div>
            </section>

            <section className="rounded-3xl border border-[#1b3c53]/10 bg-white p-5 shadow-sm xl:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#1b3c53]">Recent Reviews</h3>
                <button
                  type="button"
                  onClick={() => setActiveSection('reviews')}
                  className="rounded-lg border border-[#d2c1b6] px-3 py-1.5 text-xs font-semibold text-[#234c6a]"
                >
                  Manage
                </button>
              </div>
              <div className="space-y-2">
                {filteredReviews.slice(0, 5).map((item) => (
                  <div key={item.id} className="rounded-xl border border-[#d2c1b6]/60 bg-[#f4efeb]/50 px-3 py-2">
                    <p className="font-semibold text-[#1b3c53]">{item.name}</p>
                    <p className="text-xs text-[#456882]">{item.email}</p>
                    <p className="text-xs text-[#234c6a]">Status: {item.status}</p>
                  </div>
                ))}
                {!filteredReviews.length ? <p className="text-sm text-[#456882]">No reviews yet.</p> : null}
              </div>
            </section>
          </div>
        ) : null}

        {activeSection === 'categories' ? (
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <form onSubmit={createCategory} className="rounded-3xl border border-[#1b3c53]/10 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#1b3c53]">
                  {editingCategoryId ? 'Update Category' : 'Create Category'}
                </h3>
                <div className="inline-flex items-center gap-2 rounded-lg bg-[#f4efeb] px-2 py-1 text-xs text-[#234c6a]">
                  <Boxes className="h-4 w-4" />
                  Category CRUD
                </div>
              </div>

              <div className="space-y-3">
                <input
                  required
                  value={categoryForm.name}
                  onChange={(event) => setCategoryForm((state) => ({ ...state, name: event.target.value }))}
                  placeholder="Category name"
                  className="w-full rounded-xl border border-[#d2c1b6] px-3 py-2 text-sm outline-none focus:border-[#234c6a]"
                />
                <input
                  required
                  value={categoryForm.imageUrl}
                  onChange={(event) => setCategoryForm((state) => ({ ...state, imageUrl: event.target.value }))}
                  placeholder="Category image URL"
                  className="w-full rounded-xl border border-[#d2c1b6] px-3 py-2 text-sm outline-none focus:border-[#234c6a]"
                />
                <select
                  value={categoryForm.parentId}
                  onChange={(event) => setCategoryForm((state) => ({ ...state, parentId: event.target.value }))}
                  className="w-full rounded-xl border border-[#d2c1b6] px-3 py-2 text-sm outline-none focus:border-[#234c6a]"
                >
                  <option value="">No parent category</option>
                  {categoryOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>

                <RichEditorField
                  label="Description"
                  value={categoryForm.description}
                  onChange={(value) => setCategoryForm((state) => ({ ...state, description: value }))}
                  minRows={8}
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1b3c53] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#234c6a]"
                >
                  {editingCategoryId ? <FilePenLine className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {editingCategoryId ? 'Update Category' : 'Create Category'}
                </button>
                {editingCategoryId ? (
                  <button
                    type="button"
                    onClick={resetCategoryEdit}
                    className="rounded-xl border border-[#d2c1b6] px-4 py-2 text-sm font-medium text-[#234c6a]"
                  >
                    Cancel Edit
                  </button>
                ) : null}
              </div>
            </form>

            <section className="rounded-3xl border border-[#1b3c53]/10 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-[#1b3c53]">Category List ({filteredCategories.length})</h3>
              <div className="space-y-3">
                {filteredCategories.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-[#d2c1b6]/70 bg-[#f4efeb]/50 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#1b3c53]">{item.name}</p>
                        <p className="text-xs text-[#456882]">{item.id}</p>
                        <p className="mt-1 text-xs text-[#234c6a]">
                          Parent: {item.parent_id ? categoryNameById.get(item.parent_id) || item.parent_id : 'None'}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={busyCategoryId === item.id}
                          onClick={() => startEditCategory(item)}
                          className="rounded-lg border border-[#234c6a]/30 p-2 text-[#234c6a] disabled:opacity-50"
                          aria-label={`Edit ${item.name}`}
                        >
                          <FilePenLine className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          disabled={busyCategoryId === item.id}
                          onClick={() => void removeCategory(item.id)}
                          className="rounded-lg border border-red-300 p-2 text-red-700 disabled:opacity-50"
                          aria-label={`Delete ${item.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {busyCategoryId === item.id ? <p className="mt-1 text-xs text-[#456882]">Working...</p> : null}
                  </article>
                ))}
                {!filteredCategories.length ? <p className="text-sm text-[#456882]">No categories match your search.</p> : null}
              </div>
            </section>
          </div>
        ) : null}

        {activeSection === 'products' ? (
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <form onSubmit={createProduct} className="rounded-3xl border border-[#1b3c53]/10 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#1b3c53]">
                  {editingProductId ? 'Update Product' : 'Create Product'}
                </h3>
                <div className="inline-flex items-center gap-2 rounded-lg bg-[#f4efeb] px-2 py-1 text-xs text-[#234c6a]">
                  <Package className="h-4 w-4" />
                  Product CRUD
                </div>
              </div>

              <div className="space-y-3">
                <input
                  required
                  value={productForm.name}
                  onChange={(event) => setProductForm((state) => ({ ...state, name: event.target.value }))}
                  placeholder="Product name"
                  className="w-full rounded-xl border border-[#d2c1b6] px-3 py-2 text-sm outline-none focus:border-[#234c6a]"
                />
                <input
                  value={productForm.badges}
                  onChange={(event) => setProductForm((state) => ({ ...state, badges: event.target.value }))}
                  placeholder="Badges (comma separated)"
                  className="w-full rounded-xl border border-[#d2c1b6] px-3 py-2 text-sm outline-none focus:border-[#234c6a]"
                />
                <div className="space-y-2 rounded-xl border border-[#d2c1b6] p-3">
                  <p className="text-xs font-semibold text-[#1b3c53]">Select Categories:</p>
                  <div className="space-y-2">
                    {categoryOptions.length > 0 ? (
                      categoryOptions.map((category) => (
                        <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={productForm.categoryIds.includes(category.id)}
                            onChange={(e) => {
                              const newIds = e.target.checked
                                ? [...productForm.categoryIds, category.id]
                                : productForm.categoryIds.filter((id) => id !== category.id);
                              setProductForm((state) => ({ ...state, categoryIds: newIds }));
                            }}
                            className="rounded cursor-pointer"
                          />
                          <span className="text-sm text-[#234c6a]">{category.name}</span>
                        </label>
                      ))
                    ) : (
                      <p className="text-xs text-[#456882]">No categories available</p>
                    )}
                  </div>
                </div>
                <textarea
                  rows={4}
                  value={productForm.imageUrls}
                  onChange={(event) => setProductForm((state) => ({ ...state, imageUrls: event.target.value }))}
                  placeholder="Image URLs (one per line)"
                  className="w-full rounded-xl border border-[#d2c1b6] px-3 py-2 text-sm outline-none focus:border-[#234c6a]"
                />

                <RichEditorField
                  label="Short Description"
                  value={productForm.shortDescription}
                  onChange={(value) => setProductForm((state) => ({ ...state, shortDescription: value }))}
                  minRows={6}
                />
                <RichEditorField
                  label="Description"
                  value={productForm.description}
                  onChange={(value) => setProductForm((state) => ({ ...state, description: value }))}
                  minRows={8}
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1b3c53] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#234c6a]"
                >
                  {editingProductId ? <FilePenLine className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {editingProductId ? 'Update Product' : 'Create Product'}
                </button>
                {editingProductId ? (
                  <button
                    type="button"
                    onClick={resetProductEdit}
                    className="rounded-xl border border-[#d2c1b6] px-4 py-2 text-sm font-medium text-[#234c6a]"
                  >
                    Cancel Edit
                  </button>
                ) : null}
              </div>
            </form>

            <section className="rounded-3xl border border-[#1b3c53]/10 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-[#1b3c53]">Product List ({filteredProducts.length})</h3>
              <div className="space-y-3">
                {filteredProducts.map((item) => {
                  const categoryNames = parseJsonArray(item.category_id)
                    .map((id) => categoryNameById.get(id) || id)
                    .join(', ');
                  const badges = parseJsonArray(item.badges).join(', ');

                  return (
                    <article key={item.id} className="rounded-2xl border border-[#d2c1b6]/70 bg-[#f4efeb]/50 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[#1b3c53]">{item.name}</p>
                          <p className="text-xs text-[#456882]">{item.id}</p>
                          <p className="mt-1 text-xs text-[#234c6a]">Categories: {categoryNames || 'None'}</p>
                          <p className="mt-1 text-xs text-[#234c6a]">Badges: {badges || 'None'}</p>
                          <p className="mt-1 text-xs text-[#456882]">{getTextFromTiptapJson(item.short_description) || 'No short description.'}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={busyProductId === item.id}
                            onClick={() => startEditProduct(item)}
                            className="rounded-lg border border-[#234c6a]/30 p-2 text-[#234c6a] disabled:opacity-50"
                            aria-label={`Edit ${item.name}`}
                          >
                            <FilePenLine className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            disabled={busyProductId === item.id}
                            onClick={() => void removeProduct(item.id)}
                            className="rounded-lg border border-red-300 p-2 text-red-700 disabled:opacity-50"
                            aria-label={`Delete ${item.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {busyProductId === item.id ? <p className="mt-1 text-xs text-[#456882]">Working...</p> : null}
                    </article>
                  );
                })}
                {!filteredProducts.length ? <p className="text-sm text-[#456882]">No products match your search.</p> : null}
              </div>
            </section>
          </div>
        ) : null}

        {activeSection === 'reviews' ? (
          <ReviewManager
            reviews={reviews}
            searchTerm={searchTerm}
            onRefresh={refresh}
            setError={setError}
            setSuccess={setSuccess}
            setSaving={setSaving}
          />
        ) : null}
      </section>
    </main>
  );
}
