import { searchProducts } from "@/actions/products";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type IProps = {
  params: {
    slug: string;
  };
};

const ProductsPage: React.FC<IProps> = async ({ params }) => {
  const slug = decodeURIComponent(params.slug);

  const data: IProductsResponse = await searchProducts(slug, 1);
  return (
    <>
      <Card>
        <CardHeader></CardHeader>
      </Card>
    </>
  );
};
export default ProductsPage;
