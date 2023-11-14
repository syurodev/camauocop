"use client";

import * as React from "react";
import { Card, Image, CardHeader, CardBody, Button, Skeleton } from "@nextui-org/react";
import { useRouter } from "next/navigation";

import { getSpecialtysDetail } from "@/actions/specialty";
import RenderDescription from "@/app/(root)/products/product/[id]/components/RenderDescription";

const Categories: React.FC = () => {
  const [categories, setCategories] = React.useState<SpecialtysDetail[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  const router = useRouter();
  React.useEffect(() => {
    const fetchApi = async () => {
      setIsLoading(true)
      const res = await getSpecialtysDetail()
      setIsLoading(false)
      if (res.code === 200) {
        setCategories(JSON.parse(res.data!))
      }
    }
    fetchApi()
  }, [])

  return (
    <div className="flex w-full flex-col gap-3">
      <div
        className="flex flex-row items-center"
      >
        <h3
          className="w-full text-left font-bold text-2xl"
        >
          OCOP
        </h3>

        <Button
          size="sm"
          variant="flat"
          className="border-none"
          onPress={() => router.push(`/specialty`)}
        >
          Xem tất cả
        </Button>
      </div>

      <div
        // className="flex flex-row whitespace-nowrap gap-3 items-start justify-start"
        className="w-full grid items-center sm:grid-cols-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4 xl:gap-5"
      >
        {
          isLoading ? (
            Array.from({ length: 6 }).map((_, index) => {
              return (
                <Skeleton key={index} className="w-full h-[310px] rounded-lg shadow-sm">
                  <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                </Skeleton>
              )
            })
          ) :
            categories.slice(0, 6).map(category => {
              return (
                <Card
                  key={category._id}
                  className="py-4 max-w-[258px] m-auto"
                  isPressable
                  onPress={() => router.push(`/products/ocop/${category._id}`)}
                >
                  <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <p className="text-tiny uppercase font-bold text-primary">Đặc sản</p>
                    <div className='w-full max-h-[60px] overflow-hidden text-small'>
                      <RenderDescription description={category.description} />
                    </div>
                    <h4 className="font-bold text-large line-clamp-1">{category.name}</h4>
                  </CardHeader>
                  <CardBody className="overflow-visible py-2">
                    <Image
                      alt="Card background"
                      src={category.images[0]}
                      width={"100%"}
                      className="object-cover rounded-xl w-[270px] h-[180px]"
                    />
                  </CardBody>
                </Card>
              )
            })
        }
      </div>

    </div>
  );
};

export default Categories;
