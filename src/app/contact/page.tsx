import type { Metadata } from "next";
import { Suspense } from "react";
import ContactPageContent from "@/components/contact/contact-page";
import { getCategoriesWithProducts } from "@/lib/catalog";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Contact | Prime Prints",
  description:
    "Talk with Prime Prints about custom quotes, turnaround times, pickup windows, and large-format print support.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Prime Prints",
    description:
      "Request a quote, discuss turnaround times, and get expert support for your print projects.",
    url: "/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Prime Prints",
    description:
      "Request a quote and get support for custom, same-day, and large-format printing.",
  },
};

export default function ContactPage() {
  const categories = getCategoriesWithProducts();

  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-50" />}>
      <ContactPageContent categories={categories} />
    </Suspense>
  );
}
