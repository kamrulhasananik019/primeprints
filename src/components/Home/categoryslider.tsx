'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { Swiper as SwiperType } from 'swiper';
import type { CatalogCategory } from '@/lib/catalog';
import { getCategoryPath } from '@/lib/slug';

type CategorySliderProps = {
  categories: CatalogCategory[];
};

function getSafeImageSrc(src: string | null | undefined): string | null {
  if (!src) return null;
  const trimmed = src.trim();
  if (!trimmed) return null;

  // Allow root-relative assets and only valid absolute HTTP(S) URLs.
  if (trimmed.startsWith('/')) return trimmed;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed;
    }
  } catch {
    return null;
  }

  return null;
}

export default function CategorySlider({ categories }: CategorySliderProps) {
  const canLoop = categories.length >= 7;
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  return (
    <section className="relative overflow-hidden bg-white py-16 lg:py-20">
      <div className="pointer-events-none absolute h-105 w-105 rounded-full bg-linear-to-br from-stone-200/70 to-transparent blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">
              Our Products
            </span>

            <h2 className="font-serif text-3xl font-bold leading-tight text-stone-900 sm:text-4xl lg:text-5xl">
              Explore all categories
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-stone-600 sm:text-base">
              Choose a category to see full product details, pricing options, and fast print turnaround.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/categories"
              prefetch={false}
              className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800 transition hover:bg-stone-900 hover:text-white"
            >
              View All Category
            </Link>
            <button
              aria-label="Previous"
              type="button"
              onClick={() => swiper?.slidePrev()}
              className="hidden h-12 w-12 items-center justify-center rounded-full border border-stone-300 text-stone-900 transition hover:bg-stone-900 hover:text-white md:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              aria-label="Next"
              type="button"
              onClick={() => swiper?.slideNext()}
              className="hidden h-12 w-12 items-center justify-center rounded-full border border-stone-300 text-stone-900 transition hover:bg-stone-900 hover:text-white md:flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <Swiper
          onSwiper={setSwiper}
          modules={[Autoplay, Pagination]}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          loop={canLoop}
          spaceBetween={18}
          breakpoints={{
            0: { slidesPerView: 1.3 },
            480: { slidesPerView: 2.2 },
            768: { slidesPerView: 3.2 },
            1024: { slidesPerView: 4.1 },
            1280: { slidesPerView: 5.1 },
          }}
          className="overflow-visible! pb-10"
        >
          {categories.map((category) => {
            const imageSrc = getSafeImageSrc(category.imageUrl);
            return (
              <SwiperSlide key={category.id} className="h-auto">
                <Link href={getCategoryPath(category.id, category.name)} prefetch={false}>
                  <div className="group cursor-pointer text-center">
                    <div className="relative mx-auto mb-4 aspect-square w-44 overflow-hidden rounded-full border-4 border-white bg-stone-200 shadow-lg ring-1 ring-stone-200 sm:w-48 md:w-52">
                      {imageSrc ? (
                        <Image
                          src={imageSrc}
                          alt={category.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 20vw"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-stone-100 text-xs font-medium text-stone-500">
                          No image
                        </div>
                      )}
                    </div>

                    <h3 className="font-serif text-lg font-semibold text-stone-900">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className="mt-4 flex items-center justify-center gap-3 md:hidden">
          <button
            aria-label="Previous categories"
            type="button"
            onClick={() => swiper?.slidePrev()}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-900 transition hover:bg-stone-900 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            aria-label="Next categories"
            type="button"
            onClick={() => swiper?.slideNext()}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-900 transition hover:bg-stone-900 hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
