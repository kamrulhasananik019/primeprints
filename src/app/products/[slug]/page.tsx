'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { categories, getRelatedProducts, getPrimaryImage } from '@/utils/data';
import { Heart, ArrowLeft, Clock, Package, Layers, Ruler, Star } from 'lucide-react';
import InfiniteMarquee from '@/components/shared/infinite-marquee';

export default function ProductDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
  const otherCategoryProducts = product
    ? categories
        .filter((cat) => cat.id !== category?.id)
        .flatMap((cat) =>
          cat.products.slice(0, 2).map((item) => ({
            ...item,
            categoryTitle: cat.title,
          }))
        )
        .slice(0, 6)
    : [];

  if (!product || !category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white px-4">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;600;700&display=swap');`}</style>
        <p className="text-6xl mb-6">🖨️</p>
        <h1 className="font-['Playfair_Display',serif] text-4xl font-black text-slate-900 mb-3">Product Not Found</h1>
        <p className="text-slate-500 mb-8">The product you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="px-8 py-3 rounded-lg  font-600">
          Back to Products
        </Link>
      </div>
    );
  }

  const specIcons: Record<string, React.ReactNode> = {
    material: <Layers size={16} />,
    size: <Ruler size={16} />,
    finish: <Package size={16} />,
    turnaround: <Clock size={16} />,
  };

  const primaryImage = getPrimaryImage(product) || category.image;
  const relatedImages = related
    .map((item) => getPrimaryImage(item))
    .filter(Boolean);
  const galleryImages = Array.from(
    new Set([primaryImage, ...product.images.map((img) => img.url), ...relatedImages])
  )
    .filter(Boolean)
    .slice(0, 6);
  const activeImage = galleryImages[selectedImageIndex] || primaryImage;
  const categoryTitles = categories.map((cat) => cat.title);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        .serif { font-family: 'Playfair Display', serif; }
        .sans { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Top Nav Bar */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white sticky top-0 z-20 shadow-md">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-4 flex items-center justify-between">
          <Link
            href={`/categories/${category.slug}`}
            className="sans flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors text-sm font-500"
          >
            <ArrowLeft size={18} />
            Back to {category.title}
          </Link>
          <span className=" px-3 py-1.5 rounded-lg text-xs font-600 uppercase tracking-wider">{category.title}</span>
        </div>
      </div>

  

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* ── Image Panel ── */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 aspect-square shadow-2xl border border-slate-200">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />

              {/* Favorite Button */}
              {/* <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-lg hover:scale-110 transition-transform hover:bg-white"
                aria-label="Toggle favorite"
              >
                <Heart
                  size={22}
                  className={isFavorite ? 'fill-cyan-500 text-cyan-500' : 'text-slate-400'}
                />
              </button> */}

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

            {galleryImages.length > 1 && (
              <div className="mt-5 grid grid-cols-4 sm:grid-cols-6 gap-3">
                {galleryImages.map((img, index) => (
                  <button
                    key={`${img}-${index}`}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square overflow-hidden rounded-xl border transition ${
                      selectedImageIndex === index
                        ? 'border-cyan-500 ring-2 ring-cyan-300/60'
                        : 'border-slate-200 hover:border-cyan-400/60'
                    }`}
                    aria-label={`View product image ${index + 1}`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

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

              <div>
                <Link
                  href={`/contact?category=${category.slug}&product=${product.slug}`}
                  className="sans inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-700 text-white transition hover:bg-slate-800"
                >
                  Get Quote
                </Link>
              </div>
            </div>

          </div>
        </div>
    <InfiniteMarquee bottomItems={categoryTitles} />
        {/* ── Related Products ── */}
        {related.length > 0 && (
          <div className="mt-24 pt-16 border-t border-slate-200">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="serif text-3xl font-black text-slate-900">You Might Also Like</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link key={rel.id} href={`/products/${rel.slug}`} className="group block">
                  <div className="group cursor-pointer">
                    <div className="relative mb-4 aspect-square overflow-hidden rounded-3xl bg-stone-200">
                      <img
                        src={getPrimaryImage(rel) || category.image}
                        alt={rel.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                      <span className="sans absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-stone-700 backdrop-blur">
                        {category.title}
                      </span>
                    </div>
                    <h3 className="serif text-xl font-bold text-stone-900 leading-tight transition-colors group-hover:text-stone-700">
                      {rel.name}
                    </h3>
                    <p className="sans mt-1 text-sm text-stone-600 line-clamp-2">
                      {rel.description}
                    </p>
                    <span className="sans mt-2 block text-xs text-stone-500 font-500">
                      {Object.values(rel.specs)[0] || 'Custom options available'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Other Category Products ── */}
        {otherCategoryProducts.length > 0 && (
          <div className="mt-20 pt-16 border-t border-slate-200">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-10">
              <div>
                <p className="sans text-cyan-600 uppercase tracking-[0.2em] text-xs font-700 mb-2">
                  Discover More
                </p>
                <h2 className="serif text-3xl font-black text-slate-900">
                  Explore Products From Other Categories
                </h2>
              </div>
              {/* <Link
                href="/"
                className="sans text-sm font-700 text-slate-700 hover:text-cyan-600 transition-colors"
              >
                View all categories
              </Link> */}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherCategoryProducts.map((item) => (
                <Link key={item.id} href={`/products/${item.slug}`} className="group block">
                  <div className="group cursor-pointer">
                    <div className="relative mb-4 aspect-square overflow-hidden rounded-3xl bg-stone-200">
                      <img
                        src={getPrimaryImage(item) || category.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                      <span className="sans absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-stone-700 backdrop-blur">
                        {item.categoryTitle}
                      </span>
                    </div>
                    <h3 className="serif text-xl font-bold text-stone-900 leading-tight transition-colors group-hover:text-stone-700">
                      {item.name}
                    </h3>
                    <p className="sans mt-1 text-sm text-stone-600 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}