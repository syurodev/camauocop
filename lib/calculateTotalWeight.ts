import { convertWeight } from "./convertWeight";

export function calculateTotalWeight(data: IOrderDetail) {
  let totalWeight = 0;

  for (const product of data.products) {
    if (product.unit === "gram") {
      totalWeight += product.weight * product.quantity
    } else {
      const weight = convertWeight(product.weight, product.unit, "gram")
      totalWeight += weight * product.quantity
    }
  }

  return totalWeight;
}