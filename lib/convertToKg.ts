export const convertToKg = (value: number, unit: string): number => {
  switch (unit) {
    case "kg":
      return value;
    case "tấn":
      return value * 1000;
    case "gram":
      return value / 1000;
    default:
      return value;
  }
}