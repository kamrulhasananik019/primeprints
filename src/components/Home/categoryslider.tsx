'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { Category } from '@/data/categories';

type CategorySliderProps = {
  categories: Category[];
};

export default function CategorySlider({ categories }: CategorySliderProps) {
  return (
    <section className="relative overflow-hidden bg-stone-100 py-16 lg:py-20">
      <div className="absolute h-[420px] w-[420px] rounded-full bg-gradient-to-br from-stone-200/70 to-transparent blur-3xl" />

      <div className="mx-auto  px-4 sm:px-6 lg:px-6">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="mx-auto container">
            <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">
              Our Products
            </span>

            <h2 className="font-serif text-3xl font-bold leading-tight text-stone-900 sm:text-4xl lg:text-5xl">
              Explore all categories
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              aria-label="Previous"
              className="category-prev flex h-12 w-12 items-center justify-center rounded-full border border-stone-300 text-stone-900 transition hover:bg-stone-900 hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              aria-label="Next"
              className="category-next flex h-12 w-12 items-center justify-center rounded-full border border-stone-300 text-stone-900 transition hover:bg-stone-900 hover:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: '.category-prev',
            nextEl: '.category-next',
          }}
          spaceBetween={18}
          breakpoints={{
            0: { slidesPerView: 1.2 },
            480: { slidesPerView: 2.1 },
            768: { slidesPerView: 3.2 },
            1024: { slidesPerView: 4.2 },
            1280: { slidesPerView: 5.2 },
          }}
          className="!overflow-visible"
        >
          {categories.map((category) => (
            <SwiperSlide key={category.title} className="h-auto">
              <Link href={`/categories/${category.slug}`}>
                <div className="group cursor-pointer">
                  <div className="relative mb-4 aspect-[3/3] overflow-hidden rounded-3xl bg-stone-200">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 20vw"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />

                    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-stone-700 backdrop-blur">
                      {category.tag}
                    </div>
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-stone-900">
                    {category.title}
                  </h3>
                  <p className="mt-1 text-sm text-stone-500">{category.tag}</p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
