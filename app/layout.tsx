import type { Metadata } from "next";
import { Inter, Jost } from "next/font/google";
import "./globals.css";

// Use Inter as the body font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Use Montserrat for headings
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jost.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
