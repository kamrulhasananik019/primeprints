'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Cta() {
  return (
    <div className=" py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center ">
          <div className="relative bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#9333EA] rounded-[2rem] bg-white/10 border border-white/10 p-8 backdrop-blur-xl shadow-2xl text-white">
            <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/90 mb-6">
              company portfolio
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
              Have A Look Some<br />Exciting Projects Business
            </h2>
            <ul className="space-y-3 text-sm text-white/85 mb-8">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Large paper & stock selection & unique print
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Printing programs tailored to your company needs
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Large paper & stock selection & unique print
              </li>
            </ul>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-white/90 hover:text-slate-900"
            >
              Talk To A Print Specialist
            </Link>
            <div className="absolute -left-10 top-10 hidden h-24 w-24 rounded-full border border-white/20 bg-white/10 blur-xl sm:block" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="overflow-hidden rounded-[1.5rem] border border-white/10 shadow-xl bg-slate-900/30">
              <Image
                src="https://images.unsplash.com/photo-1498079022511-d15614cb1c02?auto=format&fit=crop&w=800&q=80"
                alt="Printing mockup on desk"
                width={800}
                height={500}
                className="h-44 w-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-[1.5rem] border border-white/10 shadow-xl bg-slate-900/30">
              <Image
                src="https://images.unsplash.com/photo-1515876301701-4d3004bfdc77?auto=format&fit=crop&w=800&q=80"
                alt="Packaging design preview"
                width={800}
                height={500}
                className="h-44 w-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-[1.5rem] border border-white/10 shadow-xl bg-slate-900/30">
              <Image
                src="https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80"
                alt="Creative print design"
                width={800}
                height={500}
                className="h-44 w-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-[1.5rem] border border-white/10 shadow-xl bg-slate-900/30">
              <Image
                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80"
                alt="Colorful printed packaging"
                width={800}
                height={500}
                className="h-44 w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
