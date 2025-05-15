"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  PlusCircleIcon,
  TableCellsIcon,
  ChartBarIcon,
  MapIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import ThemeSwitcher from "../ThemeSwitcher";
import LanguageSwitcher from "../LanguageSwitcher";
import { GithubIcon } from "../Icons";

export default function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 当路由变化时关闭菜单
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // 防止菜单打开时页面滚动
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const navigationLinks = [
    {
      href: `/${locale}/submit`,
      label: t("navigation.submit"),
      icon: PlusCircleIcon,
    },
    {
      href: `/${locale}/display`,
      label: t("navigation.display"),
      icon: TableCellsIcon,
    },
    {
      href: `/${locale}/charts`,
      label: t("navigation.charts"),
      icon: ChartBarIcon,
    },
    {
      href: `/${locale}/map`,
      label: t("navigation.map"),
      icon: MapIcon,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8"> */}
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link
            href={`/${locale}`}
            className="mr-6 flex items-center space-x-3 group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25 transition-transform duration-200 group-hover:scale-110">
              <GlobeAltIcon className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 mr-16">
              {t("site.title")}
            </span>
          </Link>
          {/* 桌面端导航 */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-bold transition-all duration-200 hover:text-foreground/80 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="https://github.com/Li-DAO-Dev/project-restructure"
            target="_blank"
            rel="noreferrer"
            className="flex w-9 h-9 items-center justify-center rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors"
          >
            <GithubIcon className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <ThemeSwitcher />
          <LanguageSwitcher />
          {/* 移动端菜单按钮 */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>
      </div>

      {/* 移动端菜单遮罩层 */}
      <div
        className={`fixed inset-0 z-50 md:hidden bg-black/40 backdrop-blur-sm transform transition-all duration-300 ease-in-out ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        {/* 移动端菜单面板 */}
        <div
          className={`absolute right-4 top-[4.5rem] w-64 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 菜单内容 */}
          <nav className="py-2 flex flex-col">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors flex items-center space-x-3"
              >
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
