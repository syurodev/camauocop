export function formatDate(dateString: string): string {
  const dateObject = new Date(dateString);

  const year = dateObject.getFullYear();
  const month = dateObject.getMonth() + 1; // Tháng bắt đầu từ 0 nên cần cộng 1
  const day = dateObject.getDate();

  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
}