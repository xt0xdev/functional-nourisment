import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/content";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
});

const sans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Functional Nutritionist in NYC | Anna Almiroudis | Functional Nourishment",
    template: "%s | Functional Nourishment",
  },
  description:
    "Anna Almiroudis, MS, CNS, LN, CDN is a functional nutritionist in Astoria serving the NYC metro area with insurance-covered Medical Nutrition Therapy.",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
