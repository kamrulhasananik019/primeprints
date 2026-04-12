import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://primeprints.co.uk"),
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
