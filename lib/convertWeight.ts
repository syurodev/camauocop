export const convertWeight = (quantity: number, fromUnit: WeightUnit, toUnit: WeightUnit): number => {
  const unitsInKg: Record<WeightUnit, number> = {
    'tấn': 1000 * 1000,
    'kg': 1000,
    'gram': 1,
  };

  if (!(fromUnit in unitsInKg) || !(toUnit in unitsInKg)) {
    throw new Error('Invalid weight unit');
  }

  // Chuyển đổi qua kg trước, sau đó chuyển đổi sang đơn vị đích
  const quantityInKg = quantity * unitsInKg[fromUnit];
  return quantityInKg / unitsInKg[toUnit];
}