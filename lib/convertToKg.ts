export const convertToKg = (value: number, unit: string): number => {
  switch (unit) {
    case "Kg":
      return value;
    case "Tấn":
      return value * 1000;
    case "Gam":
      return value / 1000;
    default:
      return value;
  }
}