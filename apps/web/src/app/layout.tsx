import "./globals.css";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { i18n } from "../lib/i18n";

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["500", "600", "700"]
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={i18n.htmlLang}>
      <body className={`${sans.variable} ${serif.variable}`}>{children}</body>
    </html>
  );
}
