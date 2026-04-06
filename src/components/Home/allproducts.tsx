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
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-white font-['DM_Sans',sans-serif]">
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;700&display=swap');
        .serif-title { font-family: 'Playfair Display', serif; }
      `}</style>

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-24 pb-20 px-4 md:px-8 lg:px-16">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{backgroundImage: 'linear-gradient(90deg, white 1px, transparent 1px), linear-gradient(white 1px, transparent 1px)', backgroundSize: '40px 40px'}}>
        </div>
        {/* Accent glow */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-0" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-8">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full" />
                <p className="text-cyan-400 uppercase tracking-[0.2em] text-xs font-600">
                  Professional Print Solutions
                </p>
              </div>
              <h1 className="serif-title text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-6 text-white">
                Our<br />
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Products</span>
              </h1>
              <p className="text-slate-300 text-base max-w-md leading-relaxed">
                Premium printing solutions crafted for businesses that demand excellence and precision.
              </p>
            </div>
            {/* <div className="text-right self-end">
              <p className="text-slate-400 text-sm uppercase tracking-widest font-500 mb-2">Available Products</p>
              <p className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{products.length}</p>
            </div> */}
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-500 transition-all duration-300 border ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-transparent shadow-lg shadow-cyan-500/30'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-cyan-300 hover:text-cyan-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16">
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

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between">
                    {/* <div>
                      <p className="text-3xl font-black bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">${product.price}</p>
                      <p className="text-xs uppercase tracking-widest text-slate-500 font-500">per 100 units</p>
                    </div> */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => { e.preventDefault(); }}
                        className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-3 rounded-lg hover:shadow-lg hover:shadow-slate-900/50 transition-all duration-200 hover:scale-110"
                        aria-label="Add to cart"
                      >
                        <ShoppingCart size={18} />
                      </button>
                      <span className="text-cyan-600 font-600 text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        View <ArrowRight size={16} />
                      </span>
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