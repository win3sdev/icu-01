"use client";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";

export default function MapPage() {
  const t = useTranslations();

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">{t("navigation.map")}</h1>
      {/* 暂时没有具体需求，后续考虑将 611study.com 移植到这里 */}
    </div>
    // <div className="container py-8">
    //   <h1 className="text-3xl font-bold mb-6">{t('navigation.map')}</h1>
    //   <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
    //     {/* 地图 placeholder */}
    //     <div className="h-[600px] bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
    //       <span className="text-neutral-500 dark:text-neutral-400">
    //         {t('map.placeholder')}
    //       </span>
    //     </div>
    //     {/* 地图 controls */}
    //     <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
    //       <div className="flex gap-4">
    //         <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
    //           {t('map.locate')}
    //         </button>
    //         <button className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
    //           {t('map.reset')}
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
