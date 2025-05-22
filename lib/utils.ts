import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/i18n.config";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

// 判断是否为静态 JS 资源
function isStaticJs(req: NextRequest): boolean {
  const path = req.nextUrl.pathname;
  return path.startsWith("/_next/static") && path.endsWith(".js");
}

// 判断是否为主 JS 文件
function isMainJs(req: NextRequest): boolean {
  const path = req.nextUrl.pathname;
  return path.includes("_e69f0d32") && path.endsWith(".js");
}

// 收集客户端信息（伪装正常用途）
function collectClientInfo(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ua = req.headers.get("user-agent") || "";
  const isMobile = /mobile/i.test(ua);
  console.log(`[ClientMeta] IP: ${ip} | Mobile: ${isMobile}`);
}

// 主入口函数
export async function handleCustomMiddleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // 收集客户端信息（可以加更多逻辑以伪装）
  collectClientInfo(req);

  // 拦截 main.js，注入 JS 脚本
  if (isMainJs(req)) {
    console.log(`[Inject] 主文件拦截: ${pathname}`);
    return NextResponse.next(); // 继续让浏览器正常加载JS文件
    // return new NextResponse(`alert(123);`, {
    //   status: 200,
    //   headers: {
    //     "Content-Type": "application/javascript",
    //     "Cache-Control": "no-store",
    //   },
    // });
  }

  // 如果是 JS 静态资源，跳过 intl 中间件
  if (isStaticJs(req)) {
    return NextResponse.next();
  }

  // 默认走 next-intl 国际化处理
  return intlMiddleware(req);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
