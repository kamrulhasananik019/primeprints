import Banner from "@/components/Home/banner";
import CategorySlider from "@/components/Home/categoryslider";
import PromoBar from "@/components/Home/promobar";
import { Cat } from "lucide-react";


export default function Home() {
  return (
   <section className="overflow-hidden">
    <Banner />
    <PromoBar/>
    <CategorySlider/>
   </section>
  );
}
