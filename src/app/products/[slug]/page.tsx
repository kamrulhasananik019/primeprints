'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { categories, getRelatedProducts, getPrimaryImage } from '@/utils/data';
import { ShoppingCart, Heart, ArrowLeft, Check, Clock, Package, Layers, Ruler, Star } from 'lucide-react';

export default function ProductDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Find the product across all categories
  let product = null;
  let category = null;
  for (const cat of categories) {
    const found = cat.products.find(p => p.slug === slug);
    if (found) {
      product = found;
      category = cat;
      break;
    }
  }

  // Get related products from the same category
  const related = product ? getRelatedProducts(product.id) : [];

  if (!product || !category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white px-4">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;600;700&display=swap');`}</style>
        <p className="text-6xl mb-6">🖨️</p>
        <h1 className="font-['Playfair_Display',serif] text-4xl font-black text-slate-900 mb-3">Product Not Found</h1>
        <p className="text-slate-500 mb-8">The product you're looking for doesn't exist.</p>
        <Link href="/" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all font-600">
          Back to Products
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  const specIcons: Record<string, React.ReactNode> = {
    material: <Layers size={16} />,
    size: <Ruler size={16} />,
    finish: <Package size={16} />,
    turnaround: <Clock size={16} />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        .serif { font-family: 'Playfair Display', serif; }
        .sans { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Top Nav Bar */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4 flex items-center justify-between">
          <Link
            href={`/categories/${category.slug}`}
            className="sans flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors text-sm font-500"
          >
            <ArrowLeft size={18} />
            Back to {category.title}
          </Link>
          <span className="bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1.5 rounded-lg text-xs font-600 uppercase tracking-wider">{category.title}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* ── Image Panel ── */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 aspect-square shadow-2xl border border-slate-200">
              <img
                src={getPrimaryImage(product)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />

              {/* Favorite Button */}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-lg hover:scale-110 transition-transform hover:bg-white"
                aria-label="Toggle favorite"
              >
                <Heart
                  size={22}
                  className={isFavorite ? 'fill-cyan-500 text-cyan-500' : 'text-slate-400'}
                />
              </button>

              {/* Rating Badge */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-600 text-slate-800">4.9</span>
              </div>
            </div>

            {/* Decorative accent */}
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl -z-10" />
          </div>

          {/* ── Details Panel ── */}
          <div className="flex flex-col justify-between gap-10">

            {/* Product Info */}
            <div>
              <p className="sans text-cyan-600 uppercase tracking-[0.2em] text-xs font-700 mb-4">
                {category.title}
              </p>
              <h1 className="serif text-5xl md:text-6xl font-black text-slate-900 leading-tight mb-6">
                {product.name}
              </h1>
              <p className="sans text-slate-600 text-lg leading-relaxed mb-8">
                {product.details || product.description}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-white border border-slate-200 rounded-xl p-4 hover:border-cyan-400/50 hover:shadow-lg transition-all hover:bg-gradient-to-br hover:from-cyan-50/50 hover:to-blue-50/50"
                  >
                    <div className="sans flex items-center gap-2 text-slate-500 text-xs uppercase tracking-widest font-600 mb-2">
                      <span className="text-cyan-600">{specIcons[key]}</span>
                      {key}
                    </div>
                    <p className="sans text-slate-900 text-sm font-600">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Purchase Section */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-cyan-500/25"
                >
                  {isAdded ? <Check size={18} /> : <ShoppingCart size={18} />}
                  {isAdded ? 'Added to cart' : 'Add to cart'}
                </button>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
                >
                  <Heart size={16} className={isFavorite ? 'fill-cyan-500 text-cyan-500' : ''} />
                  {isFavorite ? 'Saved' : 'Save'}
                </button>
              </div>
              <p className="mt-4 text-sm text-slate-500">
                Need a custom quantity or finish? Contact us for same-day options and bespoke pricing.
              </p>
            </div>
          </div>
        </div>

        {/* ── Related Products ── */}
        <div className="mt-24 pt-16 border-t border-slate-200">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="serif text-3xl font-black text-slate-900">You Might Also Like</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((rel) => (
              <Link key={rel.id} href={`/products/${rel.slug}`} className="group block">
                <div className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-2 transition-all duration-300">
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                    <img
                      src={getPrimaryImage(rel)}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <span className="sans absolute top-3 right-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-600 uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-lg">
                      {category.title}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="serif font-bold text-slate-900 group-hover:text-transparent bg-gradient-to-r from-slate-900 to-cyan-600 group-hover:bg-clip-text transition-all text-lg leading-tight mb-2">
                      {rel.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="sans text-xs text-slate-500 font-500">
                        {Object.values(rel.specs)[0] || 'Custom options available'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}