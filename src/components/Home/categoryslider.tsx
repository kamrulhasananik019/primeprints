'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/navigation';

type Category = {
  title: string;
  image: string;
  tag: string;
  description: string;
  accent: string;
};

const categories: Category[] = [
  {
    title: 'Business Cards',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80',
    tag: 'Identity',
    description:
      'Craft first impressions that last. Premium paper stocks, finishes, and die-cut shapes for a card that commands attention.',
    accent: '#c9a96e',
  },
  {
    title: 'Print & Office',
    image: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&q=80',
    tag: 'Marketing',
    description:
      'High-fidelity prints for advertising and office environments. Brochures, flyers, letterheads and more.',
    accent: '#7b9e87',
  },
  {
    title: 'Signs & Banners',
    image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&q=80',
    tag: 'Outdoor',
    description:
      'Bold, weather-resistant signage that stops people in their tracks.',
    accent: '#e07a5f',
  },
  {
    title: 'Flyers & Posters',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80',
    tag: 'Promotional',
    description:
      'Eye-catching flyers and posters to promote your events and services.',
    accent: '#f4a261',
  },
  {
    title: 'Brochures',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80',
    tag: 'Informational',
    description:
      'Detailed brochures that inform and engage your audience.',
    accent: '#2a9d8f',
  },
  {
    title: 'Stickers & Labels',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80',
    tag: 'Branding',
    description:
      'Custom stickers and labels for branding and product identification.',
    accent: '#e76f51',
  },
  {
    title: 'T-Shirts & Apparel',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    tag: 'Merchandise',
    description:
      'Custom printed t-shirts and apparel for teams and promotions.',
    accent: '#264653',
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export default function CategorySlider() {
  return (
    <section className="relative overflow-hidden bg-stone-100 py-16 lg:py-20">
      <div className="absolute   h-[420px] w-[420px] rounded-full bg-gradient-to-br from-stone-200/70 to-transparent blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
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
              <Link href={`/categories/${slugify(category.title)}`}>
                <div className="group cursor-pointer">
                  <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-3xl bg-stone-200">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />

                    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-stone-700 backdrop-blur">
                      {category.tag}
                    </div>

                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/10 to-transparent p-5 opacity-0 transition duration-300 group-hover:opacity-100">
                      <span className="flex items-center gap-1 text-sm font-medium text-white">
                        Explore
                      </span>
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
