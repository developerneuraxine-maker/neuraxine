import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://neuraxine.ai";

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} — AI Automation Agency`,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.tagline,
  keywords: [
    "AI automation",
    "WhatsApp automation",
    "AI chatbot",
    "voice agent",
    "lead generation",
    "CRM automation",
    "business automation",
    "Neuraxine AI",
  ],
  authors: [{ name: BRAND.name }],
  creator: BRAND.name,
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: BRAND.name,
    title: `${BRAND.name} — ${BRAND.headline}`,
    description: BRAND.tagline,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: BRAND.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — ${BRAND.headline}`,
    description: BRAND.tagline,
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: BRAND.name,
  description: BRAND.tagline,
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    availableLanguage: "English",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full bg-black text-white overflow-x-hidden">{children}</body>
    </html>
  );
}
