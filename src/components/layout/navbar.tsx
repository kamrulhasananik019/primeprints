'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Mail,
  Menu,
  Phone,
  Search,
  X,
} from 'lucide-react';
import { categories } from '@/utils/data';

function chunkProducts<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  if (!items?.length) return chunks;
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
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
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollContainerRef = useRef<HTMLUListElement | null>(null);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 20);
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 20);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

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

  const scrollCategories = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const amount = direction === 'left' ? -260 : 260;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

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
        results.push({ label: category.title, href: `/categories/${category.slug}`, type: 'category' });
      }
      for (const product of category.products) {
        if (product.name.toLowerCase().includes(text)) {
          results.push({ label: product.name, href: `/products/${product.slug}`, type: 'product' });
        }
      }
    }
    return results.slice(0, 8);
  }, [query]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const first = searchResults[0];
    if (!first) return;
    router.push(first.href);
    setQuery('');
    setSearchFocused(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="sticky top-0 z-50 bg-white">
      <div className="hidden border-b border-stone-200 bg-stone-50 py-2 lg:block">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-6 text-[11px] font-medium uppercase tracking-wider text-stone-500">
          <div className="flex flex-wrap gap-6">
            <a href="mailto:order@primeprint.com" className="inline-flex items-center gap-1.5 transition hover:text-blue-600">
              <Mail className="h-3.5 w-3.5" /> order@primeprint.com
            </a>
            <a href="tel:+44205550147" className="inline-flex items-center gap-1.5 transition hover:text-blue-600">
              <Phone className="h-3.5 w-3.5" /> +44 (20) 555-0147
            </a>
          </div>
          <div className="font-bold text-green-600">● Same Day Printing Available</div>
        </div>
      </div>

      <header className="relative shadow-sm">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-4 lg:gap-8 lg:px-6">
          <div className="flex items-center gap-4">
            <button className="p-2 text-stone-700 lg:hidden" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 -rotate-12 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-200">
                <span className="text-xl font-black italic">P</span>
              </div>
              <span className="text-2xl font-black tracking-tighter text-stone-900">primeprint</span>
            </Link>
          </div>

          <div className={`relative hidden max-w-2xl flex-1 transition-all duration-300 md:flex ${searchFocused ? 'z-[110]' : 'z-10'}`}>
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search 1,000+ products..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-12 pr-6 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                />
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
              </div>
            </form>

            {searchFocused && query.trim() && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[150] overflow-hidden rounded-xl border border-stone-200 bg-white p-1 shadow-2xl ring-1 ring-black/5">
                {searchResults.length > 0 ? (
                  <div className="flex flex-col">
                    {searchResults.map((result) => (
                      <button
                        key={`${result.type}-${result.href}`}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          router.push(result.href);
                          setQuery('');
                          setSearchFocused(false);
                        }}
                        className="group flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm transition-colors hover:bg-blue-50"
                      >
                        <span className="font-semibold text-stone-700 group-hover:text-blue-700">{result.label}</span>
                        <span className="rounded bg-stone-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-stone-400 group-hover:bg-blue-100 group-hover:text-blue-600">
                          {result.type}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm italic text-stone-500">No matches for "{query}"</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-stone-800 sm:gap-2">
            <Link
              href="/"
              className={`hidden rounded-lg px-3 py-2 text-sm font-bold transition sm:block hover:bg-stone-100 ${
                pathname === '/' ? 'text-blue-700' : 'text-stone-800'
              }`}
            >
              Home
            </Link>
            <Link href="/contact" className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-600">
              Contact Us
            </Link>
          </div>
        </div>

        <nav className="relative hidden border-t border-stone-100 lg:block" onMouseLeave={scheduleCloseMegaMenu}>
          <div className="relative mx-auto max-w-[1440px] px-6">
            {showLeftArrow && (
              <div className="pointer-events-none absolute bottom-0 left-6 top-0 z-10 flex items-center pr-10 bg-gradient-to-r from-white via-white to-transparent">
                <button
                  onClick={() => scrollCategories('left')}
                  className="pointer-events-auto rounded-full border border-stone-200 bg-white p-1 shadow-sm hover:bg-blue-50 hover:text-blue-600"
                  aria-label="Scroll categories left"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            )}
            {showRightArrow && (
              <div className="pointer-events-none absolute bottom-0 right-6 top-0 z-10 flex items-center pl-10 bg-gradient-to-l from-white via-white to-transparent">
                <button
                  onClick={() => scrollCategories('right')}
                  className="pointer-events-auto rounded-full border border-stone-200 bg-white p-1 shadow-sm hover:bg-blue-50 hover:text-blue-600"
                  aria-label="Scroll categories right"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            <ul
              ref={scrollContainerRef}
              onScroll={checkScroll}
              className="no-scrollbar flex items-center gap-2 overflow-x-auto py-1 scroll-smooth"
              style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
            >
              {categories.map((cat) => (
                <li key={cat.id} className="relative flex-shrink-0" onMouseEnter={() => openMegaMenu(cat.slug)}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className={`inline-block whitespace-nowrap rounded-md px-4 py-3 text-[13px] font-bold transition-all ${
                      activeSlug === cat.slug || pathname === `/categories/${cat.slug}`
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`absolute left-0 right-0 top-full z-40 border-t border-stone-200 bg-white shadow-2xl transition-all duration-300 origin-top ${
              activeCategory ? 'visible scale-y-100 opacity-100' : 'invisible scale-y-95 opacity-0'
            }`}
            onMouseEnter={() => {
              if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
            }}
          >
            <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-8 px-10 py-12">
              <div className="col-span-9 grid grid-cols-3 gap-10">
                {chunkProducts(activeCategory?.products ?? [], 7).map((section, idx) => (
                  <div key={`${activeCategory?.slug ?? 'category'}-${idx}`} className="space-y-5">
                    <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                      <span className="h-1 w-1 rounded-full bg-blue-500"></span>
                      {idx === 0 ? 'Top Choices' : 'Extended Range'}
                    </h3>
                    <ul className="space-y-3">
                      {section.map((product) => (
                        <li key={product.id}>
                          <Link
                            href={`/products/${product.slug}`}
                            className="group/item flex items-center justify-between py-0.5 text-[14px] font-medium text-stone-600 transition hover:text-blue-600"
                          >
                            <span>{product.name}</span>
                            <ArrowRight className="h-3 w-3 -translate-x-2 opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="col-span-3 border-l border-stone-100 pl-10">
                <Link href={activeCategory ? `/categories/${activeCategory.slug}` : '/'} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-stone-100 shadow-inner">
                    {activeCategory && (
                      <img
                        src={activeCategory.image}
                        alt={activeCategory.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <div className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                        {activeCategory?.tag}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h4 className="text-lg font-black text-stone-900">{activeCategory?.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-stone-500">{activeCategory?.description}</p>
                    <div className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-stone-50 py-3 text-sm font-bold text-stone-900 transition group-hover:bg-blue-600 group-hover:text-white">
                      Explore All <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-[200] bg-stone-900/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`absolute bottom-0 left-0 top-0 w-[85%] max-w-sm transform bg-white shadow-2xl transition-transform duration-500 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b p-5">
            <span className="text-xl font-black italic tracking-tighter text-blue-600">primeprint</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="rounded-full p-2 hover:bg-stone-100" aria-label="Close menu">
              <X className="h-6 w-6 text-stone-400" />
            </button>
          </div>

          <div className="p-4">
            <div className="relative">
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-xl bg-stone-100 py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </form>
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            </div>
          </div>

          <nav className="no-scrollbar h-[calc(100vh-160px)] overflow-y-auto px-2">
            <ul className="space-y-1 pb-10">
              {categories.map((cat) => (
                <li key={cat.id} className="overflow-hidden rounded-xl">
                  <button
                    className={`flex w-full items-center justify-between px-4 py-4 font-bold text-stone-700 transition ${
                      mobileActiveSlug === cat.slug ? 'bg-blue-50 text-blue-600' : 'hover:bg-stone-50'
                    }`}
                    onClick={() => setMobileActiveSlug((prev) => (prev === cat.slug ? null : cat.slug))}
                  >
                    <span>{cat.title}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${mobileActiveSlug === cat.slug ? 'rotate-180' : ''}`} />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      mobileActiveSlug === cat.slug ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden bg-stone-50/50">
                      <div className="grid grid-cols-1 gap-2 p-4">
                        {cat.products.map((product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.slug}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-white hover:text-blue-600"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-stone-300"></span>
                            {product.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              <li className="mt-4 border-t border-stone-100 px-4 pt-4">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="mb-3 block rounded-xl border border-stone-200 p-3 text-center font-bold text-stone-700">
                  Home
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-stone-900 p-4 text-center font-bold text-white shadow-lg"
                >
                  Contact Us <ArrowRight className="h-4 w-4" />
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
