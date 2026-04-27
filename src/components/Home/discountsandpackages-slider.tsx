'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

import { getProductPath } from '@/lib/slug';

type DealsDiscountItem = {
  id: string;
  slug: string;
  name: string;
  label: string;
  description: string;
  imageUrl: string;
};

type DiscountsAndPackagesSliderProps = {
  items: DealsDiscountItem[];
};

export default function DiscountsAndPackagesSlider({ items }: DiscountsAndPackagesSliderProps) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-3xl border border-stone-200 bg-white p-8 text-center text-sm text-stone-600">
        No deals available right now.
      </div>
    );
  }

  const canLoop = items.length > 1;

  const getSafeImageSrc = (src: string | null | undefined): string | null => {
    if (!src) return null;
    const trimmed = src.trim();
    if (!trimmed) return null;
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
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-end gap-2">
        <button
          aria-label="Previous"
          className="deals-prev flex h-12 w-12 items-center justify-center rounded-full border border-stone-300 text-stone-900 transition hover:bg-stone-900 hover:text-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          aria-label="Next"
          className="deals-next flex h-12 w-12 items-center justify-center rounded-full border border-stone-300 text-stone-900 transition hover:bg-stone-900 hover:text-white"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        navigation={{
          prevEl: '.deals-prev',
          nextEl: '.deals-next',
        }}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 4200,
          disableOnInteraction: false,
        }}
        loop={canLoop}
        centeredSlides={false}
        spaceBetween={0}
        slidesPerGroup={1}
        breakpoints={{
          0: { slidesPerView: 1, slidesPerGroup: 1 },
        }}
        className="overflow-hidden! pb-4"
      >
        {items.map((card) => {
          const imageSrc = getSafeImageSrc(card.imageUrl);
          return (
            <SwiperSlide key={card.id} className="!h-auto !w-full">
              <Link
                href={getProductPath(card.id, card.name, card.slug)}
                prefetch={false}
                className="group relative isolate block h-full w-full min-h-[26rem] overflow-hidden rounded-3xl border border-[#C9D6DF] bg-linear-to-br from-[#1B3C53] via-[#234C6A] to-[#2A5B7D] text-left text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:min-h-[28rem]"
              >
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={card.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1200px"
                    className="object-cover object-center opacity-35 transition duration-500 group-hover:scale-105 group-hover:opacity-45"
                  />
                ) : null}
                <div className="absolute inset-0 bg-linear-to-b from-[#1B3C53]/70 via-[#1B3C53]/75 to-[#1B3C53]/95" aria-hidden="true" />
                <div className="absolute inset-x-0 top-0 h-px bg-white/25" aria-hidden="true" />
                <div className="absolute -right-14 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
                <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-[#7FC6EA]/20 blur-2xl" aria-hidden="true" />

                <div className="relative flex h-full flex-col items-start justify-between p-8 sm:p-10">
                  <div>
                    <span className="mb-5 inline-flex items-center rounded-full border border-white/35 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/90">
                      {card.label}
                    </span>
                    <h3 className="max-w-[18ch] font-serif text-3xl font-bold leading-tight sm:text-4xl">
                      {card.name}
                    </h3>
                    {/* <p className="mt-4 line-clamp-3 max-w-[48ch] text-sm leading-relaxed text-white/90 sm:text-base">
                      {card.description}
                    </p> */}
                  </div>

                  <span className="mt-8 inline-flex items-center gap-2 rounded-xl border border-white/60 bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-[#1B3C53] transition duration-300 group-hover:bg-[#EAF2F7]">
                    View Details
                    <span aria-hidden="true" className="text-base">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

