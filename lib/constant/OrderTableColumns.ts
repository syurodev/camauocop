export const getColumns = (auth: boolean) => {
  if (auth) {
    return [
      { name: "Khách hàng", uid: "buyerUsername", sortable: true },
      { name: "Ngày mua", uid: "orderDateConvert", sortable: true },
      { name: "Trạng thái", uid: "status", sortable: true },
      { name: "Giá trị đơn hàng", uid: "totalAmount", sortable: true },
      { name: "Thao tác", uid: "actions" },
    ];
  } else {
    return [
      { name: "Cửa hàng", uid: "shopName", sortable: true },
      { name: "Ngày mua", uid: "orderDateConvert", sortable: true },
      { name: "Trạng thái", uid: "status", sortable: true },
      { name: "Giá trị đơn hàng", uid: "totalAmount", sortable: true },
      { name: "Thao tác", uid: "actions" },
    ];
  }
} 