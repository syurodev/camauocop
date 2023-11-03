"use client"
import React from 'react'
import { Tab, Tabs } from '@nextui-org/react'
import { MdOutlineTour } from "react-icons/md"
import { TbLocation } from "react-icons/tb"
import { AiOutlineCar } from "react-icons/ai"

import Tour from '../../../../components/card/Tour'
import Destination from '@/components/card/Destination'
import Transportation from '@/components/card/Transportation'

const Tourism: React.FC = () => {
  const [selected, setSelected] = React.useState<Set<any>>(new Set(["tour"]));

  return (
    <div>
      <div>
        <Tabs
          aria-label="Dynamic tabs"
          color='primary'
          variant='light'
          className='max-w-full flex flex-col justify-center'
          selectedKey={Array.from(selected)[0]}
          onSelectionChange={(key) => setSelected(new Set([key]))}
        >
          <Tab key="tour" title={
            <div className='flex flex-row items-center gap-2'>
              <MdOutlineTour className="text-lg" />
              <span>Tour</span>
            </div>
          }>
            <Tour />
          </Tab>

          <Tab key="destination" title={
            <div className='flex flex-row items-center gap-2'>
              <TbLocation className="text-lg" />
              <span>Điểm đến</span>
            </div>
          }>
            <Destination />
          </Tab>

          <Tab key="transportation" title={
            <div className='flex flex-row items-center gap-2'>
              <AiOutlineCar className="text-lg" />
              <span>Phương tiện</span>
            </div>
          }>
            <Transportation />
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}

export default Tourism