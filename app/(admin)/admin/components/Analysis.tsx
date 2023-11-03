"use client"
import React from 'react'

import { useAppSelector } from '@/redux/store'
import { countUsersByLast5Months, getRevenueForLast5Months } from '@/actions/admin'
import { ChartData } from 'chart.js'
import { backgroundColor, borderColor } from '@/lib/constant/ChartColor'
import VerticalBarChart from '@/components/chart/VerticalBarChart'

export default function Analysis() {
  const session = useAppSelector((state) => state.sessionReducer.value)
  const [monthRevenueData, setMonthRevenueData] = React.useState<ChartData<"bar", number[], unknown>>()

  React.useEffect(() => {
    const fetchRevenue = async () => {
      const monthRevenue = await getRevenueForLast5Months(session?.user.accessToken!)

      if (monthRevenue.code === 200 && monthRevenue.data) {
        setMonthRevenueData({
          labels: monthRevenue.data.map(item => item.month),
          datasets: [
            {
              label: "Doanh số",
              data: monthRevenue.data.map(item => item.totalAmount),
              backgroundColor: backgroundColor,
              borderColor: borderColor,
              borderWidth: 1,
            }
          ]
        })
      }
    }

    // const fetchUserAnalysis = async () => {
    //   const res = await countUsersByLast5Months(session?.user.accessToken!)
    // }

    if (session) {
      fetchRevenue()
      // fetchUserAnalysis()
    }
  }, [session])

  return (
    <>
      {
        monthRevenueData ? (
          <VerticalBarChart chartData={monthRevenueData} chartTitle='Doanh thu (5 tháng gần nhất)' />
        ) : "Không có dữ liệu"
      }
    </>
  )
}
