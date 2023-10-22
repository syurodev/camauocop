"use client"
import { ChartData } from 'chart.js'
import React from 'react'

import { getSalesForLast5Months, topProduct, topSellingProductTypes } from '@/actions/shop'
import DoughnutChart from '@/components/chart/DoughnutChart'
import { backgroundColor, borderColor } from '@/lib/constant/ChartColor'
import toast from 'react-hot-toast'
import VerticalBarChart from '@/components/chart/VerticalBarChart'
import { Skeleton } from '@nextui-org/react'

type IProps = {
  shopId: string,
  accessToken: string
}

const Analysis: React.FC<IProps> = ({ shopId, accessToken }) => {
  const [topProductData, settopProductData] = React.useState<ChartData<"doughnut", number[], unknown>>()
  const [topProductLoading, settopProductLoading] = React.useState<boolean>(false)

  const [topProductTypeData, settopProductTypeData] = React.useState<ChartData<"doughnut", number[], unknown>>()
  const [topProductTypeLoading, settopProductTypeLoading] = React.useState<boolean>(false)

  const [monthSalesData, setMonthSalesData] = React.useState<ChartData<"bar", number[], unknown>>()
  const [monthSalesLoading, setMonthSalesLoading] = React.useState<boolean>(false)

  React.useEffect(() => {
    const fetchApi = async () => {
      settopProductLoading(true)
      setMonthSalesLoading(true)
      settopProductTypeLoading(true)

      const sellingRes: TopSellingProductResponse = await topProduct(shopId, accessToken)
      if (sellingRes.code === 200 && sellingRes.data && sellingRes.data.length > 0) {
        settopProductData({
          labels: sellingRes.data.map(item => item.productName),
          datasets: [
            {
              label: "Top sản phẩm bán chạy",
              data: sellingRes.data.map(item => item.weightSold),
              backgroundColor: backgroundColor,
              borderColor: borderColor,
              borderWidth: 1,
            }
          ]
        })
        settopProductLoading(false)
      } else if (sellingRes.code === 400 || sellingRes.code === 500) {
        settopProductLoading(false)
        toast.error(sellingRes.message)
      } else {
        settopProductLoading(false)
      }

      const topProductTypeRes = await topSellingProductTypes(shopId, accessToken)
      if (topProductTypeRes.code === 200 && topProductTypeRes.data && topProductTypeRes.data.length > 0) {
        settopProductTypeData({
          labels: topProductTypeRes.data.map(item => item.name),
          datasets: [
            {
              label: "Top loại sản phẩm bán chạy",
              data: topProductTypeRes.data.map(item => item.sold),
              backgroundColor: backgroundColor,
              borderColor: borderColor,
              borderWidth: 1,
            }
          ]
        })
        settopProductTypeLoading(false)
      } else {
        toast.error(topProductTypeRes.message)
        settopProductTypeLoading(false)
      }

      const monthSales = await getSalesForLast5Months(shopId, accessToken)
      if (monthSales.code === 200 && monthSales.data && monthSales.data.length > 0) {

        setMonthSalesData({
          labels: monthSales.data.map(item => item.month),
          datasets: [
            {
              label: "Doanh số",
              data: monthSales.data.map(item => item.totalAmount),
              backgroundColor: backgroundColor,
              borderColor: borderColor,
              borderWidth: 1,
            }
          ]
        })
        setMonthSalesLoading(false)
      } else {
        setMonthSalesLoading(false)
        toast.error(monthSales.message)
      }
    }
    fetchApi()
  }, [shopId, accessToken])
  return (
    <div className='flex flex-col gap-5 justify-center'>
      <div className='flex flex-col gap-5 md:!flex-row justify-between items-center w-full'>
        {
          topProductLoading ? (
            <Skeleton className="flex rounded-full w-[500px] h-[500px]" />
          ) : topProductData ? (
            <DoughnutChart chartData={topProductData} chartTitle='Top sản phẩm bán chạy trong tháng (tính theo kg)' />
          ) : "Không có dữ liệu"
        }

        {
          topProductTypeLoading ? (
            <Skeleton className="flex rounded-full w-[500px] h-[500px]" />
          ) : topProductTypeData ? (
            <DoughnutChart chartData={topProductTypeData} chartTitle='Top loại sản phẩm bán chạy trong tháng (tính theo kg)' />
          ) : "Không có dữ liệu"
        }
      </div>
      {
        monthSalesLoading ? (
          <Skeleton className="flex rounded-md w-full h-[500px]" />
        ) : monthSalesData ? (
          <VerticalBarChart chartData={monthSalesData} chartTitle='Doanh thu (5 tháng gần nhất)' />
        ) : "Không có dữ liệu"
      }
    </div>
  )
}

export default React.memo(Analysis)