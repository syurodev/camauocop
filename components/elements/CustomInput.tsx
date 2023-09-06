import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

type Props = {
  onChange: (url?: string | string[]) => void;
  value: number | undefined;
};

const CustomInput: React.FC<Props> = ({ onChange, value }) => {
  const [priceInputFormated, setPriceInputFormated] = useState<string>("");

  useEffect(() => {
    const handlePriceChange = () => {
      //const numericValue = parseFloat(value);
      if (value && !isNaN(value)) {
        const formattedPrice = new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(value);

        // Cập nhật giá trị vào trạng thái priceInput
        const formattedPriceWithUnit = `${formattedPrice}/Kg`;
        setPriceInputFormated(formattedPriceWithUnit);
      } else {
        setPriceInputFormated("");
      }
    };
    handlePriceChange();
  }, [value]);

  return (
    <div className="relative">
      <Input
        type="number"
        placeholder="Giá sản phẩm"
        onChange={(e) => onChange(e.target.value)}
      />
      <span className="absolute top-1/2 -translate-y-1/2 right-0 px-3 border-l-2">
        {priceInputFormated}
      </span>
    </div>
  );
};

export default CustomInput;
