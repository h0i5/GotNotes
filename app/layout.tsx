import type { Metadata } from "next";
import { Inter, Jost } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

// Use Inter as the body font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Use Jost for headings
const jost = Jost({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: "GotNotes?",
  description:
    "One step solution for notes and resources sharing in your college.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jost.variable}`}>
      <body className={`${inter.className} text-white min-h-screen`}>
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-900 via-purple-900/20 to-black">
          <Navbar />
          <main className="flex-grow">{children}</main>
        </div>
      </body>
    </html>
  );
}
