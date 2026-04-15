import type { Metadata } from "next";
import nextDynamic from "next/dynamic";
import Link from "next/link";
import DiscountsAndPackages from "@/components/Home/discountsandpackages";
import Banner from "@/components/Home/banner";
import HomeDeferredFallback from "@/components/Home/home-deferred-fallback";
import Faq from "@/components/Home/faq";
import LocationMap from "@/components/Home/locationmap";
import PromoBar from "@/components/Home/promobar";
import Reviews from "@/components/Home/reviews";
import InfiniteMarquee from "@/components/shared/infinite-marquee";
import {
  getCatalogCategories,
  getProductCategoryTitleMap,
  getSameDayPrinting,
} from "@/lib/catalog";

const CategorySlider = nextDynamic(() => import("@/components/Home/categoryslider"), {
  loading: () => <HomeDeferredFallback minHeight="min-h-[420px]" />,
});

const SameDayPrinting = nextDynamic(() => import("@/components/Home/samedaydelivery"), {
  loading: () => <HomeDeferredFallback minHeight="min-h-[420px]" />,
});

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Same Day Delivery in London & UK | Prime Prints",
  description:
    "Prime Prints offers same day delivery in London and across the UK with 24-hour delivery for business cards, flyers, posters, banners, and custom print products.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Prime Prints | Same Day Delivery in London & UK",
    description:
      "Fast, premium printing with same day delivery in London and 24-hour UK delivery options.",
    url: "/",
    type: "website",
    siteName: "Prime Prints",
    images: [
      {
        url: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1600&q=80",
        width: 1600,
        height: 900,
        alt: "Prime Prints same day printing and delivery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prime Prints | Same Day Delivery in London & UK",
    description:
      "Fast, premium printing with same day delivery in London and 24-hour UK delivery options.",
    images: ["https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1600&q=80"],
  },
};


export default async function Home() {
  const categories = await getCatalogCategories();
  const sameDayPrinting = await getSameDayPrinting();
  const sameDayCategoryTitles = getProductCategoryTitleMap(sameDayPrinting, categories);
  const categoryTitles = categories.map((cat) => cat.name);

  return (
    <main className="overflow-hidden bg-stone-50 font-sans">
      <Banner />

      <div className="">
        <InfiniteMarquee bottomItems={categoryTitles} />
      </div>

      <PromoBar />
      <CategorySlider categories={categories} />
      <SameDayPrinting products={sameDayPrinting} productCategoryTitles={sameDayCategoryTitles} />
      <DiscountsAndPackages />
      <section className="bg-stone-50 py-14 md:py-18">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
            <div className="bg-linear-to-r from-[#1B3C53] via-[#234C6A] to-[#2A5B7D] p-8 text-white md:p-10">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">Need Printing Fast?</p>
              <h2 className="max-w-3xl font-serif text-3xl font-black leading-tight md:text-4xl">
                Get expert support and place your print order in minutes.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cyan-50 md:text-base">
                From business cards to large format prints, we help you choose the right product, finish, and delivery option for your deadline.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
              <p className="text-sm font-medium text-stone-600">Ready to start your next print project?</p>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Link
                  href="/contact"
                  prefetch={false}
                  className="inline-flex items-center justify-center rounded-xl border border-[#1B3C53] px-6 py-3 text-sm font-bold text-[#1B3C53] transition hover:bg-[#1B3C53] hover:text-white"
                >
                  Get a Quote
                </Link>
                <Link
                  href="/contact?intent=order"
                  prefetch={false}
                  className="inline-flex items-center justify-center rounded-xl bg-[#1B3C53] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#234C6A]"
                >
                  Order Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Faq />
      <Reviews />
      <LocationMap />
    </main>
  );
}
