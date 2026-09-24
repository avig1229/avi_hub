import type { Metadata } from "next";
import { Mulish, Philosopher, Roboto_Mono } from "next/font/google";
import "./globals.css";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

// Headings.
const philosopher = Philosopher({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

// Body text and UI.
const mulish = Mulish({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "shRma | Product Designer",
  description: "Portfolio of Avi, a passionate product designer.",
};

import { ThemeProvider } from "@/components/ThemeProvider";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AudioProvider } from "@/components/audio/AudioProvider";
import { GuideProvider } from "@/components/guide/Guide";
import { client } from "@/sanity/lib/client";
import { SITE_GUIDE_QUERY } from "@/sanity/lib/queries";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Revalidated, so pages stay static; a Sanity outage just means default lines.
  const siteGuide = await client
    .fetch(SITE_GUIDE_QUERY, {}, { next: { revalidate: 60 } })
    .catch(() => null);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${mulish.variable} ${philosopher.variable} ${robotoMono.variable} antialiased overflow-x-clip`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AudioProvider>
            <GuideProvider site={siteGuide}>
              <Navigation />
              <main className="min-h-screen pt-24 px-6 md:px-12 max-w-[1920px] mx-auto">
                {children}
              </main>
              <Footer />
            </GuideProvider>
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
