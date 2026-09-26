import { NextResponse } from "next/server";
import {
  getInternalLocalePath,
  getLocaleFromPathname,
  LOCALE_HEADER,
  shouldSkipLocaleRouting,
} from "@/lib/locale/routing";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (shouldSkipLocaleRouting(pathname)) {
    return NextResponse.next();
  }

  if (pathname === "/ko" || pathname.startsWith("/ko/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/ko" ? "/" : pathname.slice(3) || "/";
    return NextResponse.redirect(url);
  }

  const locale = getLocaleFromPathname(pathname);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);

  if (locale === "en") {
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  const rewritePath = getInternalLocalePath(pathname, "ko");
  const rewriteUrl = new URL(
    `${rewritePath}${request.nextUrl.search}`,
    request.url
  );

  return NextResponse.rewrite(rewriteUrl, {
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
