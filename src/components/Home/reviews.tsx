'use client';

import React, { useRef } from 'react';
import { reviews } from '@/utils/reviews';

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-amber-400">
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
  </svg>
);

const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

export default function Reviews() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const scrollDistance = sliderRef.current.clientWidth * 0.9;
    sliderRef.current.scrollBy({ 
      left: direction === 'left' ? -scrollDistance : scrollDistance, 
      behavior: 'smooth' 
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('');
  };

  return (
    <section className="py-20 bg-slate-50 overflow-hidden">
      <div className="container mx-auto ">

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 border border-indigo-200 mb-4">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-700">
                Trusted by customers
              </p>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Reviews that feel like <br className="hidden sm:block" />
              <span className="text-slate-500">five-star trust badges.</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-900 hover:text-white hover:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              aria-label="Scroll left"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-900 hover:text-white hover:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              aria-label="Scroll right"
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-8 pt-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {reviews.map((review, index) => (
              <article
                key={index}
                className="group relative min-w-[340px] max-w-[340px] shrink-0 snap-start rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-300 flex flex-col justify-between"
              >
                <svg className="absolute top-6 right-6 w-12 h-12 text-slate-50 transition-colors group-hover:text-slate-100" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>

                <div className="relative z-10">
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: review.rating }).map((_, starIndex) => (
                      <StarIcon key={starIndex} />
                    ))}
                  </div>
                  <p className="text-base leading-relaxed text-slate-700 font-medium">
                    "{review.text}"
                  </p>
                </div>
                
                <div className="relative z-10 mt-8 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold text-sm">
                      {getInitials(review.name)}
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900">{review.name}</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{review.role}</p>
                    </div>

                    <div className="flex h-8 items-center justify-center rounded-lg bg-emerald-50 px-2.5 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                      {review.rating}.0
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-2 text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Verified Review
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}