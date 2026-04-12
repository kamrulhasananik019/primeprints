'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import {
  Truck,
  MessageCircle,
  BadgeHelp,
  type LucideIcon,
} from 'lucide-react';



type PromoItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const items: PromoItem[] = [
  {
    icon: Truck,
    title: 'Free delivery',
    description: 'On orders £40+',
  },
  {
    icon: MessageCircle,
    title: 'Flexible help when you need it',
    description: `We're here by phone, email & live chat`,
  },
  {
    icon: BadgeHelp,
    title: 'Create with confidence',
    description: 'Design it yourself, or with help',
  },
];

export default function PromoBar() {
  return (
    <section className="bg-[#f5f5f5]">
      <div className="hidden md:grid grid-cols-3  mx-auto">
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="flex items-center  justify-center gap-4 px-8 py-6 border-r last:border-r-0 border-gray-200"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#dfeaf2] shrink-0">
                <Icon className="h-7 w-7 text-gray-800" strokeWidth={1.8} />
              </div>

              <div>
                <h3 className="text-[22px] font-semibold font-serif text-gray-900 leading-tight">
                  {item.title}
                </h3>
                <p className="mt-1 text-[18px] text-gray-600 leading-snug">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="md:hidden max-w-7xl mx-auto">
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          loop
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          className="w-full"
        >
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <SwiperSlide key={index}>
                <div className="flex items-center gap-4 px-5 py-5 min-h-[110px]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#dfeaf2] shrink-0">
                    <Icon className="h-6 w-6 text-gray-800" strokeWidth={1.8} />
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-semibold font-serif text-gray-900 leading-tight">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm sm:text-base text-gray-600 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}

