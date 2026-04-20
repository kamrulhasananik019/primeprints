import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-[#234C6A] bg-[#1B3C53] text-[#E7DBD3]">
      <div className="container mx-auto px-4  py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
              <Link href="/" prefetch={false} className="my-2 flex items-center">
                <Image
                  src="/logo.png"
                  alt="PrimePrint"
                  width={400}
                  height={120}
                  className="h-10 w-auto object-contain"
                />
            </Link>
            {/* <p className="mb-3 text-xs uppercase tracking-[0.22em] text-[#D2C1B6]/70">Prime Prints</p> */}
            <h3 className="mb-3 text-2xl font-black text-[#F4EFEB] [font-family:var(--font-playfair-display)]">
              Bring your ideas to print
            </h3>
            <p className="text-sm leading-relaxed text-[#D2C1B6]/85 [font-family:var(--font-dm-sans)]">
              Professional quality printing with fast turnaround for business, events, and personal projects.
            </p>
          </div>

          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-[#D2C1B6]/70">Quick Links</p>
            <div className="flex flex-col gap-2 [font-family:var(--font-dm-sans)]">
              <Link href="/" prefetch={false} className="text-sm text-[#E7DBD3] transition-colors hover:text-white">
                Home
              </Link>
              <Link href="/contact" prefetch={false} className="text-sm text-[#E7DBD3] transition-colors hover:text-white">
                Contact
              </Link>
              <Link href="/faqs" prefetch={false} className="text-sm text-[#E7DBD3] transition-colors hover:text-white">
                FAQs
              </Link>
              <Link href="/reviews" prefetch={false} className="text-sm text-[#E7DBD3] transition-colors hover:text-white">
                Reviews
              </Link>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-[#D2C1B6]/70">Need Help?</p>
            <p className="mb-4 text-sm leading-relaxed text-[#D2C1B6]/85 [font-family:var(--font-dm-sans)]">
              Need a custom quote or design support? Our team is ready to help with the right print option.
            </p>
            <Link
              href="/#contact"
              prefetch={false}
              className="inline-flex items-center justify-center rounded-lg bg-[#D2C1B6] px-5 py-2.5 text-sm font-bold text-[#1B3C53] transition-colors hover:bg-[#E7DBD3] [font-family:var(--font-dm-sans)]"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-[#234C6A]/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#D2C1B6]/65 [font-family:var(--font-dm-sans)]">
            {new Date().getFullYear()} Prime Prints. All rights reserved.
          </p>
          <p className="text-xs text-[#D2C1B6]/65 [font-family:var(--font-dm-sans)]">
            Crafted for premium printing experiences.
          </p>
        </div>
      </div>
    </footer>
  );
}
