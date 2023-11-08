import React from 'react'

import PageSlider from '@/app/(fullscreen)/specialty/PageSlider'
import { getSpecialtysDetail } from '@/actions/specialty'

const SpecialtyPage = async () => {
  let data = ""
  const res = await getSpecialtysDetail()

  if (res.code === 200) {
    data = JSON.stringify(res.data)
  }

  return (
    <>
      <PageSlider data={data} />
    </>
  )
}

export default SpecialtyPage