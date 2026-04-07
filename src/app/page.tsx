import AllProducts from "@/components/Home/allproducts";
import Banner from "@/components/Home/banner";
import CategorySlider from "@/components/Home/categoryslider";
import Cta from "@/components/Home/cta";
import Faq from "@/components/Home/faq";
import LocationMap from "@/components/Home/locationmap";
import PromoBar from "@/components/Home/promobar";
import Reviews from "@/components/Home/reviews";


export default function Home() {
  return (
   <section className="overflow-hidden bg-gradient-to-br from-slate-50 to-white font-['DM_Sans',sans-serif] ">
    <Banner />
    <PromoBar/>
    <CategorySlider/>
    <AllProducts/>
     <Cta/>
    <Faq/>
    <Reviews/>
    <LocationMap/>    
   </section>
  );
}
