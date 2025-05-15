import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n.config";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

// 配置匹配的路由
export const config = {
  // 匹配所有路由，除了api、_next、静态文件等
  matcher: ["/", "/(zh-CN|zh-TW|en)/:path*"],
};
