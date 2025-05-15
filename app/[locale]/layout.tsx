import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { locales } from "@/i18n.config";
import "@/app/globals.css";
import Link from "next/link";

// API健康检测
import ApiHealthChecker from "@/app/components/ApiHealthChecker";
// 主题切换组件
import ThemeProvider from "@/components/providers/theme-provider";
// 页面Header组件
import Header from "@/app/components/Header";
// 用户鼠标移动轨迹检查
import MouseTracking from "@/app/components/MouseTracking";

// 字体
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 动态 metadata
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages(locale);

  return {
    title: messages.metaTitle,
    description: messages.metaDescription,
    icons: {
      icon: "/logo.svg",
    },
  };
}

// 语言路径生成
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// 加载翻译
async function getMessages(locale: string) {
  try {
    return (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Missing translation for locale: ${locale}`, error);
    notFound();
  }
}

type Props = {
  children: React.ReactNode;
  params: { locale: (typeof locales)[number] };
};

// LocaleLayout 组件
export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // 验证 locale 是否在支持列表中
  if (!locales.includes(locale)) {
    notFound();
  }

  // 加载对应语言的翻译内容
  const [messages] = await Promise.all([getMessages(locale)]);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased selection:bg-blue-500/10 selection:text-blue-500 dark:selection:bg-blue-400/10 dark:selection:text-blue-400`}
      >
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="relative flex min-h-screen flex-col">
              {/* <ApiHealthChecker /> */}
              {/* <MouseTracking /> */}
              <Header />
              <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* <div className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8"> */}
                <main className="w-full prose prose-neutral dark:prose-invert max-w-none prose-headings:font-normal prose-h1:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-img:rounded-xl prose-a:text-blue-500 hover:prose-a:text-blue-600 dark:prose-a:text-blue-400 dark:hover:prose-a:text-blue-300">
                  {children}
                </main>
              </div>
              <footer className="w-full border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      © 2025 Li-DAO. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-4">
                      <Link
                        href={`/${locale}`}
                        className="text-sm text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-300 transition-colors"
                      >
                        Home
                      </Link>
                      <Link
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-300 transition-colors"
                      >
                        GitHub
                      </Link>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
