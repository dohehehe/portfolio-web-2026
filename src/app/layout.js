import { headers } from "next/headers";
import Navigation from "@/components/navigation/navigation";
import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import { LOCALE_HEADER } from "@/lib/locale/routing";
import {
  getNavigationEventListData,
  getNavigationTextListData,
  getNavigationWorkListData,
} from "@/lib/server/data/navigation";
import { archivoNarrow, gothicA1, inter } from "./fonts";
import "./globals.css";

export const metadata = {
  title: "dohee kwak",
  description: "dohee kwak",
};

export default async function RootLayout({ children }) {
  const headerStore = await headers();
  const locale = headerStore.get(LOCALE_HEADER) ?? DEFAULT_LOCALE;

  const [{ projects, works }, events, texts] = await Promise.all([
    getNavigationWorkListData(),
    getNavigationEventListData(),
    getNavigationTextListData(),
  ]);

  return (
    <html
      lang={locale}
      className={`${gothicA1.variable} ${inter.variable} ${archivoNarrow.variable}`}
    >
      <body>
        <Navigation
          initialProjects={projects}
          initialWorks={works}
          initialEvents={events}
          initialTexts={texts}
        />
        {children}
      </body>
    </html>
  );
}
