"use client";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-4">{t("site.title")}</h1>
      <p className="text-lg text-muted-foreground">{t("site.description")}</p>
    </div>
  );
}
