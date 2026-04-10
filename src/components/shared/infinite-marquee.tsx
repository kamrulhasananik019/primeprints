import React from 'react';
import styles from './infinite-marquee.module.css';

type InfiniteMarqueeProps = {
  topText?: string;
  bottomItems?: string[];
  className?: string;
};

export default function InfiniteMarquee({
  topText = 'SAME DAY PRINT AVAILABLE',
  bottomItems = [],
  className = '',
}: InfiniteMarqueeProps) {
  const safeBottomItems =
    bottomItems.length > 0 ? bottomItems : ['FAST DELIVERY', 'PREMIUM QUALITY', 'ECO-FRIENDLY'];

  // Keep a long-enough base sequence before duplicating it for seamless loop animation.
  const topBaseItems = Array.from({ length: 10 }, () => topText);
  const bottomBaseItems = [...safeBottomItems, ...safeBottomItems, ...safeBottomItems];
  const topTickerItems = [...topBaseItems, ...topBaseItems];
  const bottomTickerItems = [...bottomBaseItems, ...bottomBaseItems];

  return (
    <section className={`${styles.surface} ${className}`}>
      <div className="flex flex-col gap-6 md:gap-10">
        {/* Top Strip: Electric Purple Gradient */}
        <div className={`${styles.strip} bg-gradient-to-r from-[#1B3C53] via-[#234C6A] to-[#1B3C53] shadow-[0_0_40px_rgba(35,76,106,0.35)]`}>
          <div className={`${styles.marqueeTrack} ${styles.marqueeLeft} py-4 md:py-4 text-2xl sm:text-3xl md:text-4xl font-black italic tracking-tighter uppercase text-[#F4EFEB]`}>
            {topTickerItems.map((item, idx) => (
              <span
                key={`top-${idx}`}
                className="px-6 md:px-12 flex items-center gap-4"
                aria-hidden={idx >= topBaseItems.length}
              >
                {item}
                <span className="text-[#D2C1B6]/45 text-base md:text-2xl">•</span>
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Strip: Warm neutral accent */}
        {/* <div className={`${styles.strip} bg-[#D2C1B6] shadow-[0_0_40px_rgba(210,193,182,0.3)] -rotate-1`}>
          <div className={`${styles.marqueeTrack} ${styles.marqueeRight} py-4 md:py-4 text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-[#1B3C53]`}>
            {bottomTickerItems.map((item, idx) => (
              <span
                key={`bottom-${idx}`}
                className="px-6 md:px-10 flex items-center gap-4"
                aria-hidden={idx >= bottomBaseItems.length}
              >
                <span className={idx % 2 === 0 ? '' : 'opacity-40'}>{item}</span>
                <span className="w-2 h-2 md:w-3 md:h-3 bg-[#234C6A] rounded-full" />
              </span>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
}