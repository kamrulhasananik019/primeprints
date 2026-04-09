'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  ArrowRight,
  ChevronDown,
  Menu,
  Search,
  Mail,
  Phone,
  X,
} from 'lucide-react';
import { categories } from '@/utils/data';

function chunkProducts<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [mobileActiveSlug, setMobileActiveSlug] = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = oldOverflow;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const openMegaMenu = (slug: string) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setActiveSlug(slug);
  };

  const scheduleCloseMegaMenu = () => {
    closeTimerRef.current = setTimeout(() => {
      setActiveSlug(null);
    }, 160);
  };

  const activeCategory = useMemo(
    () => categories.find((cat) => cat.slug === activeSlug) ?? null,
    [activeSlug]
  );

  const searchResults = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return [];
    const results: Array<{ label: string; href: string; type: 'category' | 'product' }> = [];

    for (const category of categories) {
      if (category.title.toLowerCase().includes(text)) {
        results.push({
          label: category.title,
          href: `/categories/${category.slug}`,
          type: 'category',
        });
      }

      for (const product of category.products) {
        if (product.name.toLowerCase().includes(text)) {
          results.push({
            label: product.name,
            href: `/products/${product.slug}`,
            type: 'product',
          });
        }
      }
    }

    return results.slice(0, 8);
  }, [query]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const first = searchResults[0];
    if (first) {
      router.push(first.href);
      setQuery('');
      setSearchFocused(false);
    }
  };

  return (
    <div className="sticky top-0 z-50">
      <div className="hidden border-b border-stone-200 bg-stone-100 py-2 lg:block">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-6 text-[12px] text-stone-600">
          <a href="mailto:order@primeprint.com" className="inline-flex items-center gap-1.5 transition hover:text-stone-900">
            <Mail className="h-3.5 w-3.5" /> order@primeprint.com
          </a>
          <a href="tel:+44205550147" className="inline-flex items-center gap-1.5 transition hover:text-stone-900">
            <Phone className="h-3.5 w-3.5" /> +44 (20) 555-0147
          </a>
        </div>
      </div>

      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-4 lg:gap-8 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              className="p-2 text-stone-700 lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 -rotate-12 items-center justify-center rounded-sm bg-blue-600 text-white">
                <span className="text-sm font-bold italic">P</span>
              </div>
              <span className="text-2xl font-bold tracking-tighter text-stone-900">primeprint</span>
            </Link>
          </div>

          <div className={`relative hidden max-w-2xl flex-1 transition-all duration-300 md:flex ${searchFocused ? 'scale-[1.01]' : ''}`}>
            <form onSubmit={handleSearchSubmit} className="w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for business cards, banners, and more..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 120)}
                className="w-full rounded-full border border-stone-300 py-2.5 pl-5 pr-12 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-stone-500 hover:text-blue-600" aria-label="Search">
                <Search className="h-5 w-5" />
              </button>
            </form>
            {searchFocused && query.trim() && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-xl border border-stone-200 bg-white p-2 shadow-xl">
                {searchResults.length > 0 ? (
                  searchResults.map((result) => (
                    <button
                      key={`${result.type}-${result.href}`}
                      type="button"
                      onMouseDown={() => {
                        router.push(result.href);
                        setQuery('');
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-stone-100"
                    >
                      <span className="text-stone-700">{result.label}</span>
                      <span className="text-[11px] uppercase tracking-[0.12em] text-stone-400">{result.type}</span>
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-2 text-sm text-stone-500">No matching products or categories.</p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-stone-700 sm:gap-2">
            <Link
              href="/"
              className={`rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-stone-100 ${
                pathname === '/' ? 'text-blue-700' : 'text-stone-700'
              }`}
            >
              Home
            </Link>
            <Link
              href="/contact"
              className={`rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-stone-100 ${
                pathname?.startsWith('/contact') ? 'text-blue-700' : 'text-stone-700'
              }`}
            >
              Contact Us
            </Link>
          </div>
        </div>

        <nav className="relative hidden border-t border-stone-200 lg:block" onMouseLeave={scheduleCloseMegaMenu}>
          <div className="mx-auto max-w-[1440px] px-6">
            <ul className="flex items-center gap-1">
              {categories.map((cat) => (
                <li key={cat.id} className="relative" onMouseEnter={() => openMegaMenu(cat.slug)}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className={`inline-block border-b-2 px-3 py-3 text-[13px] font-medium transition-colors hover:text-blue-600 ${
                      activeSlug === cat.slug || pathname === `/categories/${cat.slug}`
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-stone-700'
                    }`}
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`absolute left-0 right-0 top-full border-t border-stone-200 bg-white shadow-2xl transition-all duration-300 origin-top ${
              activeCategory ? 'visible scale-y-100 opacity-100' : 'invisible scale-y-95 opacity-0'
            }`}
            onMouseEnter={() => {
              if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
            }}
          >
            <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-8 px-8 py-10">
              <div className="col-span-9 grid grid-cols-3 gap-8">
                {chunkProducts(activeCategory?.products ?? [], 7).map((section, idx) => (
                  <div key={`${activeCategory?.slug ?? 'cat'}-${idx}`} className="space-y-4">
                    <h3 className="border-b border-stone-100 pb-2 text-sm font-bold text-stone-900">
                      {idx === 0 ? activeCategory?.title : `${activeCategory?.title} More`}
                    </h3>
                    <ul className="space-y-2">
                      {section.map((product) => (
                        <li key={product.id}>
                          <Link
                            href={`/products/${product.slug}`}
                            className="block py-0.5 text-[13px] text-stone-600 transition-colors hover:text-blue-600 hover:underline"
                          >
                            {product.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="col-span-3 border-l border-stone-100 pl-8">
                <Link href={activeCategory ? `/categories/${activeCategory.slug}` : '/'} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-stone-100">
                    {activeCategory && (
                      <img
                        src={activeCategory.image}
                        alt={activeCategory.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute left-3 top-3 rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      {activeCategory?.tag ?? 'Featured'}
                    </div>
                  </div>
                  <h4 className="mt-4 font-bold text-stone-900">{activeCategory?.title} Services</h4>
                  <p className="mt-1 text-xs leading-relaxed text-stone-500">{activeCategory?.description}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-[13px] font-bold text-blue-600 transition-all group-hover:gap-3">
                    Explore all <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`absolute bottom-0 left-0 top-0 w-[85%] max-w-sm transform bg-white shadow-2xl transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b p-4">
            <span className="text-xl font-bold">Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="rounded-full p-2 hover:bg-stone-100" aria-label="Close menu">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="border-b p-4">
            <div className="relative">
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-lg bg-stone-100 py-2 pl-10 pr-4 text-sm focus:outline-none"
                />
              </form>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            </div>
          </div>

          <nav className="h-[calc(100vh-140px)] overflow-y-auto">
            <ul className="py-2">
              {categories.map((cat) => (
                <li key={cat.id} className="border-b border-stone-50">
                  <button
                    className="flex w-full items-center justify-between px-6 py-4 font-medium text-stone-700 hover:bg-stone-50"
                    onClick={() => setMobileActiveSlug((prev) => (prev === cat.slug ? null : cat.slug))}
                  >
                    <span>{cat.title}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${mobileActiveSlug === cat.slug ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileActiveSlug === cat.slug && (
                    <div className="space-y-2 bg-stone-50/60 px-6 pb-4">
                      <Link
                        href={`/categories/${cat.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-1 text-sm font-semibold text-blue-700"
                      >
                        View all {cat.title}
                      </Link>
                      {cat.products.slice(0, 8).map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-1 text-sm text-stone-600"
                        >
                          {product.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
              <li>
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-4 font-bold text-stone-700 hover:bg-stone-50">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-4 font-bold text-blue-600 hover:bg-stone-50">
                  Contact Us
                </Link>
              </li>
            </ul>

            <div className="mt-4 space-y-4 border-t border-stone-100 px-6 pt-4 pb-6">
              <a href="mailto:order@primeprint.com" className="flex items-center gap-3 text-sm text-stone-600">
                <Mail className="h-4 w-4" /> order@primeprint.com
              </a>
              <a href="tel:+44205550147" className="flex items-center gap-3 text-sm text-stone-600">
                <Phone className="h-4 w-4" /> +44 (20) 555-0147
              </a>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
