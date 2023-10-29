import React from 'react'
import { Avatar, Image, useDisclosure } from '@nextui-org/react'
import { motion } from 'framer-motion'

import ImageView from '../modal/ImageView'

type IProps = {
  data: CommentResponse
  index: number
}

const CommentItem: React.FC<IProps> = ({ data, index }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: index / 10 }}
    >
      <div className='flex flex-row gap-3 items-start'>
        <Avatar
          src={data.userImage}
          alt={data.username}
          size='sm'
          radius='full'
        />
        <div className='flex flex-col'>
          <p className='font-medium'>{data.username}</p>
          <p>{data.text}</p>
          {
            data.images && data.images.length > 0 && (
              <div className='flex flex-row gap-3 items-center justify-start h-40px mb-2'>
                {
                  data.images.map((image, index) => {
                    return (
                      <Image
                        key={index}
                        src={image}
                        height={40}
                        width={40}
                        radius='full'
                        alt='comment image'
                        className='object-cover cursor-pointer'
                        onClick={onOpen}
                      />
                    )
                  })
                }
              </div>
            )
          }
        </div>
      </div>

      {
        data.images && <ImageView
          images={data.images}
          isOpen={isOpen}
          onClose={onClose}
          onOpenChange={onOpenChange}
        />
      }

    </motion.div>
  )
}

export default React.memo(CommentItem)