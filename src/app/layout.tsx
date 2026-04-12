import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { getNavCategories } from "@/lib/catalog";
import { siteUrl } from "@/lib/site";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  adjustFontFallback: true,
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  adjustFontFallback: true,
});

export const dynamic = "force-static";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4efeb",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Prime Prints | Same Day Printing in London",
    template: "%s | Prime Prints",
  },
  description:
    "Prime Prints delivers premium same-day printing in London for business, events, and custom orders.",
  keywords: [
    "same day printing",
    "printing london",
    "business cards",
    "posters",
    "banner printing",
    "custom printing",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Prime Prints | Same Day Printing in London",
    description:
      "Premium print quality, fast turnaround, and reliable delivery windows for every project.",
    url: "/",
    siteName: "Prime Prints",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prime Prints | Same Day Printing in London",
    description:
      "Premium print quality with fast turnaround for business and personal projects.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "PrintShop",
  name: "Prime Prints",
  url: siteUrl,
  description:
    "Same-day and premium printing in London for business cards, flyers, posters, banners, and custom orders.",
  areaServed: { "@type": "City", name: "London" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "London",
    addressCountry: "GB",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = getNavCategories();

  return (
    <html
      lang="en-GB"
      className={`${playfairDisplay.variable} ${dmSans.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://www.google.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google.com" />
      </head>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Navbar categories={categories} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
