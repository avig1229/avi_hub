import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AVIGU - Design Portfolio",
  description: "Portfolio showcasing fashion design, graphic design, and web development work",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-white text-black antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="border-t border-black py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className={`${playfair.className} text-lg font-medium mb-4`}>Contact</h3>
                  <p className="text-sm">Email: avi@merakicorp.co</p>
                  <p className="text-sm">Instagram: @aviggu</p>
                </div>
                <div>
                  <h3 className={`${playfair.className} text-lg font-medium mb-4`}>Navigation</h3>
                  <ul className="text-sm space-y-2">
                    <li><a href="/" className="hover:underline">Home</a></li>
                    <li><a href="/projects" className="hover:underline">Projects</a></li>
                    <li><a href="/resume" className="hover:underline">Resume</a></li>
                    <li><a href="/contact" className="hover:underline">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className={`${playfair.className} text-lg font-medium mb-4`}>Newsletter</h3>
                  <p className="text-sm mb-4">Subscribe to receive updates on new collections and events.</p>
                  <form className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="border border-black px-4 py-2 text-sm flex-grow"
                    />
                    <button
                      type="submit"
                      className="bg-black text-white px-4 py-2 text-sm hover:bg-gray-800"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
