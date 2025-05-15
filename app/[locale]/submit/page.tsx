"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";
import { useEffect } from "react";

// 中国省份列表
const provinces = [
  "北京市",
  "天津市",
  "河北省",
  "山西省",
  "内蒙古自治区",
  "辽宁省",
  "吉林省",
  "黑龙江省",
  "上海市",
  "江苏省",
  "浙江省",
  "安徽省",
  "福建省",
  "江西省",
  "山东省",
  "河南省",
  "湖北省",
  "湖南省",
  "广东省",
  "广西壮族自治区",
  "海南省",
  "重庆市",
  "四川省",
  "贵州省",
  "云南省",
  "西藏自治区",
  "陕西省",
  "甘肃省",
  "青海省",
  "宁夏回族自治区",
  "新疆维吾尔自治区",
  "台湾省",
  "香港特别行政区",
  "澳门特别行政区",
];

export default function SubmitPage() {
  const mouseDataRef = useRef<string[]>([]);
  useEffect(() => {
    let lastTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime > 100) {
        // 每100ms记录一次
        mouseDataRef.current.push(`move:${e.clientX},${e.clientY},${now}`);
        lastTime = now;
      }
    };

    const handleClick = (e: MouseEvent) => {
      mouseDataRef.current.push(
        `click:${e.clientX},${e.clientY},${Date.now()}`
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  // 多语言
  const t = useTranslations("form");

  const [formData, setFormData] = useState({
    province: "",
    city: "",
    district: "",
    schoolName: "",
    grade: "",
    schoolStartTime: "",
    schoolEndTime: "",
    weeklyStudyHours: "",
    monthlyHolidays: "",
    suicideCases: "",
    studentComments: "",
    mouseTrack: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("idle");

    if (!recaptchaToken) {
      toast.error("请先通过验证码验证", { position: "top-center" });
      return;
    }

    setIsSubmitting(true);

    // 将鼠标轨迹数据合并到 formData
    const trackData = mouseDataRef.current.join(";");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          mouseTrack: trackData,
          recaptchaToken,
          // 不需要传递 status 字段，后端会处理
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus("success");
        toast.success(t("success"), { duration: 3000, position: "top-center" });
        setFormData({
          province: "",
          city: "",
          district: "",
          schoolName: "",
          grade: "",
          schoolStartTime: "",
          schoolEndTime: "",
          weeklyStudyHours: "",
          monthlyHolidays: "",
          suicideCases: "",
          studentComments: "",
          mouseTrack: "",
        });
        setRecaptchaToken(null); // 成功后清空 token
        recaptchaRef.current?.reset();
      } else {
        setSubmitStatus("error");
        toast.error(t("error"), { duration: 3000, position: "top-center" });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
      toast.error(t("error"), { duration: 3000, position: "top-center" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  return (
    <div className="container py-8">
      {/* <div className="container py-8 w-full mx-auto"> */}
      <div className="">
        <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          {t("description")}
        </p>

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          {/* 省份 */}
          <div>
            <label
              htmlFor="province"
              className="block text-sm font-medium mb-1"
            >
              {t("province.label")}
            </label>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              {t("province.description")}
            </p>
            <select
              id="province"
              name="province"
              value={formData.province}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">{t("province.placeholder")}</option>
              {provinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>

          {/* 城市 */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-1">
              {t("city.label")}
            </label>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              {t("city.description")}
            </p>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder={t("city.placeholder")}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 区县 */}
          <div>
            <label
              htmlFor="district"
              className="block text-sm font-medium mb-1"
            >
              {t("district.label")}
            </label>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              {t("district.description")}
            </p>
            <input
              type="text"
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
              placeholder={t("district.placeholder")}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 学校名称 */}
          <div>
            <label
              htmlFor="schoolName"
              className="block text-sm font-medium mb-1"
            >
              {t("schoolName.label")}
            </label>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              {t("schoolName.description")}
            </p>
            <input
              type="text"
              id="schoolName"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              placeholder={t("schoolName.placeholder")}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 年级 */}
          <div>
            <label htmlFor="grade" className="block text-sm font-medium mb-1">
              {t("grade.label")}
            </label>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              {t("grade.description")}
            </p>
            <input
              type="text"
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              placeholder={t("grade.placeholder")}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 上学时间 */}
          <div>
            <label
              htmlFor="schoolStartTime"
              className="block text-sm font-medium mb-1"
            >
              {t("schoolStartTime.label")}
            </label>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              {t("schoolStartTime.description")}
            </p>
            <input
              type="time"
              id="schoolStartTime"
              name="schoolStartTime"
              value={formData.schoolStartTime}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 放学时间 */}
          <div>
            <label
              htmlFor="schoolEndTime"
              className="block text-sm font-medium mb-1"
            >
              {t("schoolEndTime.label")}
            </label>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              {t("schoolEndTime.description")}
            </p>
            <input
              type="time"
              id="schoolEndTime"
              name="schoolEndTime"
              value={formData.schoolEndTime}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 每周在校学习小时数 */}
          <div>
            <label
              htmlFor="weeklyStudyHours"
              className="block text-sm font-medium mb-1"
            >
              {t("weeklyStudyHours.label")}
            </label>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              {t("weeklyStudyHours.description")}
            </p>
            <input
              type="number"
              id="weeklyStudyHours"
              name="weeklyStudyHours"
              value={formData.weeklyStudyHours}
              onChange={handleChange}
              placeholder={t("weeklyStudyHours.placeholder")}
              min="0"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 每月假期天数 */}
          <div>
            <label
              htmlFor="monthlyHolidays"
              className="block text-sm font-medium mb-1"
            >
              {t("monthlyHolidays.label")}
            </label>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              {t("monthlyHolidays.description")}
            </p>
            <input
              type="number"
              id="monthlyHolidays"
              name="monthlyHolidays"
              value={formData.monthlyHolidays}
              onChange={handleChange}
              placeholder={t("monthlyHolidays.placeholder")}
              min="0"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 24年学生自杀数 */}
          <div>
            <label
              htmlFor="suicideCases"
              className="block text-sm font-medium mb-1"
            >
              {t("suicideCases.label")}
            </label>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              {t("suicideCases.description")}
            </p>
            <input
              type="number"
              id="suicideCases"
              name="suicideCases"
              value={formData.suicideCases}
              onChange={handleChange}
              placeholder={t("suicideCases.placeholder")}
              min="0"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 学生的评论 */}
          <div>
            <label
              htmlFor="studentComments"
              className="block text-sm font-medium mb-1"
            >
              {t("studentComments.label")}
            </label>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              {t("studentComments.description")}
            </p>
            <textarea
              id="studentComments"
              name="studentComments"
              value={formData.studentComments}
              onChange={handleChange}
              placeholder={t("studentComments.placeholder")}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* reCAPTCHA 不做隐式状态 */}
          <div className="pt-4">
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              ref={recaptchaRef}
              onChange={onRecaptchaChange}
            />
          </div>

          {/* 提交按钮 */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? t("submitting") : t("submit")}
            </button>
          </div>

          {/* 提交状态提示 */}
          {submitStatus === "success" && (
            <p className="text-green-500 text-center">{t("success")}</p>
          )}
          {submitStatus === "error" && (
            <p className="text-red-500 text-center">{t("error")}</p>
          )}
        </form>
      </div>
    </div>
  );
}
