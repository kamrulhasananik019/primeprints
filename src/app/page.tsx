import AllProducts from "@/components/Home/allproducts";
import Banner from "@/components/Home/banner";
import CategorySlider from "@/components/Home/categoryslider";
import Faq from "@/components/Home/faq";
import LocationMap from "@/components/Home/locationmap";
import SameDayPrinting from "@/components/Home/newarrivals";
import PromoBar from "@/components/Home/promobar";
import Reviews from "@/components/Home/reviews";
import SeasonalFavorites from "@/components/Home/seasonalfavorites";


export default function Home() {
  return (
   <section className="overflow-hidden bg-gradient-to-br from-slate-50 to-white font-['DM_Sans',sans-serif] ">
    <Banner />
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
