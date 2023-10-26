import React from 'react'
import { Avatar, Image, useDisclosure } from '@nextui-org/react'
import ImageView from '../modal/ImageView'

type IProps = {
  data: CommentResponse
}

const CommentItem: React.FC<IProps> = ({ data }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <>
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

    </>
  )
}

export default React.memo(CommentItem)