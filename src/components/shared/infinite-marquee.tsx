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
    <section className={`${styles.surface} py-12 md:py-20 ${className}`}>
      <div className="flex flex-col gap-6 md:gap-10">
        {/* Top Strip: Electric Purple Gradient */}
        <div className={`${styles.strip} bg-gradient-to-r from-fuchsia-600 via-purple-600 to-fuchsia-600 shadow-[0_0_40px_rgba(192,38,211,0.3)]`}>
          <div className={`${styles.marqueeTrack} ${styles.marqueeLeft} py-4 md:py-6 text-2xl sm:text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white`}>
            {topTickerItems.map((item, idx) => (
              <span
                key={`top-${idx}`}
                className="px-6 md:px-12 flex items-center gap-4"
                aria-hidden={idx >= topBaseItems.length}
              >
                {item}
                <span className="text-white/30 text-base md:text-2xl">•</span>
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Strip: Neon Lime / Tech Look */}
        <div className={`${styles.strip} bg-lime-400 shadow-[0_0_40px_rgba(163,230,53,0.3)] -rotate-1`}>
          <div className={`${styles.marqueeTrack} ${styles.marqueeRight} py-3 md:py-5 text-xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-950`}>
            {bottomTickerItems.map((item, idx) => (
              <span
                key={`bottom-${idx}`}
                className="px-6 md:px-10 flex items-center gap-4"
                aria-hidden={idx >= bottomBaseItems.length}
              >
                <span className={idx % 2 === 0 ? '' : 'opacity-40'}>{item}</span>
                <span className="w-2 h-2 md:w-3 md:h-3 bg-slate-950 rounded-full" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}