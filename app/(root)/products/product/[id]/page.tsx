import React from "react";

type Props = {
  params: { id: string };
};

const ProductDetail: React.FC<Props> = ({ params }) => {
  return <div>{params.id}</div>;
};
export default ProductDetail;
