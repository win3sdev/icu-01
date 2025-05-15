'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Colors,
  TooltipItem,
} from 'chart.js'
import { Pie } from 'react-chartjs-2'

// 注册 Chart.js 组件
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Colors
)

// 定义图表颜色
const chartColors = [
  'rgba(255, 99, 132, 0.8)',
  'rgba(54, 162, 235, 0.8)',
  'rgba(255, 206, 86, 0.8)',
  'rgba(75, 192, 192, 0.8)',
  'rgba(153, 102, 255, 0.8)',
  'rgba(255, 159, 64, 0.8)',
  'rgba(255, 99, 255, 0.8)',
  'rgba(54, 162, 162, 0.8)',
  'rgba(255, 206, 206, 0.8)',
  'rgba(75, 192, 75, 0.8)',
]

interface ChartData {
  labels: string[]
  data: number[]
}

interface ChartsData {
  gradeData: ChartData
  holidaysData: ChartData
  startTimeData: ChartData
  endTimeData: ChartData
}

export default function ChartsPage() {
  const t = useTranslations('charts')
  const [data, setData] = useState<ChartsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/charts')
        const json = await response.json()
        if (json.error) throw new Error(json.error)
        setData(json)
      } catch (err) {
        console.error('Error fetching chart data:', err)
        setError('Failed to load chart data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="w-full py-8 px-4">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-neutral-200 border-t-blue-500"></div>
          <p className="mt-4 text-neutral-500">Loading charts...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="w-full py-8 px-4">
        <div className="text-center py-12 text-red-500">
          {error || 'No data available'}
        </div>
      </div>
    )
  }

  const chartOptions = {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 2000,
      easing: 'easeInOutQuart' as const
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle' as const
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold' as const
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context: TooltipItem<'pie'>) {
            const label = context.label || ''
            const value = context.raw as number
            const dataset = context.dataset
            const total = dataset.data.reduce((a: number, b: number) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ${value} (${percentage}%)`
          }
        }
      }
    }
  }

  const createChartData = (chartData: ChartData) => ({
    labels: chartData.labels,
    datasets: [
      {
        data: chartData.data,
        backgroundColor: chartColors.slice(0, chartData.data.length),
        borderColor: chartColors.map(color => color.replace('0.8', '1')),
        borderWidth: 1,
        hoverOffset: 20,
        hoverBorderWidth: 2,
      }
    ]
  })

  return (
    <div className="w-full py-8 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
      {/* 目前还没有具体图表需求，暂不考虑 */}
    </div>
    // <div className="w-full py-8 px-4 max-w-7xl mx-auto">
    //   <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
      
    //   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    //     {/* 年级占比图表 */}
    //     <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 shadow-lg hover:shadow-xl transition-shadow">
    //       <h2 className="text-xl font-semibold mb-4">{t('gradeDistribution')}</h2>
    //       <div className="w-3/4 mx-auto aspect-square">
    //         <Pie 
    //           data={createChartData(data.gradeData)}
    //           options={chartOptions}
    //         />
    //       </div>
    //       {/* <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
    //         <ul className="space-y-1">
    //           {data.gradeData.labels.map((label, index) => (
    //             <li key={label} className="flex items-center">
    //               <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: chartColors[index] }}></span>
    //               <span>{label}: {data.gradeData.data[index]} ({((data.gradeData.data[index] / data.gradeData.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%)</span>
    //             </li>
    //           ))}
    //         </ul>
    //       </div> */}
    //     </div>

    //     {/* 每月假期天数图表 */}
    //     <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 shadow-lg hover:shadow-xl transition-shadow">
    //       <h2 className="text-xl font-semibold mb-4">{t('monthlyHolidays')}</h2>
    //       <div className="w-3/4 mx-auto aspect-square">
    //         <Pie 
    //           data={createChartData(data.holidaysData)}
    //           options={chartOptions}
    //         />
    //       </div>
    //       {/* <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
    //         <ul className="space-y-1">
    //           {data.holidaysData.labels.map((label, index) => (
    //             <li key={label} className="flex items-center">
    //               <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: chartColors[index] }}></span>
    //               <span>{label}: {data.holidaysData.data[index]} ({((data.holidaysData.data[index] / data.holidaysData.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%)</span>
    //             </li>
    //           ))}
    //         </ul>
    //       </div> */}
    //     </div>

    //     {/* 上学时间图表 */}
    //     <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 shadow-lg hover:shadow-xl transition-shadow">
    //       <h2 className="text-xl font-semibold mb-4">{t('schoolStartTime')}</h2>
    //       <div className="w-3/4 mx-auto aspect-square">
    //         <Pie 
    //           data={createChartData(data.startTimeData)}
    //           options={chartOptions}
    //         />
    //       </div>
    //       {/* <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
    //         <ul className="space-y-1">
    //           {data.startTimeData.labels.map((label, index) => (
    //             <li key={label} className="flex items-center">
    //               <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: chartColors[index] }}></span>
    //               <span>{label}: {data.startTimeData.data[index]} ({((data.startTimeData.data[index] / data.startTimeData.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%)</span>
    //             </li>
    //           ))}
    //         </ul>
    //       </div> */}
    //     </div>

    //     {/* 放学时间图表 */}
    //     <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 shadow-lg hover:shadow-xl transition-shadow">
    //       <h2 className="text-xl font-semibold mb-4">{t('schoolEndTime')}</h2>
    //       <div className="w-3/4 mx-auto aspect-square">
    //         <Pie 
    //           data={createChartData(data.endTimeData)}
    //           options={chartOptions}
    //         />
    //       </div>
    //       {/* <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
    //         <ul className="space-y-1">
    //           {data.endTimeData.labels.map((label, index) => (
    //             <li key={label} className="flex items-center">
    //               <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: chartColors[index] }}></span>
    //               <span>{label}: {data.endTimeData.data[index]} ({((data.endTimeData.data[index] / data.endTimeData.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%)</span>
    //             </li>
    //           ))}
    //         </ul>
    //       </div> */}
    //     </div>
    //   </div>
    // </div>
  )
} 