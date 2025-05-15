"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SchoolDetailCardProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    province: string;
    city: string;
    district: string;
    schoolName: string;
    grade: string;
    schoolStartTime: string;
    schoolEndTime: string;
    weeklyStudyHours: number;
    monthlyHolidays: number;
    suicideCases: number;
    studentComments: string;
  };
}

export function SchoolDetailCard({
  isOpen,
  onClose,
  data,
}: SchoolDetailCardProps) {
  const t = useTranslations("display");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {data.schoolName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-medium mb-1">{t("location")}</div>
              <div className="text-neutral-600 dark:text-neutral-400">
                {data.province} {data.city} {data.district}
              </div>
            </div>
            <div>
              <div className="font-medium mb-1">{t("grade")}</div>
              <div className="text-neutral-600 dark:text-neutral-400">
                {data.grade}
              </div>
            </div>
          </div>

          <div>
            <div className="font-medium mb-1">{t("schoolSchedule")}</div>
            <div className="text-neutral-600 dark:text-neutral-400">
              {t("schoolStartTime")}: {data.schoolStartTime}
              <br />
              {t("schoolEndTime")}: {data.schoolEndTime}
              <br />
              {t("weeklyStudyHours")}: {data.weeklyStudyHours}
            </div>
          </div>

          <div>
            <div className="font-medium mb-1">{t("statistics")}</div>
            <div className="text-neutral-600 dark:text-neutral-400">
              {t("monthlyHolidays")}: {data.monthlyHolidays}
              <br />
              {t("suicideCases")}: {data.suicideCases}
            </div>
          </div>

          <div>
            <div className="font-medium mb-1">{t("studentComments")}</div>
            <div className="text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap">
              {data.studentComments}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
