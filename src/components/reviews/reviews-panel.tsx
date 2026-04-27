'use client';

import { useMemo, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import ReviewCard from '@/components/reviews/review-card';
import ReviewSubmitForm from '@/components/reviews/review-submit-form';

type ReviewItem = {
  id: string;
  name: string;
  email: string;
  rating: number;
  text: string;
  reviewDate: string;
  createdAt: string;
};

type ReviewsPanelProps = {
  initialReviews: ReviewItem[];
};

export default function ReviewsPanel({ initialReviews }: ReviewsPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const reviews = useMemo(() => initialReviews, [initialReviews]);
  const canLoop = reviews.length >= 4;

  return (
    <section className="overflow-hidden bg-slate-50 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-100 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-indigo-600" />
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-700">Trusted by customers</p>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Real customer voices.
            </h2>
            <p className="mt-2 text-sm text-slate-500">Only admin-approved reviews are shown here.</p>
          </div>

          <button
            type="button"
            onClick={() => setShowForm((value) => !value)}
            className="inline-flex cursor-pointer items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:cursor-pointer hover:bg-slate-800"
          >
            {showForm ? 'Close Form' : 'Drop A Review'}
          </button>
        </div>

        {showForm ? <ReviewSubmitForm onSubmitted={() => setShowForm(false)} /> : null}

        {reviews.length > 0 ? (
          <div className="mt-6">
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{
                delay: 3200,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{ clickable: true }}
              loop={canLoop}
              spaceBetween={20}
              breakpoints={{
                0: { slidesPerView: 1.05 },
                640: { slidesPerView: 1.5 },
                768: { slidesPerView: 2 },
                1200: { slidesPerView: 3 },
              }}
              className="pb-10"
            >
              {reviews.map((review) => (
                <SwiperSlide key={review.id} className="h-auto">
                  <ReviewCard name={review.name} rating={review.rating} text={review.text} createdAt={review.reviewDate} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
            No approved reviews yet. Be the first to drop one.
          </div>
        )}
      </div>
    </section>
  );
}
