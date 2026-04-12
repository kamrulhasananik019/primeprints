import AllProducts from "@/components/Home/allproducts";
import Banner from "@/components/Home/banner";
import CategorySlider from "@/components/Home/categoryslider";
import Faq from "@/components/Home/faq";
import LocationMap from "@/components/Home/locationmap";
import SameDayPrinting from "@/components/Home/newarrivals";
import PromoBar from "@/components/Home/promobar";
import Reviews from "@/components/Home/reviews";
import SeasonalFavorites from "@/components/Home/seasonalfavorites";
import InfiniteMarquee from "@/components/shared/infinite-marquee";
import { categories } from "@/utils/data";


export default function Home() {
  const categoryTitles = categories.map((cat) => cat.title);

  return (
  <section className="overflow-hidden bg-linear-to-br from-slate-50 to-white font-['DM_Sans',sans-serif] ">
    <Banner />
    <InfiniteMarquee bottomItems={categoryTitles} />
    <PromoBar/>
    <CategorySlider/>
      <SameDayPrinting/>
     <AllProducts/>
    <SeasonalFavorites/>
    <Faq/>
    <Reviews/>
    <LocationMap/>    
   </section>
  );
}
