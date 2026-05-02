import type { Metadata } from "next";
import { Suspense } from "react";
import ContactPageContent from "@/components/contact/contact-page";
import { getCategoriesWithProducts } from "@/lib/catalog";

/** Cache contact page for 1 week; invalidated only by admin category/product changes */
export const revalidate = 604800;

export const metadata: Metadata = {
  title: "Contact | Prime Print",
  description:
    "Talk with Prime Print about custom quotes, turnaround times, pickup windows, and large-format print support.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Prime Print",
    description:
      "Request a quote, discuss turnaround times, and get expert support for your print projects.",
    url: "/contact",
    type: "website",
    siteName: "Prime Print",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Prime Print contact and quote request",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Prime Print",
    description:
      "Request a quote and get support for custom, same-day, and large-format printing.",
    images: ["/logo.png"],
  },
};

export default async function ContactPage() {
  const categories = await getCategoriesWithProducts();

  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-50" />}>
      <ContactPageContent categories={categories} />
    </Suspense>
  );
}
