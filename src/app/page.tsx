import AllProducts from "@/components/Home/allproducts";
import Banner from "@/components/Home/banner";
import CategorySlider from "@/components/Home/categoryslider";
import PromoBar from "@/components/Home/promobar";


export default function Home() {
  return (
   <section className="overflow-hidden">
    <Banner />
    <PromoBar/>
    <CategorySlider/>
    <AllProducts/>
   </section>
  );
}
