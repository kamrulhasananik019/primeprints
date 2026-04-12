import type { Metadata } from "next";
import { Suspense } from "react";
import ContactPageContent from "@/components/contact/contact-page";

export const metadata: Metadata = {
  title: "Contact | Prime Prints",
  description:
    "Talk with Prime Prints about custom quotes, turnaround times, pickup windows, and large-format print support.",
};

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-50" />}>
      <ContactPageContent />
    </Suspense>
  );
}
