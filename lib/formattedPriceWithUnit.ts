export const formattedPriceWithUnit = (data: number | undefined, unit?: string | undefined): string => {
  let result = "";
  if (data) {
    const formattedPrice = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(data);

    result = `${formattedPrice}/${unit || "Kg"}`;
    return result;
  } else {
    return `0/${unit || "Kg"}`
  }
}