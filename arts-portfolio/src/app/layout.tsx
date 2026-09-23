import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "shRma | Product Designer",
  description: "Portfolio of Avi, a passionate product designer.",
};

import { ThemeProvider } from "@/components/ThemeProvider";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AudioProvider } from "@/components/audio/AudioProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${robotoMono.variable} antialiased overflow-x-clip`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AudioProvider>
            <Navigation />
            <main className="min-h-screen pt-24 px-6 md:px-12 max-w-[1920px] mx-auto">
              {children}
            </main>
            <Footer />
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
