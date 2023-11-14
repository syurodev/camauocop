import React from 'react'

import { getDestinations } from '@/actions/tourisms'
import PageContent from './PageContent'

export const metadata = {
  title: 'Địa điểm du lịch',
  description: 'Địa điểm du lịch Cà Mau',
}

const TourismsPage: React.FC = async () => {

  const res = await getDestinations()

  return (
    res.code === 200 ? (
      <PageContent data={res.data || ""} />
    ) : (
      <p>Không có địa điểm du lịch</p>
    )
  )
}

export default TourismsPage