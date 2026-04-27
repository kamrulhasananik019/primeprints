import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import AppQueryProvider from "@/components/providers/query-provider";
import { getNavCategories } from "@/lib/catalog";
import { siteAddress, siteUrl } from "@/lib/site";

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

/** Cache layout and navbar categories for 1 week; invalidated only by admin category operations */
export const revalidate = 604800;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4efeb",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Prime Prints",
  icons: {
    icon: [
      { url: "/icon/favicon.ico" },
      { url: "/icon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon/favicon-180x180-apple.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/icon/favicon.ico"],
  },
  title: {
    default: "Prime Prints | Same Day Delivery Printing in London & UK",
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
    title: "Prime Prints | Same Day Delivery Printing in UK",
    description:
      "Prime Prints provides same-day delivery printing in London and across the UK for business cards, flyers, posters, banners, and more.",
    url: "/",
    siteName: "Prime Prints",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Prime Prints logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prime Prints | Same Day Delivery Printing in UK",
    description:
      "Prime Prints provides same-day delivery printing in London and across the UK.",
    images: ["/logo.png"],
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
    streetAddress: siteAddress.streetAddress,
    addressLocality: siteAddress.addressLocality,
    postalCode: siteAddress.postalCode,
    addressCountry: siteAddress.addressCountry,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getNavCategories();

  return (
    <html
      lang="en-GB"
      className={`${playfairDisplay.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <AppQueryProvider>
          <Navbar categories={categories} />
          {children}
          <Footer />
        </AppQueryProvider>
      </body>
    </html>
  );
}
