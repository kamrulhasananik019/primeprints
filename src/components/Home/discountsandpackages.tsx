type DiscountCard = {
  id: string;
  label: string;
  title: string;
  description: string;
  gradientClass: string;
};

const discountCards: DiscountCard[] = [
  {
    id: 'student-discount',
    label: 'Latest Design',
    title: 'Student Discount',
    description: 'Save more with valid student ID on selected print products and stationery.',
    gradientClass:
      'bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.22),transparent_38%),linear-gradient(130deg,#4f46e5_0%,#2563eb_100%)]',
  },
  {
    id: 'bulk-order-discount',
    label: 'Latest Design',
    title: 'Bulk Order Discount',
    description: 'Order in larger quantities and unlock tiered pricing for business campaigns.',
    gradientClass:
      'bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.18),transparent_32%),linear-gradient(130deg,#1d4ed8_0%,#0891b2_100%)]',
  },
  {
    id: 'review-discount',
    label: 'Latest Design',
    title: 'Drop a Review Discount',
    description: 'Leave a verified review after your order and receive a discount on your next print.',
    gradientClass:
      'bg-[radial-gradient(circle_at_84%_20%,rgba(255,255,255,0.2),transparent_35%),linear-gradient(130deg,#6d28d9_0%,#7c3aed_100%)]',
  },
  {
    id: 'tshirt-printing-discount',
    label: 'Latest Design',
    title: 'T-Shirt Printing Discount',
    description: 'Get reduced rates on custom t-shirt printing for events, teams, and promotions.',
    gradientClass:
      'bg-[radial-gradient(circle_at_16%_18%,rgba(255,255,255,0.18),transparent_34%),linear-gradient(130deg,#0f766e_0%,#0ea5e9_100%)]',
  },
];

export default function DiscountsAndPackages() {
  return (
    <section className="bg-stone-50 py-16 font-sans lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">
              Special Offers
            </span>

            <h2 className="font-serif text-3xl font-bold leading-tight text-stone-900 sm:text-4xl lg:text-5xl">
              Discounts & Packages
            </h2>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {discountCards.map((card) => {
              return (
                <article
                  key={card.id}
                  className={`group relative isolate min-h-70 overflow-hidden rounded-3xl p-8 text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:min-h-80 sm:p-10 ${card.gradientClass}`}
                >
                  <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/20" aria-hidden="true" />
                  <div className="absolute -bottom-24 -left-8 h-52 w-52 rounded-full border border-white/15" aria-hidden="true" />

                  <div className="relative flex h-full flex-col items-start justify-between">
                    <div>
                      <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-white/85">
                        {card.label}
                      </p>
                      <h3 className="max-w-[12ch] font-serif text-4xl font-bold leading-[1.06] sm:text-5xl">
                        {card.title}
                      </h3>
                      <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-white/85 sm:text-base">
                        {card.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="mt-8 inline-flex border border-white/70 px-8 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition duration-300 hover:bg-white hover:text-slate-900">
                        Order Now
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}