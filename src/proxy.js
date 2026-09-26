import { NextResponse } from "next/server";
import {
  ADMIN_HEADER,
  ADMIN_HOME_PATH,
  ADMIN_LOGIN_PATH,
} from "@/lib/auth/constants";
import {
  getInternalLocalePath,
  getLocaleFromPathname,
  LOCALE_HEADER,
  shouldSkipLocaleRouting,
} from "@/lib/locale/routing";
import { copyResponseCookies, updateSession } from "@/lib/supabase/proxy";

function isAdminLoginPath(pathname) {
  return pathname === ADMIN_LOGIN_PATH;
}

function withAdminHeader(response, isAdminRoute) {
  if (isAdminRoute) {
    response.headers.set(ADMIN_HEADER, "1");
  }

  return response;
}

function finalizeResponse(sessionResponse, response, isAdminRoute) {
  copyResponseCookies(sessionResponse, response);
  return withAdminHeader(response, isAdminRoute);
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");

  const { response: sessionResponse, user } = await updateSession(request);

  if (isAdminRoute) {
    const isLoginPage = isAdminLoginPath(pathname);

    if (!user && !isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = ADMIN_LOGIN_PATH;
      if (pathname !== ADMIN_HOME_PATH) {
        url.searchParams.set("next", pathname);
      }
      return finalizeResponse(
        sessionResponse,
        NextResponse.redirect(url),
        true
      );
    }

    if (user && isLoginPage) {
      return finalizeResponse(
        sessionResponse,
        NextResponse.redirect(new URL(ADMIN_HOME_PATH, request.url)),
        true
      );
    }

    if (shouldSkipLocaleRouting(pathname)) {
      return finalizeResponse(sessionResponse, sessionResponse, true);
    }
  }

  if (shouldSkipLocaleRouting(pathname)) {
    return sessionResponse;
  }

  if (pathname === "/ko" || pathname.startsWith("/ko/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/ko" ? "/" : pathname.slice(3) || "/";
    return finalizeResponse(sessionResponse, NextResponse.redirect(url), false);
  }

  const locale = getLocaleFromPathname(pathname);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);

  if (locale === "en") {
    return finalizeResponse(
      sessionResponse,
      NextResponse.next({
        request: { headers: requestHeaders },
      }),
      false
    );
  }

  const rewritePath = getInternalLocalePath(pathname, "ko");
  const rewriteUrl = new URL(
    `${rewritePath}${request.nextUrl.search}`,
    request.url
  );

  return finalizeResponse(
    sessionResponse,
    NextResponse.rewrite(rewriteUrl, {
      request: { headers: requestHeaders },
    }),
    false
  );
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
