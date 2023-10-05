export const formattedPriceWithUnit = (defaultPrice: number | undefined, unit: WeightUnit = "kg", quantities: number = 1): string => {
  if (defaultPrice) {
    let totalPrice: number;

    switch (unit) {
      case 'kg':
        totalPrice = defaultPrice * quantities;
        break;
      case 'gram':
        totalPrice = (defaultPrice / 1000) * quantities;
        break;
      case 'tấn':
        totalPrice = (defaultPrice * 1000) * quantities;
        break;
      default:
        throw new Error('Đơn vị tính không hợp lệ');
    }

    const formattedTotalPrice = totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    return `${formattedTotalPrice}`;
  } else {
    return `0`
  }
}