"use client"
import { ChartData } from 'chart.js'
import React from 'react'

import { getSalesForLast5Months, topProduct, topSellingProductTypes } from '@/actions/shop'
import DoughnutChart from '@/components/chart/DoughnutChart'
import { backgroundColor, borderColor } from '@/lib/constant/ChartColor'
import toast from 'react-hot-toast'
import VerticalBarChart from '@/components/chart/VerticalBarChart'

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

      if (sellingRes.code === 200 && sellingRes.data) {
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
      } else {
        settopProductLoading(false)
        toast.error(sellingRes.message)
      }

      const topProductTypeRes = await topSellingProductTypes(shopId, accessToken)

      if (topProductTypeRes.code === 200 && topProductTypeRes.data) {
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
      if (monthSales.code === 200 && monthSales.data) {

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
    <div className='flex flex-col gap-5'>
      <div className='flex flex-col gap-5 md:flex-row justify-between w-full'>
        {
          topProductLoading ? (
            <></>
          ) : topProductData ? (
            <DoughnutChart chartData={topProductData} chartTitle='Top sản phẩm bán chạy trong tháng (tính theo kg)' />
          ) : "Không có dữ liệu"
        }

        {
          topProductTypeLoading ? (
            <></>
          ) : topProductTypeData ? (
            <DoughnutChart chartData={topProductTypeData} chartTitle='Top loại sản phẩm bán chạy trong tháng (tính theo kg)' />
          ) : "Không có dữ liệu"
        }
      </div>
      {
        monthSalesLoading ? (
          <></>
        ) : monthSalesData ? (
          <VerticalBarChart chartData={monthSalesData} chartTitle='Doanh thu' />
        ) : "Không có dữ liệu"
      }
    </div>
  )
}

export default React.memo(Analysis)