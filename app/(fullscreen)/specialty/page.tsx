import React from 'react'

import PageSlider from '@/app/(fullscreen)/specialty/PageSlider'
import { getSpecialtysDetail } from '@/actions/specialty'

const SpecialtyPage = async () => {
  const res = await getSpecialtysDetail()

  return (
    <>
      <PageSlider data={res.data || ""} />
    </>
  )
}

export default SpecialtyPage