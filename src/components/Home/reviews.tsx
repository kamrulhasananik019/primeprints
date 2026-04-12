import { reviews } from '@/utils/reviews';

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-amber-400">
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('');
}

export default function Reviews() {
  return (
    <section className="overflow-hidden bg-slate-50 py-20">
      <div className="container mx-auto">
        <div className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-100 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-indigo-600" />
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-700">Trusted by customers</p>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Reviews that feel like <br className="hidden sm:block" />
              <span className="text-slate-500">five-star trust badges.</span>
            </h2>
          </div>
          <p className="text-sm text-slate-500 md:text-right">Scroll sideways to read more →</p>
        </div>

        <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-8 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {reviews.map((review, index) => (
              <article
                key={index}
                className="group relative flex min-h-[280px] min-w-[min(340px,calc(100vw-2.5rem))] max-w-[340px] shrink-0 snap-start flex-col justify-between rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
              >
                <svg
                  className="absolute right-6 top-6 w-12 text-slate-50 transition-colors group-hover:text-slate-100"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>

                <div className="relative z-10">
                  <div className="mb-6 flex gap-1">
                    {Array.from({ length: review.rating }).map((_, starIndex) => (
                      <StarIcon key={starIndex} />
                    ))}
                  </div>
                  <p className="text-base font-medium leading-relaxed text-slate-700">&ldquo;{review.text}&rdquo;</p>
                </div>

                <div className="relative z-10 mt-8 border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                      {getInitials(review.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900">{review.name}</p>
                      <p className="mt-0.5 text-xs font-medium text-slate-500">{review.role}</p>
                    </div>
                    <div className="flex h-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 px-2.5 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                      {review.rating}.0
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
