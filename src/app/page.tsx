import type { Metadata } from "next";
import nextDynamic from "next/dynamic";
import DiscountsAndPackages from "@/components/Home/discountsandpackages";
import Banner from "@/components/Home/banner";
import HomeDeferredFallback from "@/components/Home/home-deferred-fallback";
import Faq from "@/components/Home/faq";
import LocationMap from "@/components/Home/locationmap";
import PromoBar from "@/components/Home/promobar";
import Reviews from "@/components/Home/reviews";
import InfiniteMarquee from "@/components/shared/infinite-marquee";
import { getCategories } from "@/lib/d1";
import {
  getDeliveryMarketing,
  getLatestProducts,
  getProductCategoryTitleMap,
  getSameDayPrinting,
} from "@/lib/catalog";

const CategorySlider = nextDynamic(() => import("@/components/Home/categoryslider"), {
  loading: () => <HomeDeferredFallback minHeight="min-h-[420px]" />,
});

const SameDayPrinting = nextDynamic(() => import("@/components/Home/samedaydelivery"), {
  loading: () => <HomeDeferredFallback minHeight="min-h-[420px]" />,
});

const DeliveryMarketing = nextDynamic(() => import("@/components/Home/deliverymarketing"), {
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Prime Prints | Same Day Delivery in London & UK",
    description:
      "Fast, premium printing with same day delivery in London and 24-hour UK delivery options.",
  },
};


export default async function Home() {
  const categories = await getCategories();
  const latestProducts = await getLatestProducts();
  const sameDayPrinting = await getSameDayPrinting();
  const deliveryMarketingProducts = await getDeliveryMarketing();
  const latestCategoryTitles = getProductCategoryTitleMap(latestProducts, categories);
  const sameDayCategoryTitles = getProductCategoryTitleMap(sameDayPrinting, categories);
  const deliveryMarketingCategoryTitles = getProductCategoryTitleMap(deliveryMarketingProducts, categories);
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
      <DiscountsAndPackages products={latestProducts} productCategoryTitles={latestCategoryTitles} />
      <DeliveryMarketing products={deliveryMarketingProducts} productCategoryTitles={deliveryMarketingCategoryTitles} />
      <Faq />
      <Reviews />
      <LocationMap />
    </main>
  );
}
