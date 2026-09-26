import { Geist, Geist_Mono } from "next/font/google";
import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import { LOCALE_HEADER } from "@/lib/locale/routing";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Portfolio",
  description: "Portfolio",
};

export default async function RootLayout({ children }) {
  const headerStore = await headers();
  const locale = headerStore.get(LOCALE_HEADER) ?? DEFAULT_LOCALE;

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
