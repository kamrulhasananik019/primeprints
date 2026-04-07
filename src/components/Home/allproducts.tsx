'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { products } from '@/utils/products';
import { ShoppingCart, ArrowRight, Star } from 'lucide-react';

const CATEGORIES = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

export default function AllProducts() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory);

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
          {filtered.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`} className="group block">
              <article className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-cyan-400/50 shadow-sm hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">

                {/* Image Container */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 transition-opacity duration-300" />

                  {/* Category Badge */}
                  <span className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-600 uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-lg">
                    {product.category}
                  </span>

                  {/* Rating */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs font-600 text-slate-700 ml-1">4.9</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="serif-title text-xl font-bold text-slate-900 mb-2   transition-all">
                    {product.name}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                    {product.description}
                  </p>

                  {/* Specs Preview */}
                  <div className="grid grid-cols-2 gap-3 mb-6 pb-6 border-t border-slate-200">
                    <div className="pt-4">
                      <p className="text-xs uppercase tracking-widest text-slate-500 font-600 mb-1">Size</p>
                      <p className="text-sm font-600 text-slate-800">{product.specs.size}</p>
                    </div>
                    <div className="pt-4">
                      <p className="text-xs uppercase tracking-widest text-slate-500 font-600 mb-1">Turnaround</p>
                      <p className="text-sm font-600 text-slate-800">{product.specs.turnaround}</p>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
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