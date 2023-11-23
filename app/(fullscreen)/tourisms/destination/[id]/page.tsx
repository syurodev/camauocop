import React from 'react'
import { redirect } from 'next/navigation'

import { getDestinations, getTourisms } from '@/actions/tourisms';
import ParallaxPage from './ParallaxPage';

type IProps = {
  params: {
    id: string;
  };
};

const DestinationPage: React.FC<IProps> = async ({ params }) => {
  const destinations = await getDestinations(params.id)

  if (destinations.code !== 200) {
    redirect("/tourisms")
  }

  const toursData = await getTourisms({
    destinationId: params.id,
    status: 'accepted'
  })

  return (
    <>
      <ParallaxPage destinationData={destinations.data} toursData={toursData.data} />
    </>
  )
}

export default DestinationPage