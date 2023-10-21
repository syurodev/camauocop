import { getProducts } from '@/actions/products'
import CardItem from '@/components/card/CardItem'
import { Card, CardBody, CardFooter, Skeleton } from '@nextui-org/react'
import React from 'react'

type IProps = {
  shopId: string
  shopAuth: boolean
}

const Products: React.FC<IProps> = ({ shopId, shopAuth }) => {

  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [products, setProducts] = React.useState<IProducts[]>([]);

  React.useEffect(() => {
    const fetchApi = async () => {
      setIsLoading(true)
      const data = await getProducts(1, shopId)
      setProducts(data.products)
      setIsLoading(false)
    }
    fetchApi()
  }, [shopId])
  return (
    <>
      <div className="grid items-center sm:grid-cols-2 grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 lg:gap-4 xl:gap-5">
        {isLoading
          ? Array.from({ length: 12 }).map((_, index) => (
            <Card shadow="sm" key={index}>
              <Skeleton isLoaded={!isLoading} className="rounded-lg">
                <CardBody className="overflow-visible p-0">
                  <div className="w-full h-[140px]"></div>
                </CardBody>
              </Skeleton>

              <CardFooter className="flex flex-col text-small justify-between">
                <Skeleton isLoaded={!isLoading} className="rounded-lg">
                  <b className="line-clamp-2">productname</b>
                </Skeleton>
                <Skeleton isLoaded={!isLoading} className="rounded-lg mt-2">
                  <p className="text-default-500">productprice</p>
                </Skeleton>
              </CardFooter>
            </Card>
          ))
          : products.length > 0 &&
          products.map((item) => {
            return <CardItem
              key={item?._id}
              data={item}
              editButton={shopAuth || false}
              deleteButton={shopAuth || false}
            />;
          })}
      </div>
    </>
  )
}

export default React.memo(Products)