'use client';

import { useState } from 'react';
import { X, Phone, Mail } from 'lucide-react';
import { phoneNumberTel, phoneNumber } from '@/lib/site';

export default function StickyCallCTA() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm animate-fade-in">
      <div className="rounded-xl bg-gradient-to-br from-[#1B3C53] to-[#234C6A] p-5 text-white shadow-2xl border border-amber-500/30">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 p-1 hover:bg-white/10 rounded-lg transition"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="pr-6">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-300 mb-2">
            Need Quick Help?
          </p>
          <h3 className="text-sm font-black mb-3 leading-tight">
            Schedule a FREE CALL with our printing experts
          </h3>
          <p className="text-xs text-white/80 mb-4 leading-relaxed">
            Get instant quotes, discuss your project, and arrange same-day delivery.
          </p>

          {/* Buttons */}
          <div className="space-y-2">
            {/* Call Button */}
            <a
              href={`tel:${phoneNumberTel}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-4 text-sm transition-all duration-200 hover:shadow-lg"
            >
              <Phone className="h-4 w-4" />
              Call: {phoneNumber}
            </a>

            {/* Email Button */}
            <a
              href="mailto:hello@primeprint.uk"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 text-sm transition-all duration-200 hover:shadow-lg"
            >
              <Mail className="h-4 w-4" />
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
