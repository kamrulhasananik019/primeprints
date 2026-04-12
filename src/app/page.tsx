import type { Metadata } from "next";
import nextDynamic from "next/dynamic";
import AllProducts from "@/components/Home/allproducts";
import Banner from "@/components/Home/banner";
import HomeDeferredFallback from "@/components/Home/home-deferred-fallback";
import Faq from "@/components/Home/faq";
import LocationMap from "@/components/Home/locationmap";
import PromoBar from "@/components/Home/promobar";
import Reviews from "@/components/Home/reviews";
import InfiniteMarquee from "@/components/shared/infinite-marquee";
import { categories } from "@/data/categories";
import {
  getLatestProducts,
  getProductCategoryTitleMap,
  getSameDayPrinting,
  getSeasonalFavorites,
} from "@/lib/catalog";

const CategorySlider = nextDynamic(() => import("@/components/Home/categoryslider"), {
  loading: () => <HomeDeferredFallback minHeight="min-h-[420px]" />,
});

const SameDayPrinting = nextDynamic(() => import("@/components/Home/newarrivals"), {
  loading: () => <HomeDeferredFallback minHeight="min-h-[420px]" />,
});

const SeasonalFavorites = nextDynamic(() => import("@/components/Home/seasonalfavorites"), {
  loading: () => <HomeDeferredFallback minHeight="min-h-[420px]" />,
});

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Same Day Printing in London",
  description:
    "Prime Prints offers same-day printing for business cards, flyers, posters, banners, and custom print products across London.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Prime Prints | Same Day Printing in London",
    description:
      "Fast, premium printing for business and personal projects. Same-day options available.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prime Prints | Same Day Printing in London",
    description:
      "Fast, premium printing for business and personal projects. Same-day options available.",
  },
};


export default function Home() {
  const latestProducts = getLatestProducts();
  const sameDayPrinting = getSameDayPrinting();
  const seasonalFavorites = getSeasonalFavorites();
  const latestCategoryTitles = getProductCategoryTitleMap(latestProducts);
  const sameDayCategoryTitles = getProductCategoryTitleMap(sameDayPrinting);
  const categoryTitles = categories.map((cat) => cat.title);

  return (
  <section className="overflow-hidden bg-linear-to-br from-slate-50 to-white font-sans">
    <Banner />
    <InfiniteMarquee bottomItems={categoryTitles} />
    <PromoBar/>
    <CategorySlider categories={categories} />
      <SameDayPrinting products={sameDayPrinting} productCategoryTitles={sameDayCategoryTitles} />
     <AllProducts products={latestProducts} productCategoryTitles={latestCategoryTitles} />
    <SeasonalFavorites products={seasonalFavorites} />
    <Faq/>
    <Reviews/>
    <LocationMap/>    
   </section>
  );
}
