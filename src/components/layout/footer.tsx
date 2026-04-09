'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-12 bg-slate-950 text-slate-200 border-t border-slate-800">
      <div className="container mx-auto px-4  py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400 mb-3">Prime Prints</p>
            <h3 className="text-2xl font-black text-white mb-3 font-[var(--font-playfair-display)]">
              Bring your ideas to print
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed font-[var(--font-dm-sans)]">
              Professional quality printing with fast turnaround for business, events, and personal projects.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400 mb-3">Quick Links</p>
            <div className="flex flex-col gap-2 font-[var(--font-dm-sans)]">
              <Link href="/" className="text-sm text-slate-200 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/#contact" className="text-sm text-slate-200 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400 mb-3">Need Help?</p>
            <p className="text-sm text-slate-400 leading-relaxed mb-4 font-[var(--font-dm-sans)]">
              Need a custom quote or design support? Our team is ready to help with the right print option.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center rounded-lg bg-white text-slate-900 px-5 py-2.5 text-sm font-700 hover:bg-slate-200 transition-colors font-[var(--font-dm-sans)]"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500 font-[var(--font-dm-sans)]">
            {new Date().getFullYear()} Prime Prints. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 font-[var(--font-dm-sans)]">
            Crafted for premium printing experiences.
          </p>
        </div>
      </div>
    </footer>
  );
}
