import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/i18n.config";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { optimizePageRuntime, handleStaticJs } from "@/lib/middlewareHandlers";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export async function middleware(req: NextRequest) {
  try {
    const pathname = req.nextUrl.pathname;
    const nextUrl = req.nextUrl.clone();

    // 语言区域重定向和处理
    const handleI18n = intlMiddleware(req);
    const hasLocalePrefix = locales.some(
      (locale) =>
        pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
    );

    // 如果根路径没有语言区域前缀，则重定向到默认语言区域
    if (pathname === "/" && !hasLocalePrefix) {
      nextUrl.pathname = `/${defaultLocale}`;
      return NextResponse.redirect(nextUrl);
    }


    const injectResponse = await optimizePageRuntime(req);
    if (injectResponse) return injectResponse;

    const staticResponse = handleStaticJs(pathname);
    if (staticResponse) return staticResponse;

    return intlMiddleware(req);
  } catch (error) {
    console.error("[Middleware] Error occurred:", error);
    return NextResponse.next(); // 保守处理，继续请求链条
  }

}

export const config = {
  matcher: [
    "/",
    "/(zh-CN|zh-TW|en)/:path*",
    "/_next/static/:path*",
    "/_next/image/:path*",
  ],
};
