'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getLatestProducts, categories, getPrimaryImage } from '@/utils/data';

const allProducts = getLatestProducts();
const CATEGORIES = ['All', ...Array.from(new Set(categories.map((c) => c.title)))];

export default function AllProducts() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? allProducts
      : allProducts.filter((p) => {
          const category = categories.find(cat => cat.products.some(prod => prod.id === p.id));
          return category?.title === activeCategory;
        });

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-white font-['DM_Sans',sans-serif] pt-10 container mx-auto">
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;700&display=swap');
        .serif-title { font-family: 'Playfair Display', serif; }
      `}</style>


   <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className='mx-auto container'>
            <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">
              OProfessional Print
            </span>

            <h2 className="font-serif text-3xl font-bold leading-tight text-stone-900 sm:text-4xl lg:text-5xl">
              Explore all Our Products

            </h2>
          </div>
        </div>

      {/* Products Grid */}
      <div className=" py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => {
            const categoryTitle = categories.find((cat) => cat.products.some((prod) => prod.id === product.id))?.title;

            return (
              <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                <article className="overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-3xl bg-stone-200">
                    <img
                      src={getPrimaryImage(product)}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />

                    <div className="absolute left-4 top-4 rounded-full bg-emerald-500/95 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white backdrop-blur">
                      Latest
                    </div>

                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/10 to-transparent p-5 opacity-0 transition duration-300 group-hover:opacity-100">
                      <span className="flex items-center gap-1 text-sm font-medium text-white">
                        View Details
                      </span>
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    <h3 className="font-serif text-lg font-semibold text-stone-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-xs uppercase tracking-[0.18em] text-stone-400 font-medium">
                      {categoryTitle}
                    </p>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">🖨️</p>
            <p className="text-slate-400 text-lg">No products in this category yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}