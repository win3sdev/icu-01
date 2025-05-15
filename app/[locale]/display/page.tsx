"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { SchoolDetailCard } from "@/app/components/SchoolDetailCard";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

interface SchoolData {
  id: number;
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
  createdAt: string;
}

interface PaginationData {
  total: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

interface FilterState {
  province: string;
  city: string;
  district: string;
  schoolName: string;
  grade: string;
  schoolStartTime: string;
  schoolEndTime: string;
  weeklyStudyHours: string;
  monthlyHolidays: string;
  suicideCases: string;
  studentComments: string;
}

export default function DisplayPage() {
  const t = useTranslations("display");
  const [selectedSchool, setSelectedSchool] = useState<SchoolData | null>(null);
  const [data, setData] = useState<SchoolData[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    pageSize: 25,
    currentPage: 1,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
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
  });
  const [mobileSearch, setMobileSearch] = useState("");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    province: "",
    city: "",
    grade: "",
    weeklyStudyHours: "",
    monthlyHolidays: "",
    suicideCases: "",
  });

  // 构建查询参数
  const buildQueryString = (page: number) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());

    // 移动端搜索
    if (mobileSearch) {
      params.append("schoolName", mobileSearch);
    }

    // 移动端高级搜索
    if (showAdvancedSearch) {
      if (advancedFilters.province)
        params.append("province", advancedFilters.province);
      if (advancedFilters.city) params.append("city", advancedFilters.city);
      if (advancedFilters.grade) params.append("grade", advancedFilters.grade);
      if (advancedFilters.weeklyStudyHours)
        params.append("weeklyStudyHours", advancedFilters.weeklyStudyHours);
      if (advancedFilters.monthlyHolidays)
        params.append("monthlyHolidays", advancedFilters.monthlyHolidays);
      if (advancedFilters.suicideCases)
        params.append("suicideCases", advancedFilters.suicideCases);
      return params.toString();
    }

    // PC端筛选
    if (filters.province) params.append("province", filters.province);
    if (filters.city) params.append("city", filters.city);
    if (filters.district) params.append("district", filters.district);
    if (filters.schoolName) params.append("schoolName", filters.schoolName);
    if (filters.grade) params.append("grade", filters.grade);
    if (filters.schoolStartTime)
      params.append("schoolStartTime", filters.schoolStartTime);
    if (filters.schoolEndTime)
      params.append("schoolEndTime", filters.schoolEndTime);
    if (filters.weeklyStudyHours)
      params.append("weeklyStudyHours", filters.weeklyStudyHours);
    if (filters.monthlyHolidays)
      params.append("monthlyHolidays", filters.monthlyHolidays);
    if (filters.suicideCases)
      params.append("suicideCases", filters.suicideCases);
    if (filters.studentComments)
      params.append("studentComments", filters.studentComments);

    return params.toString();
  };

  // 获取数据的函数
  const fetchData = async (page: number) => {
    setIsLoading(true);
    try {
      const queryString = buildQueryString(page);
      const res = await fetch(`/api/schools?${queryString}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      console.log(json.error);
      setData(json.data);
      setPagination(json.pagination);
    } catch (err) {
      console.error("Error fetching school data:", err);
      setError("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  // 在组件挂载时获取数据
  useEffect(() => {
    fetchData(1);
  }, []);

  // 页码改变处理函数
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchData(newPage);
    }
  };

  // 处理筛选条件变化
  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // 应用筛选条件
  const applyFilters = () => {
    fetchData(1);
  };

  // 处理高级筛选条件变化
  const handleAdvancedFilterChange = (field: string, value: string) => {
    setAdvancedFilters((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="w-full py-8 px-4">
        <div className="text-center py-12 text-neutral-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-8 px-4">
        <div className="text-center py-12 text-red-500">{error}</div>
      </div>
    );
  }

  const startItem = (pagination.currentPage - 1) * pagination.pageSize + 1;
  const endItem = Math.min(
    startItem + pagination.pageSize - 1,
    pagination.total
  );

  return (
    <div className="w-full py-8 px-2 max-w-[1920px] mx-auto">
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

      {/* 移动端搜索框 */}
      <div className="md:hidden space-y-4">
        <div className="relative">
          <input
            type="text"
            value={mobileSearch}
            onChange={(e) => {
              setMobileSearch(e.target.value);
              if (e.target.value === "") {
                fetchData(1);
              }
            }}
            placeholder={t("schoolName")}
            className="w-full px-4 py-2 pr-24 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
            <button
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              className="p-1 rounded border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
            >
              {showAdvancedSearch ? (
                <ChevronUpIcon className="w-5 h-5" />
              ) : (
                <ChevronDownIcon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => fetchData(1)}
              className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              {t("filter.apply")}
            </button>
          </div>
        </div>

        {/* 高级搜索面板 */}
        {showAdvancedSearch && (
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("province")}
                </label>
                <input
                  type="text"
                  value={advancedFilters.province}
                  onChange={(e) =>
                    handleAdvancedFilterChange("province", e.target.value)
                  }
                  placeholder={t("filter.placeholder")}
                  className="w-full px-3 py-1.5 text-sm rounded border border-neutral-200 dark:border-neutral-800 bg-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("city")}
                </label>
                <input
                  type="text"
                  value={advancedFilters.city}
                  onChange={(e) =>
                    handleAdvancedFilterChange("city", e.target.value)
                  }
                  placeholder={t("filter.placeholder")}
                  className="w-full px-3 py-1.5 text-sm rounded border border-neutral-200 dark:border-neutral-800 bg-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("grade")}
                </label>
                <input
                  type="text"
                  value={advancedFilters.grade}
                  onChange={(e) =>
                    handleAdvancedFilterChange("grade", e.target.value)
                  }
                  placeholder={t("filter.placeholder")}
                  className="w-full px-3 py-1.5 text-sm rounded border border-neutral-200 dark:border-neutral-800 bg-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("weeklyStudyHours")}
                </label>
                <input
                  type="number"
                  value={advancedFilters.weeklyStudyHours}
                  onChange={(e) =>
                    handleAdvancedFilterChange(
                      "weeklyStudyHours",
                      e.target.value
                    )
                  }
                  placeholder={t("filter.placeholder")}
                  className="w-full px-3 py-1.5 text-sm rounded border border-neutral-200 dark:border-neutral-800 bg-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("monthlyHolidays")}
                </label>
                <input
                  type="number"
                  value={advancedFilters.monthlyHolidays}
                  onChange={(e) =>
                    handleAdvancedFilterChange(
                      "monthlyHolidays",
                      e.target.value
                    )
                  }
                  placeholder={t("filter.placeholder")}
                  className="w-full px-3 py-1.5 text-sm rounded border border-neutral-200 dark:border-neutral-800 bg-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("suicideCases")}
                </label>
                <input
                  type="number"
                  value={advancedFilters.suicideCases}
                  onChange={(e) =>
                    handleAdvancedFilterChange("suicideCases", e.target.value)
                  }
                  placeholder={t("filter.placeholder")}
                  className="w-full px-3 py-1.5 text-sm rounded border border-neutral-200 dark:border-neutral-800 bg-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setAdvancedFilters({
                    province: "",
                    city: "",
                    grade: "",
                    weeklyStudyHours: "",
                    monthlyHolidays: "",
                    suicideCases: "",
                  });
                  fetchData(1);
                }}
                className="px-3 py-1.5 text-sm rounded border border-neutral-200 dark:border-neutral-800 hover:border-red-500 dark:hover:border-red-500 transition-colors"
              >
                {t("filter.clear")}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* PC端表格视图
            数据渲染并非采用传统的 HTML table 元素，这是为了在用户切换至移动端时，能够更灵活地调整布局和优化展示效果
        */}
        <div className="hidden md:block">
          {/* 表头 */}
          <div className="grid grid-cols-12 gap-2 p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg font-bold text-sm">
            <div>{t("province")}</div>
            <div>{t("city")}</div>
            <div>{t("district")}</div>
            <div>{t("schoolName")}</div>
            <div>{t("grade")}</div>
            <div>{t("schoolStartTime")}</div>
            <div>{t("schoolEndTime")}</div>
            <div>{t("weeklyStudyHours")}</div>
            <div>{t("monthlyHolidays")}</div>
            <div>{t("suicideCases")}</div>
            <div>{t("studentComments")}</div>
            <div>{t("viewDetails")}</div>
          </div>

          {/* 筛选行 */}
          <div className="grid grid-cols-12 gap-2 p-2 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <div>
              <input
                type="text"
                value={filters.province}
                onChange={(e) => handleFilterChange("province", e.target.value)}
                placeholder={t("filter.placeholder")}
                className="w-full px-2 py-1 text-sm rounded border border-neutral-200 dark:border-neutral-800 bg-transparent"
              />
            </div>
            <div>
              <input
                type="text"
                value={filters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
                placeholder={t("filter.placeholder")}
                className="w-full px-2 py-1 text-sm rounded border border-neutral-200 dark:border-neutral-800 bg-transparent"
              />
            </div>
            <div>
              <input
                type="text"
                value={filters.district}
                onChange={(e) => handleFilterChange("district", e.target.value)}
                placeholder={t("filter.placeholder")}
                className="w-full px-2 py-1 text-sm rounded border border-neutral-200 dark:border-neutral-800 bg-transparent"
              />
            </div>
            <div>
              <input
                type="text"
                value={filters.schoolName}
                onChange={(e) =>
                  handleFilterChange("schoolName", e.target.value)
                }
                placeholder={t("filter.placeholder")}
                className="w-full px-2 py-1 text-sm rounded border border-neutral-200 dark:border-neutral-800 bg-transparent"
              />
            </div>
            <div>
              <input
                type="text"
                value={filters.grade}
                onChange={(e) => handleFilterChange("grade", e.target.value)}
                placeholder={t("filter.placeholder")}
                className="w-full px-2 py-1 text-sm rounded border border-neutral-200 dark:border-neutral-800 bg-transparent"
              />
            </div>
            <div>
              <input
                type="time"
                value={filters.schoolStartTime}
                onChange={(e) =>
                  handleFilterChange("schoolStartTime", e.target.value)
                }
                className="w-full px-2 py-1 text-sm rounded border border-neutral-200 dark:border-neutral-800 bg-transparent"
              />
            </div>
            <div>
              <input
                type="time"
                value={filters.schoolEndTime}
                onChange={(e) =>
                  handleFilterChange("schoolEndTime", e.target.value)
                }
                className="w-full px-2 py-1 text-sm rounded border border-neutral-200 dark:border-neutral-800 bg-transparent"
              />
            </div>
            <div>
              <input
                type="number"
                value={filters.weeklyStudyHours}
                onChange={(e) =>
                  handleFilterChange("weeklyStudyHours", e.target.value)
                }
                placeholder={t("filter.placeholder")}
                className="w-full px-2 py-1 text-sm rounded border border-neutral-200 dark:border-neutral-800 bg-transparent"
              />
            </div>
            <div>
              <input
                type="number"
                value={filters.monthlyHolidays}
                onChange={(e) =>
                  handleFilterChange("monthlyHolidays", e.target.value)
                }
                placeholder={t("filter.placeholder")}
                className="w-full px-2 py-1 text-sm rounded border border-neutral-200 dark:border-neutral-800 bg-transparent"
              />
            </div>
            <div>
              <input
                type="number"
                value={filters.suicideCases}
                onChange={(e) =>
                  handleFilterChange("suicideCases", e.target.value)
                }
                placeholder={t("filter.placeholder")}
                className="w-full px-2 py-1 text-sm rounded border border-neutral-200 dark:border-neutral-800 bg-transparent"
              />
            </div>
            <div>
              <input
                type="text"
                value={filters.studentComments}
                onChange={(e) =>
                  handleFilterChange("studentComments", e.target.value)
                }
                placeholder={t("filter.placeholder")}
                className="w-full px-2 py-1 text-sm rounded border border-neutral-200 dark:border-neutral-800 bg-transparent"
              />
            </div>
            <div>
              <button
                onClick={applyFilters}
                className="w-full px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                {t("filter.apply")}
              </button>
            </div>
          </div>

          {/* PC端数据行 */}
          {data.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-12 gap-2 p-2 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <div className="truncate">{item.province}</div>
              <div className="truncate">{item.city}</div>
              <div className="truncate">{item.district}</div>
              <div className="truncate">{item.schoolName}</div>
              <div className="truncate">{item.grade}</div>
              <div className="truncate">{item.schoolStartTime}</div>
              <div className="truncate">{item.schoolEndTime}</div>
              <div className="truncate">{item.weeklyStudyHours}</div>
              <div className="truncate">{item.monthlyHolidays}</div>
              <div className="truncate">{item.suicideCases}</div>
              <div className="truncate">{item.studentComments}</div>
              <div>
                <button
                  onClick={() => setSelectedSchool(item)}
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                  {t("viewDetails")}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 移动端卡片视图 */}
        <div className="md:hidden space-y-4">
          {data.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-lg">{item.schoolName}</div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    {item.city} | {item.grade}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSchool(item)}
                  className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  {t("viewDetails")}
                </button>
              </div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                {new Date(item.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {data.length === 0 && (
          <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
            {t("noData")}
          </div>
        )}

        {/* 分页控件 */}
        {data.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              {t("pagination.showing", {
                start: startItem,
                end: endItem,
                total: pagination.total,
              })}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-3 py-1 rounded border border-neutral-200 dark:border-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
              >
                {t("pagination.prev")}
              </button>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {t("pagination.page", { page: pagination.currentPage })}{" "}
                {t("pagination.of", { total: pagination.totalPages })}
              </span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-1 rounded border border-neutral-200 dark:border-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
              >
                {t("pagination.next")}
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedSchool && (
        <SchoolDetailCard
          isOpen={!!selectedSchool}
          onClose={() => setSelectedSchool(null)}
          data={selectedSchool}
        />
      )}
    </div>
  );
}
