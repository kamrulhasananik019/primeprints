'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Clock, Layers, Package, Ruler, Star } from 'lucide-react';
import type { RichDescription } from '@/types/rich-content';
import type { CatalogProduct } from '@/lib/catalog';
import RichContent from '@/components/shared/rich-content';

type ProductHeroProps = {
  product: CatalogProduct;
  category: {
    title: string;
    slug: string;
    image: string;
  };
  primaryImage: string;
  relatedImages: string[];
  productTitle: string;
  productShortDescription: RichDescription;
};

export default function ProductHero({
  product,
  category,
  primaryImage,
  relatedImages,
  productTitle,
  productShortDescription,
}: ProductHeroProps) {
  const [selectedImage, setSelectedImage] = useState(primaryImage);

  useEffect(() => {
    setSelectedImage(primaryImage);
  }, [primaryImage, product.id]);

  const galleryImages = useMemo(
    () =>
      Array.from(new Set([primaryImage, ...product.images.map((img) => img.url), ...relatedImages]))
        .filter(Boolean)
        .slice(0, 8),
    [primaryImage, product.images, relatedImages]
  );

  const specIcons: Record<string, React.ReactNode> = {
    material: <Layers size={16} />,
    size: <Ruler size={16} />,
    finish: <Package size={16} />,
    turnaround: <Clock size={16} />,
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl">
          <div className="relative aspect-square">
            <Image
              src={selectedImage}
              alt={productTitle}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-900/25 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-700 text-slate-800">4.9</span>
            </div>
          </div>
        </div>

        {galleryImages.length > 1 && (
          <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
            {galleryImages.map((img, index) => {
              const active = selectedImage === img;
              return (
                <button
                  key={`${img}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`relative aspect-square overflow-hidden rounded-xl border transition ${
                    active
                      ? 'border-cyan-500 ring-2 ring-cyan-200'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  aria-label={`Show image ${index + 1}`}
                >
                  <Image
                    src={img}
                    alt={`${productTitle} thumbnail ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 25vw, 10vw"
                    className="h-full w-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-5 md:p-6">
        <p className="sans mb-3 text-xs font-700 uppercase tracking-[0.2em] text-cyan-600">{category.title}</p>
        <h1 className="serif mb-5 text-3xl leading-tight font-black text-stone-900 md:text-4xl">{productTitle}</h1>

        <RichContent
          content={productShortDescription}
          wrapperClassName="mb-7 space-y-3"
          textClassName="sans text-base leading-relaxed text-stone-600"
          listClassName="list-disc pl-5 text-base leading-relaxed text-stone-600 space-y-1"
          listItemClassName="sans"
        />

        <div className="mb-7 grid grid-cols-2 gap-3">
          {Object.entries(product.specs).map(([key, value]) => (
            <div
              key={key}
              className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-cyan-300 hover:shadow-sm"
            >
              <div className="sans mb-2 flex items-center gap-2 text-xs font-600 uppercase tracking-widest text-slate-500">
                <span className="text-cyan-600">{specIcons[key]}</span>
                {key}
              </div>
              <p className="sans text-sm font-600 text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/contact?category=${category.slug}&product=${product.slug}`}
            className="sans inline-flex items-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-700 text-white transition hover:bg-slate-800"
          >
            Get Quote
          </Link>
          <Link
            href={`/categories/${category.slug}`}
            className="sans inline-flex items-center rounded-xl border border-slate-300 px-6 py-3 text-sm font-700 text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          >
            View Category
          </Link>
        </div>
      </div>
    </div>
  );
}
